import { axiosInstance, refreshAxios } from "./common/axiosInstance";


//로그인
export const PostLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("로그인 실패", error);
  }
};

//로그아웃
export const PostLogout = async () => {
  try {
    await axiosInstance.post("/api/auth/logout");
    console.log("로그아웃 성공");
  } catch (error) {
    console.error("로그아웃 실패", error);
  }
};

//토큰 재발급
export const PostReissue = async () => {
  try {
    const response = await refreshAxios.post("/api/auth/reissue");
    return response.data;
  } catch (error) {
    console.error("토큰 재발급 실패", error);
    throw error;
  }
};
