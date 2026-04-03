import { useState, useEffect, useMemo } from 'react';
import { Search, Clock, CheckCircle, Truck, Package, XCircle, Search as SearchIcon, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  const columns = [
    { id: 'pending', title: 'جديد / معلق', statuses: ['Pending'], color: '#F59E0B' },
    { id: 'verified', title: 'تم التحقق', statuses: ['accepted', 'Preparing', 'Ready'], color: '#3B82F6' },
    { id: 'shipped', title: 'تم الشحن', statuses: ['OnTheWay'], color: '#8B5CF6' },
    { id: 'delivered', title: 'تم التوصيل', statuses: ['Delivered', 'Completed'], color: '#10B981' },
    { id: 'returned', title: 'مرتجع', statuses: ['rejected', 'Cancelled'], color: '#EF4444' }
  ];

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter(o => 
      o.id?.toString().includes(searchQuery) ||
      o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800' }}>عرض لوحة كانبان</h1>
        
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <div style={{position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}>
             <SearchIcon size={18} />
          </div>
          <input 
            type="text" 
            placeholder="بحث..." 
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
              minWidth: '280px', 
              width: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'transparent'
             }}>
               
               {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: col.color}}>
                   {col.id === 'pending' && <Clock size={18} />}
                   {col.id === 'verified' && <CheckCircle size={18} />}
                   {col.id === 'shipped' && <Truck size={18} />}
                   {col.id === 'delivered' && <CheckCircle size={18} />}
                   {col.id === 'returned' && <XCircle size={18} />}
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
                   border: '1px dashed var(--border-color)', 
                   borderRadius: 'var(--radius-md)', 
                   height: '150px', 
                   display: 'flex', 
                   flexDirection: 'column',
                   alignItems: 'center', 
                   justifyContent: 'center',
                   color: 'var(--text-tertiary)',
                   background: 'rgba(255,255,255,0.5)'
                }}>
                  <Package size={24} style={{ opacity: 0.5, marginBottom: '8px' }}/>
                  <span style={{ fontSize: '0.85rem' }}>فارغ</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {colOrders.map(order => (
                    <div key={order.id} style={{ 
                      background: 'white', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '16px', 
                      border: '1px solid var(--border-color)',
                      borderTop: `3px solid ${col.color}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      cursor: 'grab',
                      transition: 'transform 0.2s',
                    }} className="kanban-card">
                      
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#F3F4F6', borderRadius: '4px', fontWeight: 'bold' }}>معالجة</span>
                         <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>#{order.id}</span>
                      </div>
                      
                      {/* Customer Details */}
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>{order.customer_name || order.name || 'عميل'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>{order.customer_email || 'example@email.com'}</p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '16px' }}>
                        <Clock size={12} /> {formatDate(order.created_at)}
                      </div>

                      <hr style={{border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0'}} />

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{order.total_price} ج.م</span>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: '#F3F4F6', padding: '4px 8px', borderRadius: '4px' }}>Cash</span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .kanban-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease forwards;
        }
      `}} />
    </div>
  );
};

export default Orders;
