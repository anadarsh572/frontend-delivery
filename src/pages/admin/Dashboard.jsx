import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Store, Activity, Trash2, CheckCircle, XCircle, Search, ShieldAlert, Package, MapPin, RefreshCw, Smartphone } from 'lucide-react';
import apiClient from '../../api/client';
import { API_URL } from '../../api/config';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({ users: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'vendors', 'orders'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'completed', 'pending', 'uncompleted'
  
  const [adminEmailSearch, setAdminEmailSearch] = useState('');

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname.endsWith('/users')) setActiveTab('users');
    else if (location.pathname.endsWith('/vendors')) setActiveTab('vendors');
    else if (location.pathname.endsWith('/orders')) setActiveTab('orders');
  }, [location.pathname]);

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
      console.log("Admin API Response (Users):", response.data);
      
      let usersList = [];
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      } else if (response.data && Array.isArray(response.data.data)) {
        usersList = response.data.data;
      }
      
      setData(prev => ({ ...prev, users: usersList }));
    } catch (error) {
      console.error("Failed to fetch users at /api/admin/users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await apiClient.get('/api/admin/orders');
      console.log("Admin API Response (Orders):", response.data);
      
      let ordersList = [];
      if (Array.isArray(response.data)) {
        ordersList = response.data;
      } else if (response.data && Array.isArray(response.data.orders)) {
        ordersList = response.data.orders;
      } else if (response.data && Array.isArray(response.data.data)) {
        ordersList = response.data.data;
      }
      
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching admin orders at /api/admin/orders", error);
      setOrders([]);
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
                    {u.store_category === 'restaurant' ? 'مطعم 🍔' : u.store_category === 'supermarket' ? 'سوبر ماركت 🛒' : (u.store_category || 'غير محدد')}
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
    
    // Filter logic
    const filteredOrders = orders.filter(order => {
      if (orderFilter === 'all') return true;
      const status = order.status?.toLowerCase() || '';
      
      if (orderFilter === 'completed') {
        const completedStatuses = ['delivered', 'completed', 'تم التوصيل', 'مكتمل'];
        return completedStatuses.includes(status);
      }
      
      if (orderFilter === 'pending') {
        const pendingStatuses = ['pending', 'processing', 'preparing', 'ready', 'ontheway', 'accepted', 'جاري التنفيذ', 'قيد الانتظار', 'جاري التوصيل'];
        return pendingStatuses.includes(status);
      }
      
      if (orderFilter === 'uncompleted') {
        const failedStatuses = ['cancelled', 'rejected', 'failed', 'ملغي', 'مرفوض'];
        return failedStatuses.includes(status);
      }
      return true;
    });

    if (filteredOrders.length === 0) return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Package size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
          {orderFilter === 'all' ? 'لا توجد طلبات جارية في المنصة' : `لا توجد طلبات ${orderFilter === 'completed' ? 'مكتملة' : orderFilter === 'pending' ? 'معلقة' : 'غير مكتملة'} حالياً`}
        </h4>
      </div>
    );

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredOrders.map(order => (
          <div key={order.id || order._id} className="glass-panel" style={{ padding: '24px', borderTop: `4px solid var(--accent-primary)`, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)' }}>طلب #{order.id || (order._id && order._id.slice(-6))}</h4>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{order.date || new Date().toLocaleString()}</span>
              </div>
              <span style={{ 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-full)', 
                background: order.status?.toLowerCase().includes('delivered') || order.status?.toLowerCase().includes('completed') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                color: order.status?.toLowerCase().includes('delivered') || order.status?.toLowerCase().includes('completed') ? 'var(--success)' : 'var(--warning)',
                fontSize: '0.9rem', 
                fontWeight: 'bold',
                border: '1px solid currentColor'
              }}>
                {order.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Users size={16} color="var(--info)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>العميل:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{order.customer_name || '...'}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Store size={16} color="var(--success)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>المتجر:</span>
                  <strong style={{ color: 'var(--warning)' }}>{order.vendor_name || order.store_name || '...'}</strong>
                </div>

                {(() => {
                  let itemsList = [];
                  try {
                    itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
                  } catch (e) { itemsList = []; }
                  
                  if (itemsList.length === 0) return null;
                  
                  return (
                    <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>محتويات الطلب:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {itemsList.map((item, idx) => (
                          <span key={idx} style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                            {item.name} ({item.quantity}x)
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>الإجمالي:</span>
                  <strong className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: '900' }}>{order.total_price || order.total} ج.م</strong>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0 8px' }}>
                 <MapPin size={14} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.customer_address || order.address || order.delivery_address || 'لا يوجد عنوان'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0 8px', marginTop: '4px' }}>
                 <Smartphone size={14} /> <span style={{ direction: 'ltr' }}>{order.customer_phone || order.phone || order.customerPhone || 'بدون رقم'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-up" dir="rtl">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '900' }}>مركز السيطرة المركزي</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>إدارة شاملة للمستخدمين، المتاجر، وعمليات المنصة.</p>
          </div>
          <button 
            onClick={() => activeTab === 'orders' ? fetchOrders() : fetchUsers()} 
            className="btn btn-secondary" 
            style={{ borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}
            title="تحديث البيانات"
            disabled={loading || loadingOrders}
          >
            <RefreshCw size={20} className={loading || loadingOrders ? 'spinning' : ''} />
          </button>
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
          onClick={() => navigate('/mustafa-admin-secret/users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
        >
          <Users size={18} style={{ marginRight: '8px' }} /> إدارة العملاء
        </button>
        <button 
          onClick={() => navigate('/mustafa-admin-secret/vendors')}
          className={`btn ${activeTab === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
        >
          <Store size={18} style={{ marginRight: '8px' }} /> البائعين والمنشآت
        </button>
        <button 
          onClick={() => navigate('/mustafa-admin-secret/orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: 'var(--radius-full)' }}
        >
          <Activity size={18} style={{ marginRight: '8px' }} /> الطلبات العامة بالموقع
        </button>

        {activeTab === 'orders' && (
          <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>تصفية:</span>
            <button 
              onClick={() => setOrderFilter('all')}
              style={{ padding: '4px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', background: orderFilter === 'all' ? 'var(--accent-primary)' : 'transparent', color: orderFilter === 'all' ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
            >
              الكل
            </button>
            <button 
              onClick={() => setOrderFilter('completed')}
              style={{ padding: '4px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', background: orderFilter === 'completed' ? 'var(--success)' : 'transparent', color: orderFilter === 'completed' ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
            >
              المكتملة
            </button>
            <button 
              onClick={() => setOrderFilter('pending')}
              style={{ padding: '4px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', background: orderFilter === 'pending' ? 'var(--info)' : 'transparent', color: orderFilter === 'pending' ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
            >
              المعلقة
            </button>
            <button 
              onClick={() => setOrderFilter('uncompleted')}
              style={{ padding: '4px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', background: orderFilter === 'uncompleted' ? 'var(--danger)' : 'transparent', color: orderFilter === 'uncompleted' ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
            >
              غير المكتملة
            </button>
          </div>
        )}
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
