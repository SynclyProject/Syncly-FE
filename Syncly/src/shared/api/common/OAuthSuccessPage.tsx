/* // src/pages/OAuthSuccessPage.tsx (TS) / .jsx도 OK
import { useEffect } from "react";
import { axiosInstance } from "./axiosInstance";

export default function OAuthSuccessPage() {
  useEffect(() => {
    (async () => {
      try {
        // 백엔드가 OAuth 성공 시 RefreshToken을 HttpOnly 쿠키로 심어둔 상태여야 합니다.
        const { data } = await axiosInstance.post("/auth/reissue", null);
        const accessToken: string = data?.accessToken;
        if (!accessToken) throw new Error("No accessToken");

        localStorage.setItem("token", accessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        const target = sessionStorage.getItem("postLoginRedirect") || "/my-urls";
        sessionStorage.removeItem("postLoginRedirect");
        window.location.replace(target);
      } catch {
        alert("로그인 실패, 다시 시도해주세요.");
        window.location.replace("/login?error=oauth_failed");
      }
    })();
  }, []);

  return <p>구글 로그인 처리</p>;

} */

import { useEffect } from "react";
import axios from "axios";
import { axiosInstance} from "./axiosInstance";


/* export default function OAuthSuccessPage() {
  useEffect(() => {
    // RefreshToken은 이미 쿠키에 있으므로
    // 여기서 /auth/reissue 호출해서 AccessToken 받아오기
    axiosInstance.post("/auth/reissue", null, { withCredentials: true })
      .then(res => {
        const { accessToken } = res.data;
        if (!accessToken) throw new Error("No accessToken");


        localStorage.setItem("token", accessToken);

        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;


        window.location.href = "/my-urls"; // 메인 페이지로 이동
      })
      .catch(() => {
        alert("로그인 실패, 다시 시도해주세요.");
        window.location.href = "/login";
      });
  }, []);

  return <p>구글 로그인 처리중...</p>;
} */

export default function OAuthSuccessPage() {
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.post("/auth/reissue");
        const accessToken: string = data?.accessToken;
        if (!accessToken) throw new Error("No accessToken");

        localStorage.setItem("token", accessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        window.location.replace("/my-urls");
      } catch (err) {
        console.error("Reissue failed:", err);
        alert("로그인 실패, 다시 시도해주세요.");
        window.location.replace("/login");
      }
    })();
  }, []);

  return <p>구글 로그인 처리중...</p>;
}