import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Package, Settings, LogOut, Wallet, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '../../api/config';

const VendorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <div className="admin-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} dir="rtl">
      {/* Mobile Header - Visible only on mobile */}
      <header className="glass-panel mobile-only-flex" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px 20px', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        background: 'var(--bg-secondary)',
        height: '70px'
      }}>
        <Link to="/vendor" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: '800' }}>
          <span className="gradient-text">لوحة</span>التاجر ⚡
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: '8px', borderRadius: 'var(--radius-md)' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, paddingTop: '0' }} className="flex-responsive">
        {/* Sidebar / Drawer */}
        <>
          {/* Overlay for mobile drawer */}
          {isMenuOpen && (
            <div 
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'rgba(0,0,0,0.6)', 
                backdropFilter: 'blur(4px)', 
                zIndex: 1400 
              }} 
              className="mobile-only-block"
            />
          )}

          <aside className={`glass-panel vendor-sidebar ${isMenuOpen ? 'open' : ''}`} style={{ 
            minWidth: '280px',
            borderRadius: 0, 
            borderTop: 'none', 
            borderRight: 'none', 
            borderBottom: 'none', 
            display: 'flex', 
            flexDirection: 'column',
            zIndex: 1500,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }} className="desktop-only-block">
              <Link to="/vendor" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem', fontWeight: '800' }}>
                <span className="gradient-text">لوحة</span>التاجر ⚡
              </Link>
            </div>

            <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {user ? (
                <>
                  <Link to="/vendor" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'space-between', border: 'none', background: 'transparent', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Store size={20} /> إدارة الطلبات
                    </div>
                    {pendingCount > 0 && (
                      <span style={{ background: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/vendor/products" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '12px 16px' }}>
                    <Package size={20} /> المنتجات
                  </Link>
                  <Link to="/vendor/wallet" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '12px 16px' }}>
                    <Wallet size={20} /> محفظة الأرباح
                  </Link>
                </>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Link to="/login" className="btn btn-primary">دخول التجار</Link>
                </div>
              )}
            </nav>

            {user && (
              <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>حساب تاجر</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)' }}>
                  <LogOut size={18} /> تسجيل الخروج
                </button>
              </div>
            )}
          </aside>
        </>

        {/* Main Content */}
        <main style={{ flex: 1, padding: 'clamp(16px, 5vw, 40px)', overflowX: 'hidden', minHeight: '100vh' }}>
          {/* Spacer for mobile fixed header */}
          <div className="mobile-only-block" style={{ height: '70px' }} />
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .desktop-only-block { display: none !important; }
          .admin-app { padding-top: 0; }
          .vendor-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            transform: translateX(100%);
            background: var(--bg-secondary) !important;
          }
          .vendor-sidebar.open {
            transform: translateX(0);
          }
          .mobile-only-flex { display: flex !important; }
          .mobile-only-block { display: block !important; }
        }
        @media (min-width: 768px) {
          .mobile-only-flex { display: none !important; }
          .mobile-only-block { display: none !important; }
          .vendor-sidebar { transform: none !important; }
        }
      `}} />
    </div>
  );
};

export default VendorLayout;
