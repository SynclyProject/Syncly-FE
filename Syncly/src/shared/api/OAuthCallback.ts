import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshAxios } from "../api/common/axiosInstance";
import { getMe } from "../api/Social";

export default function App() {
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (location.pathname === "/oauth2/callback") {
      (async () => {
        try {
          const { data } = await refreshAxios.post("/api/auth/reissue");
          if (data?.result?.accessToken) {
            localStorage.setItem("accessToken", data.result.accessToken);
          }
          await getMe();
          nav("/", { replace: true });
        } catch {
          nav("/login", { replace: true });
        }
      })();
    }
  }, [location, nav]);

  return (
    null
  );
}
