

export const BeginGoogleLogin = () => {
  const API_BASE = import.meta.env.VITE_API_URL; // http://52.79.102.15:8080
  window.location.href = `${API_BASE}/oauth2/authorization/google`;
};
