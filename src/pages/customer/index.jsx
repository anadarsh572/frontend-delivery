import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '../../components/layouts/CustomerLayout';
import CustomerHome from './CustomerHome';
import StoreDetail from './StoreDetail';
import Profile from './Profile';

const CustomerApp = () => {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/home" element={<CustomerHome />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/customer/home" replace />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerApp;
