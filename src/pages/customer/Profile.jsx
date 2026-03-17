import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Star, Clock } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const userId = user.id || user._id;
        const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          // API returns an Array or { orders: [...] }
          const ordersArray = Array.isArray(data) ? data : data.orders || [];
          setOrders(ordersArray);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  if (!user) return <div className="animate-fade-up" style={{ textAlign: 'center', padding: '100px 0' }}>Please log in to view your profile.</div>;

  const renderStatusBadge = (status) => {
    let color, bg;
    switch(status) {
      case 'Pending': color = 'var(--text-secondary)'; bg = 'var(--bg-tertiary)'; break;
      case 'Preparing': color = 'var(--warning)'; bg = 'rgba(245, 158, 11, 0.1)'; break;
      case 'OnTheWay': color = 'var(--info)'; bg = 'rgba(59, 130, 246, 0.1)'; break;
      case 'Delivered': color = 'var(--success)'; bg = 'rgba(16, 185, 129, 0.1)'; break;
      default: color = 'var(--text-primary)'; bg = 'var(--bg-tertiary)';
    }
    return (
      <span style={{ color, background: bg, padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 'bold' }}>
        {status}
      </span>
    )
  }

  return (
    <div className="animate-fade-up">
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{user.email} • {user.phone}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Package size={24} color="var(--accent-primary)" /> My Orders
      </h3>

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{order.storeName || 'Store'}</h4>
                  <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {order.date || new Date().toLocaleString()}</span>
                    <span>• Order #{order.id || (order._id && order._id.slice(-6))}</span>
                  </div>
                </div>
                {renderStatusBadge(order.status)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Items: {order.items ? (Array.isArray(order.items) ? order.items.map(i => i.name || i).join(', ') : 'Various items') : 'Various items'}
                  </p>
                  
                  {order.driver_name && order.driver_phone && (
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>
                        {order.driver_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{order.driver_name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.driver_phone}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '16px' }}>EGP {order.total}</p>
                  {order.status === 'Delivered' && (
                    <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                      <Star size={16} /> Rate Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
