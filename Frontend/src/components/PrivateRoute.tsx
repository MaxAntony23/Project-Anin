import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

interface Props { children: React.ReactNode }

export const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
