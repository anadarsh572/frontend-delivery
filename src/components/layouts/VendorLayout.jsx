import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Package, Settings, LogOut, Wallet, Menu, X, LayoutDashboard, ClipboardList } from 'lucide-react';
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
      {/* Mobile Header */}
      <header className="glass-panel desktop-hidden" style={{ 
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
        borderBottom: '1px solid var(--border-color)',
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

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar / Drawer */}
        <>
          {isMenuOpen && (
            <div 
              onClick={() => setIsMenuOpen(false)}
              className="desktop-hidden"
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1400 }} 
            />
          )}

          <aside className={`glass-panel vendor-sidebar ${isMenuOpen ? 'open' : ''}`} style={{ 
            width: '280px',
            borderRadius: 0, 
            borderTop: 'none', 
            borderRight: 'none', 
            borderBottom: 'none', 
            borderLeft: '1px solid var(--border-color)',
            display: 'flex', 
            flexDirection: 'column',
            zIndex: 1500,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }} className="mobile-hidden">
              <Link to="/vendor" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem', fontWeight: '800' }}>
                <span className="gradient-text">لوحة</span>التاجر ⚡
              </Link>
            </div>

            <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {user ? (
                <>
                  <Link to="/vendor/dashboard" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                    <LayoutDashboard size={20} /> نظرة عامة (Dashboard)
                  </Link>
                  <Link to="/vendor/products" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                    <Package size={20} /> منتجاتي (My Products)
                  </Link>
                  <Link to="/vendor/orders" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'space-between', border: 'none', background: 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ClipboardList size={20} /> الطلبات (Orders)
                    </div>
                    {pendingCount > 0 && (
                      <span style={{ background: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/vendor/settings" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                    <Settings size={20} /> إعدادات المتجر (Store Settings)
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
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>حساب تاجر</p>
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
        <main style={{ flex: 1, padding: 'clamp(16px, 5vw, 40px)', background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
          <div className="desktop-hidden" style={{ height: '70px' }} />
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
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
        }
        @media (min-width: 768px) {
          .vendor-sidebar { transform: none !important; }
        }
      `}} />
    </div>
  );
};

export default VendorLayout;
