import { axiosInstance } from "../common/axiosInstance";

//회원가입
export const PostRegister = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axiosInstance.post("/api/member/register", data);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패", error);
    throw error;
  }
};

//이메일 인증
export const PostEmailVerify = async (data: {
  email: string;
  code: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/member/email/verify?email=${data.email}&code=${data.code}`
    );
    return response.data;
  } catch (error) {
    console.error("이메일 인증 실패", error);
    throw error;
  }
};

//이메일 인증코드 전송
export const PostEmailSend = async (data: { email: string }) => {
  try {
    const response = await axiosInstance.post(
      `/api/member/email/send?email=${data.email}`
    );
    return response.data;
  } catch (error) {
    console.error("이메일 인증코드 전송 실패", error);
    throw error;
  }
};
