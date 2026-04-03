import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import VendorLayout from '../../components/layouts/VendorLayout';
import VendorDashboard from './Dashboard';
import VendorProducts from './Products';
import VendorOrders from './Orders';
import VendorPayments from './Payments';
import VendorShipping from './Shipping';
import VendorOnboarding from './Onboarding';
import { useAuth } from '../../context/AuthContext';

const VendorApp = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user && (!user.has_store || user.has_store === 0) && location.pathname !== '/vendor/onboarding') {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  return (
    <VendorLayout>
      <Routes>
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/products" element={<VendorProducts />} />
        <Route path="/payments" element={<VendorPayments />} />
        <Route path="/wallet" element={<Navigate to="/vendor/payments" replace />} />
        <Route path="/shipping" element={<VendorShipping />} />
        <Route path="/orders" element={<VendorOrders />} />
        <Route path="/settings" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>إعدادات المتجر (Store Settings)</h2></div>} />
        <Route path="/onboarding" element={<VendorOnboarding />} />
        <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
      </Routes>
    </VendorLayout>
  );
};

export default VendorApp;
