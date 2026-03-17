import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Package, Settings, LogOut, Wallet } from 'lucide-react';

const VendorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-app" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <Link to="/vendor" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span className="gradient-text">Vendor</span>Hub
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user ? (
            <>
              <Link to="/vendor" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <Store size={20} /> Order Management
              </Link>
              <Link to="/vendor/products" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <Package size={20} /> Products
              </Link>
              <Link to="/vendor/wallet" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                <Wallet size={20} /> Earnings Wallet
              </Link>
            </>
          ) : (
             <div style={{ padding: '20px', textAlign: 'center' }}>
               <Link to="/login" className="btn btn-primary">
                 Vendor Login
               </Link>
             </div>
          )}
        </nav>

        {user && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vendor Account</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px' }}>
        {children}
      </main>
    </div>
  );
};

export default VendorLayout;
