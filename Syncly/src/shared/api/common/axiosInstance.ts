import axios, { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
        if (status !== 200 || !data?.accessToken) {
          throw new Error("토큰 재발급 실패");
        }
        const newAccessToken: string = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      })();
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
