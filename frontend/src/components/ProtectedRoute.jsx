import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // ✅ Attendre la fin de la vérification
  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  // ✅ Seulement après, on redirige si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;