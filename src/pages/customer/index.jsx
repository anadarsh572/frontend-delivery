import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../../components/layouts/CustomerLayout';
import CustomerHome from './CustomerHome';
import StoreDetail from './StoreDetail';
import Profile from './Profile';

const CustomerApp = () => {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerApp;
