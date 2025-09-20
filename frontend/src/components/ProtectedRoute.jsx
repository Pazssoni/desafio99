import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component that protects a route from unauthenticated access.
 * If the user is not authenticated, they are redirected to the /auth page.
 * It also displays a loading indicator during the initial auth check.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element | import('react-router-dom').Navigate}
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
}