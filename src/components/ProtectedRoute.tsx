
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresStaff?: boolean;
}

const ProtectedRoute = ({ children, requiresStaff = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isStaff, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-hospital-200"></div>
          <div className="h-2 w-24 bg-hospital-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresStaff && !isStaff) {
    // Redirect to patient dashboard if staff access is required but user is not staff
    return <Navigate to="/patient-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
