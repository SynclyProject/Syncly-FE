// src/api/SocialAuth.tsx

import { refreshAxios } from "../api/common/axiosInstance";

// accessToken 파싱 유틸
const extractAccessToken = (data: any): string | null => {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.accessToken) return data.accessToken;
  if (data.result?.accessToken) return data.result.accessToken;
  if (data.data?.accessToken) return data.data.accessToken;
  return null;
};

// refresh 쿠키로 토큰 재발급
export async function reissueAndStoreToken() {
  const res = await refreshAxios.post("/api/auth/reissue");
  const token = extractAccessToken(res?.data);

  if (!token) throw new Error("No accessToken in reissue response");

  localStorage.setItem("accessToken", token);
  return token;
}