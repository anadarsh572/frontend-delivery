import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import VendorLayout from '../../components/layouts/VendorLayout';
import VendorDashboard from './Dashboard';
import VendorProducts from './Products';
import VendorOrders from './Orders';
import VendorPayments from './Payments';
import VendorShipping from './Shipping';
import VendorOnboarding from './Onboarding';
import VendorCategories from './Categories';
import VendorCoupons from './Coupons';
import VendorReviews from './Reviews';
import VendorSettings from './Settings';
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
        <Route path="/categories" element={<VendorCategories />} />
        <Route path="/payments" element={<VendorPayments />} />
        <Route path="/wallet" element={<Navigate to="/vendor/payments" replace />} />
        <Route path="/shipping" element={<VendorShipping />} />
        <Route path="/orders" element={<VendorOrders />} />
        <Route path="/coupons" element={<VendorCoupons />} />
        <Route path="/reviews" element={<VendorReviews />} />
        <Route path="/settings" element={<VendorSettings />} />
        <Route path="/onboarding" element={<VendorOnboarding />} />
        <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
      </Routes>
    </VendorLayout>
  );
};

export default VendorApp;
