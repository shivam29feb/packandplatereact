import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserType } from '../../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
  redirectPath?: string;
}

/**
 * ProtectedRoute component that restricts access to routes based on authentication and user role
 *
 * @param children - The components to render if the user is authenticated and authorized
 * @param allowedRoles - Optional array of roles that are allowed to access this route
 * @param redirectPath - Optional path to redirect to if the user is not authenticated or authorized
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectPath = '/login'
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - allowedRoles:', allowedRoles);
  console.log('ProtectedRoute - current path:', location.pathname);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If allowedRoles is provided and user's role is not in the allowed roles
  if (allowedRoles.length > 0 && user) {
    const hasAccess = allowedRoles.some(role => 
      role === user.type || 
      (role === 'admin' && user.type === 'system-admin')
    );
    
    if (!hasAccess) {
      console.log(`ProtectedRoute: User type '${user.type}' not in allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // If user is authenticated and authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
