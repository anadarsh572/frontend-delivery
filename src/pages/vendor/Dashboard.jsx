import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Clock, Package, X, PlusCircle, Store, AlertTriangle, CheckCircle, Copy, MapPin, Phone, RefreshCw } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';
import { API_URL } from '../../api/config';
import AddProductModal from '../../components/modals/AddProductModal';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    const fetchStoreOrders = async () => {
      if (!user) return;
      try {
        const storeId = user.storeId || user.id || user._id;
        const response = await fetch(`${API_URL}/api/orders/store/${storeId}`);
        if (response.ok) {
          const data = await response.json();
          const ordersArray = Array.isArray(data) ? data : data.orders || [];
          setOrders(ordersArray);
        }
      } catch (error) {
        console.error('Error fetching store orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreOrders();
    const interval = setInterval(fetchStoreOrders, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in as Vendor to see your dashboard</div>;

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === id || o._id === id ? { ...o, status: newStatus } : o));
      } else {
        console.error('Failed to update order status');
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating status.');
    }
  };

  const onAddProductSuccess = () => {
    // Optionally refresh orders or show a notification
    console.log('Product added successfully from Dashboard');
  };



  const getActionButtons = (order) => {
    switch (order.status) {
      case 'Pending':
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id || order.id, 'Preparing')} style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'var(--info)', border: 'none' }}>
              <Package size={16} /> ابدأ التحضير (Start Preparing)
            </button>
            <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '8px 16px', fontSize: '0.9rem' }}>
              <X size={16} /> Reject
            </button>
          </div>
        );
      case 'Preparing':
        return (
          <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id || order.id, 'Delivered')} style={{ background: 'var(--success)', border: 'none', padding: '8px 16px', fontSize: '0.9rem' }}>
            <Check size={16} /> إكمال الطلب (Mark Completed)
          </button>
        );
      case 'Delivered':
        return <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>تم الطلب بنجاح ✅</span>;
      default:
        return <span style={{ color: 'var(--text-secondary)' }}>{order.status}</span>;
    }
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '8px' }}>لوحة تحكم المتجر</h1>
          <p style={{ color: 'var(--text-secondary)' }}>إدارة المنتجات والطلبات الواردة لمتجرك بكل سهولة.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ width: 'auto' }}
        >
          <PlusCircle size={20} /> إضافة منتج جديد
        </button>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        storeId={user?.storeId || user?.id}
        onSuccess={onAddProductSuccess}
      />





      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>الطلبات الحالية</h2>

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>جاري تحميل الطلبات...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '24px' }}>
          {orders.map(order => (
            <div key={order.id || order._id} className="glass-panel" style={{ padding: '24px', borderLeft: `4px solid ${order.status === 'Pending' ? 'var(--warning)' : (order.status === 'Preparing' || order.status === 'Accepted') ? 'var(--info)' : 'var(--success)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>#{order.id || (order._id && order._id.slice(-6))}</h3>
                  <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {order.date || new Date().toLocaleString()}</span>
                    <span style={{ color: order.type === 'Online' || order.payment_method === 'Online' ? 'var(--success)' : 'var(--warning)' }}>دفع {order.type === 'Online' || order.payment_method === 'Online' ? 'أونلاين' : 'كاش'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                   <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{order.total || order.total_price} جنيه</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{order.status === 'Pending' ? 'جديد' : (order.status === 'Preparing' ? 'جاري التجهيز' : 'مكتمل')}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px', background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>اسم العميل</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{order.customer_name || order.customerName || 'عميل'}</p>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>عنوان التوصيل</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <MapPin size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {order.address || order.deliveryAddress || 'لا يوجد عنوان'}
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>رقم الهاتف</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={18} color="var(--success)" />
                      <p style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '1px' }}>
                        {order.customer_phone || order.customerPhone || 'N/A'}
                      </p>
                    </div>
                    { (order.customer_phone || order.customerPhone) && (
                      <button 
                        onClick={() => {
                          const num = order.customer_phone || order.customerPhone;
                          navigator.clipboard.writeText(num);
                          alert('تم نسخ الرقم: ' + num);
                        }}
                        style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                      >
                        <Copy size={14} /> نسخ
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px', padding: '0 12px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>أصناف الطلب:</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                  {order.items ? (Array.isArray(order.items) ? order.items.map(i => i.name || i).join('، ') : 'أصناف متنوعة') : 'أصناف متنوعة'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {getActionButtons(order)}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>لا توجد طلبات نشطة حالياً.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
