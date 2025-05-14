import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const GuestRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div><LoadingSpinner /></div>;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;