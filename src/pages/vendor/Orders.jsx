import { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, Package, Truck, XCircle, ChevronDown, User, MapPin, Phone } from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/vendor/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('فشل في جلب الطلبات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // تحديث تلقائي كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await apiClient.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      
      // تحديث الحالة محلياً بدلاً من إعادة الجلب بالكامل
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('فشل تحديث حالة الطلب');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusMap = {
    'Pending': { label: 'قيد الانتظار', color: '#f59e0b', icon: <Clock size={16} /> },
    'accepted': { label: 'تم القبول', color: '#3b82f6', icon: <CheckCircle size={16} /> },
    'Preparing': { label: 'جاري التجهيز', color: '#8b5cf6', icon: <Package size={16} /> },
    'Ready': { label: 'جاهز للاستلام', color: '#10b981', icon: <CheckCircle size={16} /> },
    'OnTheWay': { label: 'في الطريق', color: '#06b6d4', icon: <Truck size={16} /> },
    'Delivered': { label: 'تم التوصيل', color: '#10b981', icon: <CheckCircle size={16} /> },
    'Completed': { label: 'مكتمل', color: '#10b981', icon: <CheckCircle size={16} /> },
    'rejected': { label: 'مرفوض', color: '#ef4444', icon: <XCircle size={16} /> },
    'Cancelled': { label: 'ملغي', color: '#ef4444', icon: <XCircle size={16} /> }
  };

  const getStatusInfo = (status) => statusMap[status] || { label: status, color: '#6b7280', icon: <Clock size={16} /> };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (loading && orders.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل طلباتك الجديدة...</p>
      </div>
    );
  }

  return (
    <div className="orders-container animate-fade-in" dir="rtl">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--info)' }}>
          <ClipboardList size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>إدارة الطلبات (Orders)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>تابع طلبات عملائك من هنا وحدث حالتها أول بأول.</p>
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', color: 'var(--danger)', marginBottom: '24px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ opacity: 0.3, marginBottom: '16px' }}><ClipboardList size={64} /></div>
          <h3>مفيش طلبات حالياً</h3>
          <p style={{ color: 'var(--text-secondary)' }}>لما حد يطلب من مطعمك، الأوردر هيظهر هنا فورا.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

            return (
              <div key={order.id} className="glass-panel order-card" style={{ padding: '24px', borderRight: `4px solid ${statusInfo.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>طلب رقم #{order.id}</span>
                      <div style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold', 
                        background: `${statusInfo.color}15`, 
                        color: statusInfo.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {statusInfo.icon} {statusInfo.label}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDate(order.created_at)}</span>
                  </div>
                  
                  <div style={{ textAlign: 'left', minWidth: '100px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>إجمالي المبلغ:</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--info)' }}>{order.total_price} ج.م</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  {/* Customer Info */}
                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.7 }}>بيانات العميل</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <User size={16} /> {order.customer_name || 'عميل مجهول'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <MapPin size={16} /> {order.customer_address || order.address || 'العنوان غير محدد'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <Phone size={16} /> {order.customer_phone || order.phone || 'بدون رقم هاتف'}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.7 }}>محتويات الطلب ({items?.length || 0})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {items && Array.isArray(items) && items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span>{item.name} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>× {item.quantity}</span></span>
                          <span style={{ fontWeight: 'bold' }}>{item.price * item.quantity} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  flexWrap: 'wrap', 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '20px' 
                }}>
                  {order.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(order.id, 'accepted')} 
                        className="btn btn-primary" 
                        disabled={updatingId === order.id}
                        style={{ background: 'var(--info)' }}
                      >
                        {updatingId === order.id ? 'جاري...' : 'قبول الطلب'}
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'rejected')} 
                        className="btn" 
                        disabled={updatingId === order.id}
                        style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}
                      >
                        رفض الطلب
                      </button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Preparing')} 
                      className="btn" 
                      disabled={updatingId === order.id}
                      style={{ background: '#8b5cf6', color: 'white' }}
                    >
                      بدء التجهيز
                    </button>
                  )}

                  {order.status === 'Preparing' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Ready')} 
                      className="btn" 
                      disabled={updatingId === order.id}
                      style={{ background: '#10b981', color: 'white' }}
                    >
                      جاهز للاستلام
                    </button>
                  )}

                  {order.status === 'Ready' && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>في انتظار مندوب التوصيل...</span>
                  )}

                  {order.status === 'OnTheWay' && (
                    <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>الطلب حالياً في الطريق للعميل 🚀</span>
                  )}
                  
                  {['Delivered', 'Completed'].includes(order.status) && (
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>تم إنهاء هذا الطلب بنجاح ✅</span>
                  )}

                  {['rejected', 'Cancelled'].includes(order.status) && (
                    <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>هذا الطلب ملغي ❌</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .order-card {
           transition: all 0.3s ease;
        }
        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.1);
          border-left-color: var(--info);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease forwards;
        }
      `}} />
    </div>
  );
};

export default Orders;
