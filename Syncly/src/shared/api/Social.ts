export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; 
  const RAW = import.meta.env.VITE_OAUTH_REDIRECT_PATH || "/api/login/oauth2/code/google";
  const REDIRECT_PATH = RAW.startsWith("/") ? RAW : `/${RAW}`;

  const redirectUri = `${window.location.origin}${REDIRECT_PATH}`;

  window.location.href = `${API_BASE}/api/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};
