import { Routes, Route } from 'react-router-dom';
import VendorLayout from '../../components/layouts/VendorLayout';
import VendorDashboard from './Dashboard';
import VendorProducts from './Products';
import VendorWallet from './Wallet';

const VendorApp = () => {
  return (
    <VendorLayout>
      <Routes>
        <Route path="/" element={<VendorDashboard />} />
        <Route path="/products" element={<VendorProducts />} />
        <Route path="/wallet" element={<VendorWallet />} />
      </Routes>
    </VendorLayout>
  );
};

export default VendorApp;
