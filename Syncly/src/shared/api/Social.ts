
import { axiosInstance } from "../api/common/axiosInstance";

export const BeginGoogleLogin = (onModalClose?: (open: boolean) => void) => {
  onModalClose?.(false); 

  const API_BASE = import.meta.env.VITE_API_URL!;
  const RAW = import.meta.env.VITE_OAUTH_REDIRECT_PATH || "/oauth2/callback";
  const REDIRECT_PATH = RAW.startsWith("/") ? RAW : `/${RAW}`;

  const next = "/my-urls";

  const redirectUri = `${window.location.origin}${REDIRECT_PATH}?next=${encodeURIComponent(next)}`;
 
  window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};


export const getMe = async <T = any>() => {
  const res = await axiosInstance.get<T>("/api/auth/me");
  return res.data;
};
