// src/api/auth.ts
import { http } from "./http";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const REDIRECT_PATH = import.meta.env.VITE_OAUTH_REDIRECT_PATH || "/oauth2/callback";

export const authAPI = {
  // 1) 구글 로그인 시작(백엔드로 이동)
  beginGoogleLogin(redirectTo?: string) {
    const redirectUri = redirectTo ?? `${window.location.origin}${REDIRECT_PATH}`;
    // 일부 스프링 설정은 서버쪽에서 redirectUri를 고정해두지만,
    // 파라미터를 받도록 해둔 경우 아래 쿼리가 사용됨.
    window.location.href =
      `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  },

  // 2) 내 정보 조회(로그인 확인)
  me() {
    return http.get("/api/auth/me").then((r) => r.data);
  },

  // 3) 로그아웃
  logout() {
    return http.post("/api/auth/logout").then((r) => r.data);
  },
};
