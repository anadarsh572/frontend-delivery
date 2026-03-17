import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendorGuard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Verifying Access...</div>;
  }

  if (!user || user.role?.toLowerCase() !== 'vendor') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default VendorGuard;
