import { useEffect } from "react";
import { axiosInstance} from "./axiosInstance";
import { PostReissue } from "../Auth";

export default function OAuthSuccessPage() {
  useEffect(() => {
    (async () => {
      try {
        const data = await PostReissue();
        const accessToken: string = data?.accessToken;
        if (!accessToken) throw new Error("No accessToken");

        localStorage.setItem("accessToken", accessToken);
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