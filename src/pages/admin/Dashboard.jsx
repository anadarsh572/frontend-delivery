import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Store, Navigation, Activity, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockDb';
import apiClient from '../../api/client';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ users: [], stores: [] });
  const [loading, setLoading] = useState(true);

  const [editingRoleUser, setEditingRoleUser] = useState(null);
  const [notifyingVendorId, setNotifyingVendorId] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('برجاء تجديد الاشتراك لاستمرار عرض منتجاتك');

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/users');
      setData(prev => ({ ...prev, users: response.data }));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Optional: keep mock data as fallback or show error
      setData(prev => ({ ...prev, users: MOCK_USERS }));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}`, { role: newRole });
      if (response.status === 200) {
        setData(prev => ({
          ...prev,
          users: prev.users.map(u => u.id === userId ? { ...u, role: newRole } : u)
        }));
      }
    } catch (error) {
      console.error("Error updating role", error);
    } finally {
      setEditingRoleUser(null);
    }
  };

  const handleStatusToggle = async (userObj) => {
    const userId = userObj.id;
    const newStatus = !userObj.is_active;
    
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}`, { is_active: newStatus });
      if (response.status === 200) {
        setData(prev => ({
          ...prev,
          users: prev.users.map(u => u.id === userId ? { ...u, is_active: newStatus } : u)
        }));
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الحساب نهائياً؟")) {
      try {
        const response = await apiClient.delete(`/api/admin/users/${userId}`);
        if (response.status === 200) {
          setData(prev => ({
            ...prev,
            users: prev.users.filter(u => u.id !== userId)
          }));
        }
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in as Admin</div>;

  const customersCount = data.users.filter(u => u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'customer').length;
  const vendorsCount = data.users.filter(u => u.role?.toLowerCase() === 'vendor' || u.role?.toLowerCase() === 'seller').length;
// Removed Driver count

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Platform Overview</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage all registered entities on the platform.</p>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Users size={18} /> <span>Customers</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{customersCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Store size={18} /> <span>Vendors/Stores</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{vendorsCount}</p>
        </div>
        {/* Removed Driver card */}
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Activity size={18} /> <span>Active Orders</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</p>
        </div>
        {/* Removed Platform Earnings card */}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Recent Users directory</h2>
      
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading directory...</div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>User</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Contact</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Role</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => {
                const userId = u._id || u.id;
                const isBlocked = u.status === 'blocked';
                return (
                <tr key={userId} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <p style={{ fontWeight: 'bold' }}>{u.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontSize: '0.9rem' }}>{u.email}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.phone || 'N/A'}</p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {editingRoleUser === userId ? (
                      <select 
                        defaultValue={u.role || 'Customer'}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                        onBlur={() => setEditingRoleUser(null)}
                        autoFocus
                        style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Vendor">Vendor</option>
                        <option value="Customer">Customer</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 'bold', 
                          background: u.role === 'Admin' || u.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : u.role === 'Vendor' || u.role === 'vendor' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                          color: u.role === 'Admin' || u.role === 'admin' ? 'var(--warning)' : u.role === 'Vendor' || u.role === 'vendor' ? 'var(--success)' : 'var(--info)' }}>
                          {u.role || 'Customer'}
                        </span>
                        <button onClick={() => setEditingRoleUser(userId)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                          <Edit size={14} className="card-hover" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button 
                      onClick={() => handleStatusToggle(u)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: u.is_active ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                      {u.is_active ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      {u.is_active ? 'نشط' : 'معطل'}
                    </button>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button 
                      onClick={() => handleDelete(userId)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px', borderRadius: 'var(--radius-md)' }}
                      title="حذف المستخدم"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
