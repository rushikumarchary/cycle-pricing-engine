import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRequiredRole } from '../utils/auth';
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Directly redirect to sign in with the current path as redirect target
    return <Navigate to={`/signIn?redirectTo=${encodeURIComponent(location.pathname)}`} />;
  }

  // If requiredRole is specified, check for role-based access
  if (requiredRole && !hasRequiredRole(requiredRole)) {
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'Only Administrators and Managers can access this page.',
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;