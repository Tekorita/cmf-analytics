import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
