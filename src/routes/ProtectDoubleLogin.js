import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export const ProtectDoubleLogin = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
