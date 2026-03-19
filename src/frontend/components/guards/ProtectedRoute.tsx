import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/frontend/auth/AuthContext";

/**
 * ProtectedRoute — wraps authenticated route branches.
 * If user is not authenticated, redirects to login with return URL.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#FEB4C5", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
