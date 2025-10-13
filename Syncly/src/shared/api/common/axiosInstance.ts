import axios, { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 재발급 인터셉터 (강의 참고)
//기존 코드

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomAxiosRequestConfig = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.includes("/api/auth/reissue")) {
      localStorage.removeItem("accessToken");
      // refresh 쿠키는 HttpOnly라 JS에서 제거 불가. 서버에서 만료시키는 방식 사용.
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === "만료된 토큰입니다."
    ) {
      originalRequest._retry = true;
      if (refreshPromise) {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance.request(originalRequest);
      }
      refreshPromise = (async () => {
        const { data, status } = await refreshAxios.post("/api/auth/reissue");
        if (status !== 200 || !data?.result?.accessToken) {
          throw new Error("토큰 재발급 실패");
        }
        const newAccessToken: string = data.result.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      })();
    }

    // 401 재발급 흐름이 아닌 경우에는 재시도하지 않고 에러를 그대로 반환
    if (!refreshPromise) {
      return Promise.reject(error);
    }

    try {
      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance.request(originalRequest);
    } catch (e) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      refreshPromise = null;
    }
  }
);

//수정 버전
/*
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomAxiosRequestConfig = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.includes("/api/auth/reissue")) {
      localStorage.removeItem("accessToken");
      // refresh 쿠키는 HttpOnly라 JS에서 제거 불가. 서버에서 만료시키는 방식 사용.
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === "만료된 토큰입니다."
    ) {
      originalRequest._retry = true;

      // 이미 토큰 재발급이 진행 중인 경우 기다림
      if (refreshPromise) {
        try {
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance.request(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // 새로운 토큰 재발급 시작
      refreshPromise = (async () => {
        try {
          const { data, status } = await refreshAxios.post("/api/auth/reissue");
          if (status !== 200 || !data?.result?.accessToken) {
            throw new Error("토큰 재발급 실패");
          }
          const newAccessToken: string = data.result.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          return newAccessToken;
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  }
);
*/
