
export const Social = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL; // https://www.syncly-io.com/api
  const RAW = import.meta.env.VITE_OAUTH_REDIRECT_PATH || "/oauth2/success";
  const REDIRECT_PATH = RAW.startsWith("/") ? RAW : `/${RAW}`;

  const redirectUri = `${window.location.origin}${REDIRECT_PATH}`;

  // ✅ API_BASE 뒤에 /api 중복 안 되도록 확인!
  window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};