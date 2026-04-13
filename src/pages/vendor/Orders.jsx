import { useState, useEffect, useMemo } from 'react';
import { Search, Clock, CheckCircle, Package, XCircle, Search as SearchIcon, Coffee, MapPin } from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
  }

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await apiClient.put(`/api/vendor/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) => 
        prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('فشل في تحديث حالة الطلب');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  const parseItems = (items) => {
    try {
      return typeof items === 'string' ? JSON.parse(items) : (items || []);
    } catch (e) {
      return [];
    }
  };

  const columns = [
    { id: 'pending', title: 'جديد ومُعلّق', statuses: ['Pending'], color: '#F59E0B' },
    { id: 'preparing', title: 'جاري التجهيز', statuses: ['Preparing'], color: '#3B82F6' },
    { id: 'ready', title: 'جاهز للاستلام 🚶', statuses: ['Ready for Pickup'], color: '#8B5CF6' },
    { id: 'completed', title: 'مكتمل ✅', statuses: ['Completed'], color: '#10B981' },
    { id: 'cancelled', title: 'ملغي ❌', statuses: ['Cancelled'], color: '#EF4444' }
  ];

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter(o => 
      o.id?.toString().includes(searchQuery) ||
      o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone?.toString().includes(searchQuery)
    );
  }, [orders, searchQuery]);

  const ordersByColumn = useMemo(() => {
    const grouped = {};
    columns.forEach(col => {
      grouped[col.id] = filteredOrders.filter(order => col.statuses.includes(order.status));
    });
    return grouped;
  }, [filteredOrders]);

  return (
    <div className="admin-page animate-fade-in" dir="rtl" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>إدارة الطلبات (استلام من الفرع)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>تحديث حالات ومتابعة تجهيز الطلبات الخاصة بالعملاء.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <div style={{position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}>
             <SearchIcon size={18} />
          </div>
          <input 
            type="text" 
            placeholder="بحث برقم الطلب، اسم العميل، التليفون..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', 
              padding: '12px 40px 12px 16px', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-color)',
              background: 'white',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', color: 'var(--danger)', marginBottom: '24px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Kanban Board Container */}
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        overflowX: 'auto', 
        paddingBottom: '20px',
        flex: 1,
        alignItems: 'flex-start'
      }}>
        {columns.map(col => {
          const colOrders = ordersByColumn[col.id] || [];
          return (
            <div key={col.id} style={{ 
              minWidth: '300px', 
              width: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'transparent'
             }}>
               
               {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: col.color}}>
                   {col.id === 'pending' && <Clock size={18} />}
                   {col.id === 'preparing' && <Coffee size={18} />}
                   {col.id === 'ready' && <Package size={18} />}
                   {col.id === 'completed' && <CheckCircle size={18} />}
                   {col.id === 'cancelled' && <XCircle size={18} />}
                   <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{col.title}</h3>
                 </div>
                 <span style={{ 
                   background: '#F3F4F6', 
                   color: '#6B7280', 
                   padding: '2px 8px', 
                   borderRadius: 'var(--radius-full)', 
                   fontSize: '0.8rem', 
                   fontWeight: 'bold' 
                 }}>
                   {colOrders.length}
                 </span>
              </div>

              {/* Column Content */}
              {loading && colOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>جاري التحميل...</div>
              ) : colOrders.length === 0 ? (
                <div style={{ 
                   border: '2px dashed var(--border-color)', 
                   borderRadius: 'var(--radius-md)', 
                   height: '100px', 
                   display: 'flex', 
                   flexDirection: 'column',
                   alignItems: 'center', 
                   justifyContent: 'center',
                   color: 'var(--text-tertiary)',
                   background: 'rgba(255,255,255,0.3)'
                }}>
                  <span style={{ fontSize: '0.85rem' }}>فارغ</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {colOrders.map(order => {
                     const parsedItems = parseItems(order.items);
                     return (
                      <div key={order.id} style={{ 
                        background: 'white', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '16px', 
                        border: '1px solid var(--border-color)',
                        borderTop: `4px solid ${col.color}`,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        transition: 'var(--transition)',
                        opacity: updatingId === order.id ? 0.6 : 1
                      }} className="kanban-card">
                        
                        {/* Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#F3F4F6', borderRadius: '4px', fontWeight: 'bold' }}>
                            <MapPin size={12} style={{display: 'inline', marginLeft: '4px'}}/> استلام من الفرع
                          </span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-primary)' }}>#{order.id}</span>
                        </div>
                        
                        {/* Customer Details */}
                        <div style={{ marginBottom: '16px', background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px' }}>
                          <p style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{order.customer_name || 'عميل محلي'}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.customer_phone || 'بدون رقم'}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '6px' }}>
                          <Clock size={12} /> {formatDate(order.created_at)}
                          </div>
                        </div>

                        {/* Order Items Summary */}
                        <div style={{ marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                           <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>التفاصيل ({parsedItems.length} أصناف):</p>
                           <ul style={{ paddingRight: '16px', margin: 0 }}>
                              {parsedItems.map((item, idx) => (
                                <li key={idx}>
                                  {item.quantity}x {item.name || item.product_name}
                                  {item.size ? ` (${item.size})` : ''} 
                                </li>
                              ))}
                           </ul>
                        </div>
                        
                        <hr style={{border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0'}} />

                        {/* Order Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>الإجمالي:</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{order.total_price} ج.م</span>
                        </div>

                        {/* Status Update Dropdown */}
                        <div style={{ width: '100%' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>تحديث الحالة:</label>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-secondary)',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Pending">جديد ومُعلّق</option>
                            <option value="Preparing">جاري التجهيز</option>
                            <option value="Ready for Pickup">جاهز للاستلام</option>
                            <option value="Completed">مكتمل، تم الاستلام</option>
                            <option value="Cancelled">إلغاء الطلب</option>
                          </select>
                        </div>
                      </div>
                     );
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .kanban-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.05) !important;
        }
      `}} />
    </div>
  );
};

export default Orders;
