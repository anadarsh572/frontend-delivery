import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Package, MapPin, Wallet, Star, Clock, Edit2, Plus, CreditCard, LogOut, ChevronLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { API_URL } from '../../api/config';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  // Mock data for addresses & wallet
  const [addresses] = useState([
    { id: 1, title: 'المنزل', details: 'شارع التسعين، التجمع الخامس، القاهرة', isDefault: true },
    { id: 2, title: 'العمل', details: 'مبنى النيل الإداري، المعادي، القاهرة', isDefault: false }
  ]);
  
  const [walletBalance] = useState(150.50);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        const userId = user.id || user._id;
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log('Profile Data:', data);
        
        if (response.ok) {
          const ordersArray = Array.isArray(data) ? data : data.orders || [];
          setOrders(ordersArray);
        } else {
          setErrorOrders(data.message || 'فشل في جلب البيانات من الخادم.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorOrders('حدث خطأ أثناء الاتصال بالخادم. تأكد من تشغيل الباك إند.');
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="animate-fade-up" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>يرجى تسجيل الدخول</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>يجب أن تكون مسجل الدخول لعرض حسابك المتميز.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>تسجيل الدخول</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'info', label: 'معلوماتي', icon: <User size={20} /> },
    { id: 'orders', label: 'طلباتي', icon: <Package size={20} /> },
    { id: 'addresses', label: 'عناويني', icon: <MapPin size={20} /> },
    { id: 'wallet', label: 'المحفظة وطرق الدفع', icon: <Wallet size={20} /> },
  ];

  const renderStatusBadge = (status) => {
    let color, bg, label;
    switch(status) {
      case 'Pending': color = 'var(--text-secondary)'; bg = 'var(--bg-tertiary)'; label = 'قيد المراجعة'; break;
      case 'Preparing': color = 'var(--warning)'; bg = 'rgba(245, 158, 11, 0.1)'; label = 'جاري التجهيز'; break;
      case 'Delivered': color = 'var(--success)'; bg = 'rgba(16, 185, 129, 0.1)'; label = 'تم التوصيل'; break;
      default: color = 'var(--text-primary)'; bg = 'var(--bg-tertiary)'; label = status || 'غير معروف';
    }
    return (
      <span style={{ color, background: bg, padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 'bold' }}>
        {label}
      </span>
    );
  };

  // Content Renders
  const renderInfo = () => (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>بيانات الحساب الأساسية</h3>
        <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.9rem', gap: '8px' }} onClick={() => alert('تحديث البيانات متاح قريباً!')}>
          <Edit2 size={16} /> تعديل البيانات
        </button>
      </div>

      <div style={{ display: 'grid', gap: '24px', background: 'var(--bg-tertiary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>الاسم بالكامل</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.name || user.storeName || 'غير مسجل'}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>رقم الهاتف</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', direction: 'ltr', textAlign: 'right' }}>{user.phone || 'غير مسجل'}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>البريد الإلكتروني</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="animate-fade-up">
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>سجل الطلبات السابقة</h3>
      
      {loadingOrders ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>جاري تحميل طلباتك...</div>
      ) : errorOrders ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-lg)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px' }} />
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>خطأ في التحميل</h4>
          <p>{errorOrders}</p>
          <button className="btn btn-secondary" onClick={() => window.location.reload()} style={{ marginTop: '24px', justifyContent: 'center' }}>إعادة المحاولة</button>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>لا توجد طلبات سابقة</h4>
          <p style={{ color: 'var(--text-secondary)' }}>يبدو أنك لم تطلب أي شيء بعد. أطلب الآن واستمتع بخدمة طلقة!</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '24px', justifyContent: 'center' }}>تصفح المطاعم</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id || order._id} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', transition: 'var(--transition)' }} className="card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '6px', fontWeight: 'bold' }}>طلب #{order.id || (order._id && order._id.slice(-6))}</h4>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> {order.date || new Date().toLocaleString()}</span>
                  </div>
                </div>
                <div>{renderStatusBadge(order.status)}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.6' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>الأصناف: </span>
                    {order.items ? (Array.isArray(order.items) ? order.items.map(i => i.name || i).join('، ') : 'أصناف متنوعة') : 'أصناف متنوعة'}
                  </p>
                </div>
                
                <div style={{ textAlign: 'left', minWidth: '120px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>الإجمالي</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '16px' }}>{order.total || order.total_price} جنيه</p>
                  
                  {order.status === 'Delivered' && (
                    <button className="btn btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.9rem', justifyContent: 'center' }}>
                      <Star size={16} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} /> تقييم الطلب
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>عناوين التوصيل المسجلة</h3>
        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.95rem', gap: '8px' }}>
          <Plus size={18} /> إضافة عنوان جديد
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {addresses.map(addr => (
          <div key={addr.id} style={{ background: 'var(--bg-tertiary)', border: addr.isDefault ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', position: 'relative' }}>
            {addr.isDefault && (
              <span style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--accent-primary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                الافتراضي
              </span>
            )}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 90, 31, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{addr.title}</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{addr.details}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--info)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>تعديل</button>
              <button style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="animate-fade-up">
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>المحفظة الافتراضية</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Balance Card */}
        <div style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(255, 90, 31, 0.05) 100%)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-lg)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', opacity: 0.1 }}>
            <Wallet size={150} color="var(--accent-primary)" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '8px', position: 'relative', zIndex: 1 }}>رصيد الكاش باك المتاح</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-primary)' }}>{walletBalance.toFixed(2)}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>جنيه</span>
          </div>
          <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '16px', position: 'relative', zIndex: 1 }}>
            يمكنك استخدام هذا الرصيد في طلباتك القادمة خصماً من الإجمالي.
          </p>
        </div>

        {/* Saved Cards */}
        <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>طرق الدفع المحفوظة</h4>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: 0 }}><Plus size={20} /></button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#1a1f36', padding: '8px 12px', borderRadius: '6px' }}>
              <CreditCard size={24} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', letterSpacing: '2px', direction: 'ltr', textAlign: 'right' }}>**** **** **** 4242</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ينتهي 12/28</p>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>حذف</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '1200px', margin: '0 auto' }} dir="rtl">
      <div className="profile-layout">
        
        {/* Sidebar */}
        <div className="profile-sidebar glass-panel">
          
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name?.charAt(0) || user.storeName?.charAt(0) || 'M'}
            </div>
            <div className="profile-user-info">
              <h1 className="profile-name gradient-text">{user.name || user.storeName || 'مستخدم متميز'}</h1>
              <p className="profile-email">{user.email || ''}</p>
            </div>
          </div>

          <div className="profile-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronLeft size={18} className="active-arrow" />}
              </button>
            ))}
            
            <button className="profile-tab logout-btn" onClick={handleLogout} style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="tab-icon"><LogOut size={20} /></span>
                <span className="tab-label">تسجيل الخروج</span>
              </div>
            </button>
          </div>

        </div>

        {/* Main Content */}
        <div className="profile-content glass-panel" style={{ minHeight: '500px' }}>
          {activeTab === 'info' && renderInfo()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'addresses' && renderAddresses()}
          {activeTab === 'wallet' && renderWallet()}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 32px;
          align-items: start;
        }

        .profile-sidebar {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 100px;
        }

        .profile-header {
          padding: 32px 24px;
          text-align: center;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(180deg, rgba(255, 90, 31, 0.05) 0%, transparent 100%);
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 900;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(255, 90, 31, 0.3);
          border: 4px solid var(--bg-primary);
        }

        .profile-name {
          font-size: 1.6rem;
          margin-bottom: 4px;
          font-weight: 900;
        }

        .profile-email {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          padding: 16px 0;
        }

        .profile-tab {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 1.1rem;
          cursor: pointer;
          transition: var(--transition);
          text-align: right;
          width: 100%;
          position: relative;
        }

        .profile-tab::before {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--accent-primary);
          transform: scaleY(0);
          transition: transform 0.2s ease;
          border-radius: 4px 0 0 4px;
        }

        .profile-tab:hover {
          background: var(--bg-tertiary);
          color: var(--accent-primary);
        }

        .profile-tab.active {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 90, 31, 0.05) 100%);
          color: var(--accent-primary);
          font-weight: bold;
        }

        .profile-tab.active::before {
          transform: scaleY(1);
        }

        .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .active-arrow {
          color: var(--accent-primary);
          animation: slideLeft 0.3s ease forwards;
        }

        .logout-btn {
          color: var(--danger);
          opacity: 0.8;
        }

        .logout-btn:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.05);
          opacity: 1;
        }

        .profile-content {
          padding: 40px;
        }

        @keyframes slideLeft {
          from { transform: translateX(10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Mobile Responsiveness */
        @media (max-width: 900px) {
          .profile-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .profile-sidebar {
            position: relative;
            top: 0;
          }

          .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 24px;
            text-align: right;
          }

          .profile-avatar {
            margin: 0;
            width: 70px;
            height: 70px;
            font-size: 2rem;
            flex-shrink: 0;
          }

          .profile-nav {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            padding: 0;
            border-top: 1px solid var(--border-color);
            -webkit-overflow-scrolling: touch;
          }

          .profile-tab {
            padding: 16px 20px;
            border-bottom: 3px solid transparent;
            justify-content: center;
            font-size: 1rem;
            flex: 1;
          }

          .profile-tab::before {
            display: none;
          }

          .profile-tab.active {
            border-bottom-color: var(--accent-primary);
            background: rgba(255, 90, 31, 0.05);
          }

          .active-arrow {
            display: none;
          }

          .profile-content {
            padding: 24px 20px;
          }

          .logout-btn {
            border-top: none !important;
            border-right: 1px solid var(--border-color);
          }
        }
      `}} />
    </div>
  );
};

export default Profile;
