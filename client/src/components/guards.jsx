import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../store/auth';
import { Loading } from './ui';

export function RequireAuth({ children, admin = false }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
