
export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; // ex) http://localhost:8080
  window.location.href = `${API_BASE}/oauth2/authorization/google`;
};