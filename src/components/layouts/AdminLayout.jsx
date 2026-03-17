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
    <div className="admin-app" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <Link to="/mustafa-admin-secret" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <ShieldCheck size={28} color="var(--warning)" /> <span className="gradient-text">Admin</span>Panel
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user ? (
            <>
              <Link to="/mustafa-admin-secret" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <Users size={20} /> Users & Entities
              </Link>
              <Link to="/mustafa-admin-secret/settlements" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <DollarSign size={20} /> Financial Settlements
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
                {user.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Platform Control</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)' }}>
              <LogOut size={18} /> Logout
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
