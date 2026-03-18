import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, LogIn, Home, Search, Menu, X, Package, ShieldCheck, Navigation, Store, Utensils, Coffee, ShoppingBasket } from 'lucide-react';

const CustomerLayout = ({ children, fullWidth = false }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
    navigate('/');
  };

  return (
    <div className="customer-app">
      {/* Navbar */}
      <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsDrawerOpen(true)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Menu size={28} />
            </button>
            <Link to={user ? "/customer" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span className="gradient-text">Food</span>Delivery
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/cart" className="card-hover" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              <ShoppingCart size={24} color="var(--accent-primary)" />
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Side Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        />
      )}

      {/* Side Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: isDrawerOpen ? 0 : '-300px', width: '280px', height: '100vh',
        background: 'var(--bg-secondary)', zIndex: 1000, transition: 'var(--transition)',
        boxShadow: isDrawerOpen ? '4px 0 24px rgba(0,0,0,0.2)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Menu</span>
          <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)', transition: 'var(--transition)', textDecoration: 'none', color: 'var(--text-primary)' }} className="card-hover">
            <Home size={20} /> Home Page
          </Link>

          <div style={{ margin: '12px 0 8px', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            تسوق حسب القسم
          </div>

          <Link to="/category/restaurant" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }} className="card-hover">
            <Utensils size={20} color="var(--accent-primary)" /> مطاعم
          </Link>
          <Link to="/category/cafe" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }} className="card-hover">
            <Coffee size={20} color="var(--info)" /> كافيهات
          </Link>
          <Link to="/category/supermarket" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }} className="card-hover">
            <ShoppingBasket size={20} color="var(--success)" /> سوبر ماركت
          </Link>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }}></div>
          
          {!user ? (
            <Link to="/login" onClick={() => setIsDrawerOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '16px' }}>
              <LogIn size={20} /> Login / Register
            </Link>
          ) : (
            <>
              {(!user.role || user.role.toLowerCase() === 'customer') && (
                <>
                  <Link to="/customer/profile" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)' }} className="card-hover">
                    <User size={20} /> My Profile
                  </Link>
                  <Link to="/customer/profile" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)' }} className="card-hover">
                    <Package size={20} /> My Orders
                  </Link>
                </>
              )}

              {user.role?.toLowerCase() === 'vendor' && (
                <Link to="/vendor" onClick={() => setIsDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--success)' }} className="card-hover">
                  <Store size={20} /> Vendor Dashboard
                </Link>
              )}
              {/* Note: Admin link explicitly omitted to keep it strictly hidden */}
            </>
          )}
        </div>

        {user && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className={fullWidth ? "" : "container"} style={{ 
        paddingTop: fullWidth ? 0 : '24px', 
        paddingBottom: fullWidth ? 0 : '40px',
        paddingLeft: fullWidth ? 0 : '16px',
        paddingRight: fullWidth ? 0 : '16px'
      }}>
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
