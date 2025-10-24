
export const Social = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const REDIRECT_PATH = import.meta.env.VITE_OAUTH_REDIRECT_PATH;

  const redirectUri = `${window.location.origin}${REDIRECT_PATH}`;


  window.location.href = `${API_BASE}/api/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};

