/* export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; // 예: https://www.syncly-io.com
  const redirectUri = `${window.location.origin}/oauth2/callback`;

  window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
}; */

export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; 
  const redirectUri = `${window.location.origin}/oauth2/callback`; 
  // → 배포 환경에서는 https://www.syncly-io.com/oauth2/callback 이 됨

  window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};

