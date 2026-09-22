import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    console.log("🔍 checkAuth - Début");
    try {
      setLoading(true);
      const response = await api.get("/me");
      console.log("✅ /me OK:", response.data);
      setUser(response.data);
    } catch (error) {
      console.log("🔒 /me KO:", error.response?.status || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("🚪 logout");
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("❌ logout erreur:", error.message);
    } finally {
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  };

  // ✅ Appel TOUJOURS, peu importe la page
  useEffect(() => {
    console.log("🔄 AuthProvider mount → checkAuth");
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être dans AuthProvider");
  return context;
}