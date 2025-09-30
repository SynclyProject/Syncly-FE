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
  }
};

//비밀번호 변경용 이메일 인증코드 발송
export const PostPasswordEmailSend = async (data: { email: string }) => {
  try {
    const response = await axiosInstance.post(
      `/api/member/password/email/send?email=${data.email}`
    );
    return response.data;
  } catch (error) {
    console.error("비밀번호 변경용 이메일 인증코드 발송 실패", error);
  }
};

//비밀번호 변경용 이메일 인증코드 인증
export const PostPasswordEmailVerify = async (data: {
  email: string;
  code: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/member/password/email/verify?email=${data.email}&code=${data.code}`
    );
    return response.data;
  } catch (error) {
    console.error("비밀번호 변경용 이메일 인증코드 인증 실패", error);
  }
};
