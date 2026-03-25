import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, ShieldCheck, DollarSign, LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-app" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }} dir="rtl">
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', borderRadius: 0, borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', zIndex: 10 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <Link to="/mustafa-admin-secret" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <ShieldCheck size={28} color="var(--warning)" /> <span className="gradient-text">Admin</span>Panel
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user ? (
            <>
              <div style={{ margin: '12px 0 8px', padding: '0 12px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 'bold' }}>لوحة التحكم الأساسية</div>
              <Link to="/mustafa-admin-secret" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <Users size={20} /> المستخدمين والكيانات
              </Link>
              <Link to="/mustafa-admin-secret/settlements" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <DollarSign size={20} /> التسويات المالية
              </Link>

              <div style={{ margin: '24px 0 8px', padding: '0 12px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 'bold' }}>تبديل الأدوار (سريع)</div>
              <Link to="/" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--info)' }}>
                <ShieldCheck size={20} /> التسوق كعميل
              </Link>
              <Link to="/vendor" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--success)' }}>
                <ShieldCheck size={20} /> لوحة تحكم التاجر
              </Link>
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ background: 'var(--warning)' }}>
                Admin Login
              </Link>
            </div>
          )}
        </nav>

        {user && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--warning)' }}>
                {user.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name || 'مدير النظام'}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>إدارة المنصة</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)' }}>
              <LogOut size={18} /> تسجيل الخروج
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', background: 'var(--bg-primary)' }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
