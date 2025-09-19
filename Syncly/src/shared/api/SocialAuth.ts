// src/api.js
import axios from "axios";

// ❶ Bearer 전용(쿠키 사용 안 함) — 대부분의 API는 이걸로
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// 요청마다 Authorization 붙이기
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("accessToken");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// ❷ 쿠키 전용(리프레시 재발급 전용 등)
export const credApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ★ refresh 쿠키 보내기
});

// accessToken 파싱 유틸(서버 응답 포맷이 ApiResponse/DTO 등 다양할 수 있어서 방어적으로 처리)
const extractAccessToken = (data: any) => {
  // 예) { accessToken: "..."} 또는 { result: { accessToken: "..." } } 등
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.accessToken) return data.accessToken;
  if (data.result?.accessToken) return data.result.accessToken;
  if (data.data?.accessToken) return data.data.accessToken;
  return null;
};

// ❸ 재발급 호출: refresh 쿠키로 accessToken 받기
export async function reissueAndStoreToken() {
  // 서버가 POST /api/auth/reissue 로 토큰 재발급
  const res = await credApi.post("/auth/reissue").catch((e) => {
    throw e?.response || e;
  });
  const token = extractAccessToken(res?.data);
  if (!token) {
    throw new Error("No accessToken in reissue response");
  }
  localStorage.setItem("accessToken", token);
  // 이후 요청에 즉시 반영되도록 기본 헤더 갱신
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  return token;
}