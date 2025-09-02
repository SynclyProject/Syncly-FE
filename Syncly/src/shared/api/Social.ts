/* export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; // 예: https://www.syncly-io.com
  const redirectUri = `${window.location.origin}/oauth2/callback`;

  window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
}; */

export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; 
  const RAW = import.meta.env.VITE_OAUTH_REDIRECT_PATH || "/oauth2/success";
  const REDIRECT_PATH = RAW.startsWith("/") ? RAW : `/${RAW}`;

  const redirectUri = `${window.location.origin}${REDIRECT_PATH}`;

  window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};
