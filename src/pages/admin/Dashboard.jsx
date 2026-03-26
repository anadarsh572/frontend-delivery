import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Store, Activity, Trash2, CheckCircle, XCircle, Search, ShieldAlert, Package, MapPin, RefreshCw, Smartphone } from 'lucide-react';
import apiClient from '../../api/client';
import { API_URL } from '../../api/config';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ users: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'vendors', 'orders'
  
  const [adminEmailSearch, setAdminEmailSearch] = useState('');

  useEffect(() => {
    if (user) {
      if (activeTab === 'orders') {
        fetchOrders();
      } else {
        fetchUsers();
      }
    }
  }, [user, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/users');
      let usersList = Array.isArray(response.data) ? response.data : (response.data.users || []);
      setData(prev => ({ ...prev, users: usersList }));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await fetch(`${API_URL}/api/admin/orders`); // Adjust as per your real backend
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } else {
        // Fallback or empty if endpoint missing
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching admin orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Optimistic Update
    const previousUsers = [...data.users];
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId || u._id === userId ? { ...u, role: newRole } : u)
    }));

    try {
      const response = await apiClient.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error("Error updating role", error);
      alert('فشل في تحديث الدور');
      setData(prev => ({ ...prev, users: previousUsers })); // Revert
    }
  };

  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmailSearch.trim()) return;
    
    const targetUser = data.users.find(u => u.email.toLowerCase() === adminEmailSearch.toLowerCase());
    if (!targetUser) {
      alert('لم يتم العثور على مستخدم بهذا البريد الإلكتروني في القائمة الحالية.');
      return;
    }
    
    if (window.confirm(`هل أنت متأكد من تعيين ${targetUser.name} كمدير (Admin)؟`)) {
      handleRoleChange(targetUser.id || targetUser._id, 'admin');
      setAdminEmailSearch('');
    }
  };

  const handleStatusToggle = async (userObj) => {
    const userId = userObj.id || userObj._id;
    const newStatus = !userObj.is_active;
    
    // Optimistic Update
    const previousUsers = [...data.users];
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId || u._id === userId ? { ...u, is_active: newStatus } : u)
    }));
    
    try {
      // Corrected to use PATCH and /status endpoint
      const response = await apiClient.patch(`/api/admin/users/${userId}/status`, { is_active: newStatus });
      if (response.status !== 200 && response.status !== 201) {
         throw new Error('Failed');
      }
    } catch (error) {
      console.error("Error updating status", error);
      setData(prev => ({ ...prev, users: previousUsers })); // Revert
      alert('فشل في تحديث حالة المستخدم');
    }
  };

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in as Admin</div>;

  const customers = data.users.filter(u => u.role?.toLowerCase() === 'user' || u.role?.toLowerCase() === 'customer' || !u.role);
  const vendors = data.users.filter(u => u.role?.toLowerCase() === 'vendor' || u.role?.toLowerCase() === 'seller');
  const admins = data.users.filter(u => u.role?.toLowerCase() === 'admin');

  const renderUsersTable = (userList, isVendor = false) => (
    <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--accent-primary)' }}>
          <tr>
            <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>المستخدم</th>
            <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>معلومات الاتصال</th>
            {isVendor && <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>تصنيف المتجر</th>}
            <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>الحالة</th>
            <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold', textAlign: 'center' }}>إجراءات إدارية</th>
          </tr>
        </thead>
        <tbody>
          {userList.length === 0 ? (
             <tr><td colSpan={isVendor ? 5 : 4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>لا يوجد بيانات</td></tr>
          ) : userList.map(u => {
            const userId = u._id || u.id;
            return (
            <tr key={userId} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }} className="card-hover">
              <td style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-tertiary), rgba(255, 90, 31, 0.1))', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--warning)', flexShrink: 0 }}>
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{u.name}</p>
                    {admins.find(a => a.id === userId) && <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>مدير (Admin)</span>}
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{u.email}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                   <Smartphone size={14} color="var(--success)"/> <span dir="ltr">{u.phone || 'غير مسجل'}</span>
                </div>
              </td>
              {isVendor && (
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ background: 'var(--bg-tertiary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', border: '1px dashed var(--accent-primary)', color: 'var(--text-primary)' }}>
                    {u.store_category === 'restaurant' ? 'مطعم 🍔' : u.store_category === 'cafe' ? 'كافيه ☕' : u.store_category === 'supermarket' ? 'سوبر ماركت 🛒' : (u.store_category || 'غير محدد')}
                  </span>
                </td>
              )}
              <td style={{ padding: '16px 24px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: u.is_active !== false ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '0.95rem', background: u.is_active !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
                  {u.is_active !== false ? <><CheckCircle size={16} /> نشط</> : <><XCircle size={16} /> محظور</>}
                </span>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleStatusToggle({ ...u, is_active: u.is_active !== false ? true : false })}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem', color: u.is_active !== false ? 'var(--danger)' : 'var(--success)', borderColor: u.is_active !== false ? 'var(--danger)' : 'var(--success)' }}
                  >
                    {u.is_active !== false ? 'حظر الحساب' : 'فك الحظر'}
                  </button>
                  
                  {isVendor ? (
                    <button 
                      onClick={() => handleRoleChange(userId, 'customer')}
                      className="btn"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      تجرید لصلاحية (عميل)
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRoleChange(userId, 'vendor')}
                      className="btn"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      ترقية إلى (بائع)
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );

  const renderOrders = () => {
    if (loadingOrders) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>جاري تحميل الطلبات...</div>;
    if (orders.length === 0) return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Package size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>لا توجد طلبات جارية في المنصة</h4>
      </div>
    );

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {orders.map(order => (
          <div key={order.id || order._id} className="glass-panel" style={{ padding: '24px', borderTop: `4px solid var(--accent-primary)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>طلب #{order.id || (order._id && order._id.slice(-6))}</h4>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{order.date || new Date().toLocaleString()}</span>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {order.status}
              </span>
            </div>
            <div style={{ marginBottom: '16px', background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>العميل:</span>
                <strong>{order.customer_name || '...'}</strong>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>الإجمالي:</span>
                <strong className="gradient-text" style={{ fontSize: '1.2rem' }}>{order.total || order.total_price} ج.م</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-up" dir="rtl">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '900' }}>مركز السيطرة المركزي</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>إدارة شاملة للمستخدمين، المتاجر، وعمليات المنصة.</p>
        </div>

        {/* Add Admin Feature */}
        <form onSubmit={handleMakeAdmin} className="glass-panel" style={{ display: 'flex', gap: '12px', padding: '16px', alignItems: 'center', border: '1px solid var(--warning)', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)' }}>
          <div>
            <h4 style={{ color: 'var(--warning)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={16} /> تعيين كمسؤول (Admin)</h4>
            <input 
              type="email" 
              placeholder="ابحث بالبريد الإلكتروني..." 
              value={adminEmailSearch}
              onChange={(e) => setAdminEmailSearch(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', width: '250px', outline: 'none' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '42px', marginTop: 'auto', background: 'var(--warning)', color: '#000' }}>
            ترقية
          </button>
        </form>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRight: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Users size={20} color="var(--info)" /> <span style={{ fontSize: '1.1rem' }}>إجمالي العملاء</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--info)' }}>{customers.length}</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRight: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Store size={20} color="var(--success)" /> <span style={{ fontSize: '1.1rem' }}>المتاجر النشطة</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--success)' }}>{vendors.length}</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRight: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <ShieldAlert size={20} color="var(--warning)" /> <span style={{ fontSize: '1.1rem' }}>المديرين</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--warning)' }}>{admins.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button 
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
        >
          <Users size={18} style={{ marginRight: '8px' }} /> إدارة العملاء
        </button>
        <button 
          onClick={() => setActiveTab('vendors')}
          className={`btn ${activeTab === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
        >
          <Store size={18} style={{ marginRight: '8px' }} /> البائعين والمنشآت
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
        >
          <Activity size={18} style={{ marginRight: '8px' }} /> الطلبات العامة بالموقع
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '500px' }}>
        {loading && activeTab !== 'orders' ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--accent-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <RefreshCw size={40} className="spinning" />
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>جاري المزامنة مع قاعدة البيانات...</p>
          </div>
        ) : (
          <>
            {activeTab === 'users' && renderUsersTable(customers, false)}
            {activeTab === 'vendors' && renderUsersTable(vendors, true)}
            {activeTab === 'orders' && renderOrders()}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default AdminDashboard;
