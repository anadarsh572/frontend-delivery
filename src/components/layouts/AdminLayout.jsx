import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, ShieldCheck, DollarSign, LogOut, Menu, X, LayoutDashboard, Settings, Moon, Globe } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/mustafa-admin-secret/users', icon: Users, label: 'المستخدمين' },
    // Add additional admin specific links here
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
              <span style={{fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px'}}>ADMIN</span>
              <button className="toggle-btn" onClick={() => setIsDesktopExpanded(false)}><Menu size={20} /></button>
            </div>
          ) : (
            <button className="toggle-btn collapsed-toggle" onClick={() => setIsDesktopExpanded(true)}><Menu size={20} /></button>
          )}
        </div>

        <nav className="sidebar-nav">
          <Link to="/mustafa-admin-secret" className={`nav-item ${location.pathname === '/mustafa-admin-secret' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} title={!isDesktopExpanded ? 'لوحة التحكم' : ''}>
            <div className="nav-icon"><LayoutDashboard size={22} className={location.pathname === '/mustafa-admin-secret' ? 'active-icon' : 'inactive-icon'} /></div>
            <span className="nav-label">لوحة التحكم</span>
          </Link>
          
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} title={!isDesktopExpanded ? item.label : ''}>
                <div className="nav-icon"><item.icon size={22} className={isActive ? 'active-icon' : 'inactive-icon'} /></div>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
          
          <div className="nav-divider" data-label="الإدارة"></div>
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
                <span className="user-name">{user.name?.split(' ')[0] || 'Admin'}</span>
                <span className="user-role-tag">مدير</span>
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

export default AdminLayout;
