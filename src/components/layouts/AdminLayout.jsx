import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, ShieldCheck, DollarSign, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-app" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }} dir="rtl">
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
        <Link to="/mustafa-admin-secret" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '800' }}>
          <ShieldCheck size={24} color="var(--warning)" /> <span className="gradient-text">Admin</span> Panel
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: '8px', borderRadius: 'var(--radius-md)' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <>
          {isMenuOpen && (
            <div 
              onClick={() => setIsMenuOpen(false)}
              className="desktop-hidden"
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1400 }} 
            />
          )}

          <aside className={`glass-panel admin-sidebar ${isMenuOpen ? 'open' : ''}`} style={{ 
            width: '280px', 
            borderRadius: 0, 
            borderTop: 'none', 
            borderRight: 'none', 
            borderBottom: 'none', 
            borderLeft: '1px solid var(--border-color)', 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'var(--bg-secondary)', 
            zIndex: 1500,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }} className="mobile-hidden">
              <Link to="/mustafa-admin-secret" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <ShieldCheck size={28} color="var(--warning)" /> <span className="gradient-text">Admin</span>Panel
              </Link>
            </div>

            <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {user ? (
                <>
                  <div style={{ margin: '12px 0 8px', padding: '0 12px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 'bold' }}>لوحة التحكم الأساسية</div>
                  <Link to="/mustafa-admin-secret" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                    <Users size={20} /> المستخدمين والكيانات
                  </Link>
                  <Link to="/mustafa-admin-secret/settlements" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                    <DollarSign size={20} /> التسويات المالية
                  </Link>

                  <div style={{ margin: '24px 0 8px', padding: '0 12px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 'bold' }}>تبديل الأدوار (سريع)</div>
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--info)' }}>
                    <ShieldCheck size={20} /> التسوق كعميل
                  </Link>
                  <Link to="/vendor" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--success)' }}>
                    <ShieldCheck size={20} /> لوحة تحكم التاجر
                  </Link>
                </>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Link to="/login" className="btn btn-primary" style={{ background: 'var(--warning)' }}>Admin Login</Link>
                </div>
              )}
            </nav>

            {user && (
              <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--warning)' }}>
                    {user.name?.charAt(0) || 'A'}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name || 'مدير النظام'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>إدارة المنصة</p>
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
          .admin-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            transform: translateX(100%);
            background: var(--bg-secondary) !important;
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
        @media (min-width: 768px) {
          .admin-sidebar { transform: none !important; }
        }
      `}} />
    </div>
  );
};

export default AdminLayout;
