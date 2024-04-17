import { useUser } from '@/hooks/use-user';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {}

export function ProtectedRoute({ ...props }: ProtectedRouteProps) {
  const { isAuthenticated } = useUser();

  if (isAuthenticated === false) return <Navigate to="/" />;
  return <Outlet />;
}
