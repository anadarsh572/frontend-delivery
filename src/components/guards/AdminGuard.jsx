import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminGuard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Verifying Secure Access...</div>;
  }
  
  // Use a case-insensitive check. Some APIs might nest it differently, so we log it.
  console.log("AdminGuard Check - User Object:", user, "Role:", user?.role);

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
