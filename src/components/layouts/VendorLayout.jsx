import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Package, Settings, LogOut, Tags, Menu, X, LayoutDashboard, ClipboardList, Clock, Truck, MessageSquare, Moon, Globe, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '../../api/config';

const VendorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!user) return;
    const fetchPendingCount = async () => {
      try {
        const storeId = user.storeId || user.id || user._id;
        const response = await fetch(`${API_URL}/api/orders/store/${storeId}`);
        if (response.ok) {
          const data = await response.json();
          const orders = Array.isArray(data) ? data : data.orders || [];
          const pending = orders.filter(o => o.status === 'Pending').length;
          setPendingCount(pending);
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { path: '/vendor/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { path: '/vendor/products', icon: Package, label: 'المنتجات' },
    { path: '/vendor/categories', icon: Tags, label: 'الفئات' },
    { path: '/vendor/coupons', icon: Clock, label: 'إدارة الكوبونات' },
    { path: '/vendor/store', icon: Store, label: 'الملفات' },
    { path: '/vendor/payments', icon: CreditCard, label: 'الدفعات' },
    { path: '/vendor/shipping', icon: Truck, label: 'الشحن' },
    { path: '/vendor/messages', icon: MessageSquare, label: 'التقييمات والتعليقات' },
    { path: '/vendor/orders', icon: ClipboardList, label: 'الطلبات', badge: pendingCount },
  ];

  return (
    <div className="new-dashboard-layout" dir="rtl">
      {/* Sidebar */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="desktop-hidden sidebar-overlay"
        />
      )}
      
      <aside className={`new-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isDesktopExpanded ? 'desktop-expanded' : 'desktop-collapsed'}`}>
        <div className="sidebar-header">
          {isDesktopExpanded ? (
            <div className="sidebar-brand">
              <span style={{fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px'}}>VENDOR</span>
              <button className="toggle-btn" onClick={() => setIsDesktopExpanded(false)}><Menu size={20} /></button>
            </div>
          ) : (
            <button className="toggle-btn collapsed-toggle" onClick={() => setIsDesktopExpanded(true)}><Menu size={20} /></button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} title={!isDesktopExpanded ? item.label : ''}>
                <div className="nav-icon"><item.icon size={22} className={isActive ? 'active-icon' : 'inactive-icon'} /></div>
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
          
          <div className="nav-divider" data-label="تاجر"></div>
          
          <Link to="/vendor/settings" className={`nav-item ${location.pathname.includes('/vendor/settings') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} title={!isDesktopExpanded ? 'إعدادات الموقع' : ''}>
            <div className="nav-icon"><Settings size={22} className={location.pathname.includes('/vendor/settings') ? 'active-icon' : 'inactive-icon'} /></div>
            <span className="nav-label">إعدادات الموقع</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <div className="nav-icon"><Moon size={22} className="inactive-icon" /></div>
            <span className="nav-label">الوضع الداكن</span>
          </button>
          <button className="nav-item">
            <div className="nav-icon"><Globe size={22} className="inactive-icon" /></div>
            <span className="nav-label">English</span>
          </button>
          <button onClick={handleLogout} className="nav-item logout-item">
            <div className="nav-icon"><LogOut size={22} className="danger-icon" /></div>
            <span className="nav-label">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="main-header">
          <div className="header-left">
            {isMobileMenuOpen ? (
              <button className="mobile-toggle desktop-hidden" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            ) : (
              <button className="mobile-toggle desktop-hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
            )}
            
            {user && (
              <div className="user-profile-badge">
                <span className="user-name">{user.name?.split(' ')[0] || 'Clark'}</span>
                <span className="user-role-tag">تاجر</span>
              </div>
            )}
          </div>
          <div className="header-right">
            {/* Any right aligned top-header items */}
          </div>
        </header>
        
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
