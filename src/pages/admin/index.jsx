import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import AdminDashboard from './Dashboard';
import AdminSettlements from './Settlements';

const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/settlements" element={<AdminSettlements />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
