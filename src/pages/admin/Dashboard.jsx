import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Store, Navigation, Activity, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_USERS, MOCK_STORES, simulateDelay } from '../../data/mockDb';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ users: [], stores: [] });
  const [loading, setLoading] = useState(true);

  const [editingRoleUser, setEditingRoleUser] = useState(null);
  const [notifyingVendorId, setNotifyingVendorId] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('برجاء تجديد الاشتراك لاستمرار عرض منتجاتك');
  const [earnings, setEarnings] = useState(1500); // Mock earnings for now

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const usersArray = await response.json();
        setData(prev => ({ ...prev, users: usersArray }));
      } else {
        // Fallback to mock data if API fails
        setData(prev => ({ ...prev, users: MOCK_USERS }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setData(prev => ({ ...prev, users: MOCK_USERS }));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        // Optimistically update UI
        setData(prev => ({
          ...prev,
          users: prev.users.map(u => u._id === userId || u.id === userId ? { ...u, role: newRole } : u)
        }));
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Network error updating role", error);
    } finally {
      setEditingRoleUser(null);
    }
  };

  const handleStatusToggle = async (user) => {
    const userId = user._id || user.id;
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setData(prev => ({
          ...prev,
          users: prev.users.map(u => u._id === userId || u.id === userId ? { ...u, status: newStatus } : u)
        }));
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Network error updating status", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("هل أنت متأكد يا درش؟")) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          setData(prev => ({
            ...prev,
            users: prev.users.filter(u => u._id !== userId && u.id !== userId)
          }));
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Network error deleting user", error);
      }
    }
  };

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in as Admin</div>;

  const customersCount = data.users.filter(u => u.role === 'Customer').length;
  const vendorsCount = data.users.filter(u => u.role === 'Vendor').length;
  const driversCount = data.users.filter(u => u.role === 'Driver').length;

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
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Navigation size={18} /> <span>Drivers</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{driversCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Activity size={18} /> <span>Active Orders</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>EGP</span> <span>أرباح المنصة</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{earnings}</p>
        </div>
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
                        <option value="Driver">Driver</option>
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
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: isBlocked ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                      {isBlocked ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      {isBlocked ? 'محظور' : 'نشط'}
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

      {/* Vendor Management Section */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>إدارة البائعين</h2>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {data.users.filter(u => u.role?.toLowerCase() === 'vendor').map(vendor => (
              <div key={vendor.id || vendor._id} className="card-hover" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      <Store size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{vendor.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{vendor.email}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    Active Store
                  </span>
                </div>

                {notifyingVendorId === (vendor.id || vendor._id) ? (
                  <div className="animate-fade-up">
                    <textarea 
                      value={notificationMsg}
                      onChange={(e) => setNotificationMsg(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', marginBottom: '12px', minHeight: '80px', fontSize: '0.9rem' }}
                      dir="rtl"
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, justifyContent: 'center', padding: '8px' }}
                        onClick={async () => {
                          try {
                            const resp = await fetch('http://localhost:5000/api/admin/notify-vendor', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                              body: JSON.stringify({ vendor_id: vendor.id || vendor._id, message: notificationMsg })
                            });
                            if (resp.ok) alert('تم إرسال التنبيه بنجاح!');
                            else alert('فشل إرسال التنبيه');
                          } catch (err) { alert('خطأ في الاتصال بالسيرفر'); }
                          setNotifyingVendorId(null);
                        }}
                      >
                        إرسال
                      </button>
                      <button className="btn" style={{ flex: 1, justifyContent: 'center', padding: '8px' }} onClick={() => setNotifyingVendorId(null)}>إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', background: 'var(--warning)', color: 'black' }}
                    onClick={() => setNotifyingVendorId(vendor.id || vendor._id)}
                  >
                    إرسال تنبيه دفع
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
