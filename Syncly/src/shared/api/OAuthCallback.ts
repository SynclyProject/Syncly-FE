// src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAxios } from "../api/common/axiosInstance";
import { getMe } from "../api/Social";

export default function OAuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // 1) refresh 쿠키를 이용해서 accessToken 발급
        const { data, status } = await refreshAxios.post("/api/auth/reissue");
        if (status === 200 && data?.result?.accessToken) {
          localStorage.setItem("accessToken", data.result.accessToken);
        }

        // 2) 로그인 확인
        await getMe();

        // 3) 홈으로 이동
        nav("/", { replace: true });
      } catch (e) {
        console.error("소셜 로그인 콜백 처리 실패", e);
        nav("/login", { replace: true });
      }
    })();
  }, [nav]);

  return null;
}
