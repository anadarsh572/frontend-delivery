import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Package, Settings, LogOut, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '../../api/config';

const VendorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

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
    <div className="admin-app flex-responsive" style={{ minHeight: '100vh' }} dir="rtl">
      {/* Sidebar */}
      <aside className="glass-panel" style={{ 
        width: 'auto', 
        minWidth: '280px',
        borderRadius: 0, 
        borderTop: 'none', 
        borderRight: 'none', 
        borderBottom: 'none', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <Link to="/vendor" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem', fontWeight: '800' }}>
            <span className="gradient-text">لوحة</span>التاجر ⚡
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {user ? (
            <>
              <Link to="/vendor" className="btn btn-secondary" style={{ justifyContent: 'space-between', border: 'none', background: 'transparent', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Store size={20} /> إدارة الطلبات
                </div>
                {pendingCount > 0 && (
                  <span style={{ background: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {pendingCount}
                  </span>
                )}
              </Link>
              <Link to="/vendor/products" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '12px 16px' }}>
                <Package size={20} /> المنتجات
              </Link>
              <Link to="/vendor/wallet" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '12px 16px' }}>
                <Wallet size={20} /> محفظة الأرباح
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
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</p>
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
      <main style={{ flex: 1, padding: 'clamp(16px, 5vw, 40px)', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
};

export default VendorLayout;
