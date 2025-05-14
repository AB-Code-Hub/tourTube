import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute