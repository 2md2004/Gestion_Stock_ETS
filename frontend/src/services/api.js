import axios from "axios";
import { API_URL } from "../constants/server";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Vérifie si la page actuelle est publique
const isPublicPage = () => {
  const pathname = window.location.pathname;
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/inscription" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reinitialiser-mot-de-passe" ||
    pathname.startsWith("/reservations/")
  );
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ✅ PAGE PUBLIQUE → on ne touche à rien
    if (isPublicPage()) {
      return Promise.reject(error);
    }

    // ✅ Refresh token échoué → déconnexion
    if (originalRequest?.url?.includes("/refresh-token")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // ✅ 401/403 → tentative de refresh (une seule fois)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;