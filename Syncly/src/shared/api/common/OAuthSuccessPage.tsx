import { useEffect } from "react";
import { reissueAndStoreToken } from "../SocialAuth";

export default function OAuthSuccessPage() {
  useEffect(() => {
    (async () => {
      try {
        await reissueAndStoreToken();
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
