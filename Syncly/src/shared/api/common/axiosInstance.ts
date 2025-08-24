import axios, { AxiosError, AxiosRequestConfig } from "axios";

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
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const isLoginRequest = originalRequest.url?.includes("/api/auth/login");
    if (isLoginRequest) {
      console.log("로그인 요청 에러는 토큰 재발급 시도 하지 않음");
      return Promise.reject(error);
    }

    //로그인 요청이 아닌 경우 토큰 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post("/api/auth/reissue");
        console.log("토큰 재발급 결과 : ", response);
        const newAccessToken = response?.data?.accessToken;
        if (!newAccessToken) {
          console.log("토큰 재발급 실패");
        }
        localStorage.setItem("accessToken", newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (reissueError) {
        console.error("토큰 재발급 실패", reissueError);
        localStorage.removeItem("accessToken");

        if (!window.location.pathname.includes("/login")) {
          throw new Error("토큰이 만료되었습니다. 다시 로그인 해주세요.");
        }
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);
