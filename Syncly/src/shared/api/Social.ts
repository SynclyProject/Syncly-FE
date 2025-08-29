
export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; 
  window.location.href = `${API_BASE}/api/oauth2/google`;
};