import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Clock, Package, X, PlusCircle, Store, AlertTriangle, CheckCircle, Copy, MapPin, Phone, RefreshCw } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';
import apiClient from '../../api/client';
import AddProductModal from '../../components/modals/AddProductModal';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total_orders: 0, total_revenue: 0, pending_orders: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/vendor/stats');
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchStoreOrders = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/api/vendor/orders');
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching store orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchStoreOrders();
    const interval = setInterval(() => {
        fetchStats();
        fetchStoreOrders();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in as Vendor to see your dashboard</div>;

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await apiClient.patch(`/api/orders/${id}/status`, { status: newStatus });
      if (response.status === 200 || response.status === 201) {
        setOrders(prev => prev.map(o => o.id === id || o._id === id ? { ...o, status: newStatus } : o));
        fetchStats(); // Update stats after action
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('فشل في تحديث حالة الطلب.');
    }
  };

  const onAddProductSuccess = () => {
    // Optionally refresh orders or show a notification
    console.log('Product added successfully from Dashboard');
  };

  const getActionButtons = (order) => {
    const status = order.status?.toLowerCase();
    switch (status) {
      case 'pending':
        return (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id || order.id, 'Preparing')} style={{ padding: '8px 16px', fontSize: '1rem', background: 'var(--success)', border: 'none', flex: 1, justifyContent: 'center' }}>
              <Check size={18} /> قبول الطلب
            </button>
            <button className="btn" onClick={() => updateOrderStatus(order._id || order.id, 'Rejected')} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '8px 16px', fontSize: '1rem', flex: 1, justifyContent: 'center', border: '1px solid var(--danger)' }}>
              <X size={18} /> الرفض
            </button>
          </div>
        );
      case 'preparing':
      case 'accepted':
        return (
          <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id || order.id, 'Delivered')} style={{ background: 'var(--info)', border: 'none', padding: '10px 20px', fontSize: '1rem', width: '100%' }}>
            <Package size={18} /> تم التسليم للعميل
          </button>
        );
      case 'delivered':
        return <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>تم الطلب بنجاح ✅</div>;
      default:
        return <span style={{ color: 'var(--text-secondary)' }}>{order.status}</span>;
    }
  };

  const pendingOrdersCount = orders.filter(o => o.status?.toLowerCase() === 'pending').length;

  return (
    <div className="animate-fade-up" dir="rtl">
      {/* STATS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Package size={100} /></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '8px' }}>إجمالي الطلبات</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-primary)' }}>{stats.total_orders}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', borderRight: '4px solid var(--warning)' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Clock size={100} color="var(--warning)" /></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '8px' }}>طلبات قيد الانتظار</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--warning)' }}>{stats.pending_orders}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', borderRight: '4px solid var(--success)' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Store size={100} color="var(--success)" /></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '8px' }}>إجمالي الإيرادات</p>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--success)' }}>{Number(stats.total_revenue).toLocaleString()} <span style={{ fontSize: '1rem' }}>ج.م</span></h3>
        </div>
      </div>

      {pendingOrdersCount > 0 && (
        <div style={{ animation: 'pulse 2s infinite', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--warning)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--warning)', fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>لديك {pendingOrdersCount} طلب جديد!</h3>
            <p style={{ margin: 0, color: 'var(--text-primary)' }}>يرجى قبول أو رفض الطلبات الواردة لتبدأ في تجهيزها.</p>
          </div>
        </div>
      )}

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
          {orders.filter(o => o.status !== 'Rejected').map(order => (
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

              <div style={{ marginBottom: '24px', background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                {order.status === 'Pending' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', background: 'rgba(26, 31, 54, 0.7)', backdropFilter: 'blur(4px)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
                    <AlertTriangle size={32} color="var(--warning)" style={{ marginBottom: '8px' }} />
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white', textAlign: 'center' }}>تفاصيل العميل والطلب ستظهر<br/>بعد قبولك للطلب</p>
                  </div>
                ) : null}

                <div style={{ filter: order.status === 'Pending' ? 'blur(8px)' : 'none', opacity: order.status === 'Pending' ? 0.3 : 1, transition: 'all 0.3s ease' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>اسم العميل</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{order.customer_name || 'عميل'}</p>
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

                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>رقم الهاتف</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={18} color="var(--success)" />
                        <p style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '1px', direction: 'ltr' }}>
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

                  <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center' }}>--- تفاصيل الفاتورة ---</p>
                    
                    {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                      <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', paddingBottom: '12px', borderBottom: '1px dashed var(--border-color)', marginBottom: '12px', fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                          <span>الصنف</span>
                          <span style={{ textAlign: 'center' }}>الكمية</span>
                          <span style={{ textAlign: 'left' }}>السعر</span>
                        </div>
                        {order.items.map((item, idx) => {
                          const name = item.name || item;
                          const qty = item.quantity || 1;
                          const price = item.price || 0;
                          return (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '1.05rem', fontWeight: '500' }}>
                              <span style={{ wordBreak: 'break-word', lineHeight: '1.4' }}>{name}</span>
                              <span style={{ textAlign: 'center', fontWeight: 'bold' }}>{qty}x</span>
                              <span style={{ textAlign: 'left' }}>{price > 0 ? `${price} ج.م` : '-'}</span>
                            </div>
                          );
                        })}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', fontWeight: '900', fontSize: '1.3rem' }}>
                          <span>الإجمالي النهائي:</span>
                          <span style={{ color: 'var(--accent-primary)' }}>{order.total || order.total_price} ج.م</span>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '1.1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>لا توجد تفاصيل دقيقة للأصناف</p>
                    )}
                  </div>
                </div>
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
