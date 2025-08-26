import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

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

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & {
//       _retry?: boolean;
//     };
//     const isLoginRequest = originalRequest.url?.includes("/api/auth/login");
//     if (isLoginRequest) {
//       console.log("로그인 요청 에러는 토큰 재발급 시도 하지 않음");
//       return Promise.reject(error);
//     }

//     //로그인 요청이 아닌 경우 토큰 재발급 시도
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // 토큰 재발급 요청은 인터셉터 없이 직접 axios로 호출
//         const response = await axios.post(
//           "/api/auth/reissue",
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
//             },
//           }
//         );
//         console.log("토큰 재발급 결과 : ", response);
//         if (response.status === 200) {
//           console.log("토큰 재발급 성공");
//           const newAccessToken = response?.data?.accessToken;
//           localStorage.setItem("accessToken", newAccessToken);
//           if (originalRequest.headers) {
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//             return axiosInstance(originalRequest);
//           }
//         }
//       } catch (reissueError) {
//         console.error("토큰 재발급 실패", reissueError);
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         if (!window.location.pathname.includes("/login")) {
//           window.location.href = "/login";
//         }
//         return Promise.reject(reissueError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// 토큰 재발급 인터셉터 (강의 참고)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomAxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === "만료된 토큰입니다."
    ) {
      if (originalRequest.url?.includes("/api/auth/reissue")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }
        const response = await axiosInstance.post(
          "/api/auth/reissue",
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
        }
        return response.data.accessToken;
      })().catch((error) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      });
    }
    return refreshPromise.then((newAccessToken) => {
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance.request(originalRequest);
    });
  }
);
