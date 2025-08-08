// shared/apis/memberapi.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://52.79.102.15:8080
});

// ① 인증 메일 보내기
export const sendEmail = async (email: string) => {
  const { data } = await api.post(
    "http://52.79.102.15:8080/api/member/email/send",
    null,                 // body 없음
    { params: { email } } // 쿼리파라미터로 email 전달
  );
  return data; // <- SignupPage는 이 data만 받음
};

// ② 인증코드 검증
export const verifyEmail = async (email: string, code: string) => {
  const { data } = await api.post(
    "http://52.79.102.15:8080/api/member/email/Verify",
    null,
    { params: { email, code } }
  );
  return data;
};
