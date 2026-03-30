import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendorGuard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Verifying Access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toLowerCase();
  const isVendor = userRole === 'vendor' || userRole === 'seller';

  if (!isVendor) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default VendorGuard;
