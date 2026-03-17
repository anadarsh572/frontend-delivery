import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Clock, Package, X, PlusCircle, Store, AlertTriangle, CheckCircle, Copy, MapPin, Phone } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    isAvailable: true
  });

  // Subscription State
  const [subscriptionStatus, setSubscriptionStatus] = useState(user?.subscriptionStatus || 'unpaid');
  const [isPaying, setIsPaying] = useState(false);

  // Store Settings
  const [storeCategory, setStoreCategory] = useState(user?.category || 'restaurant');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  useEffect(() => {
    const fetchStoreOrders = async () => {
      if (!user) return;
      try {
        const storeId = user.storeId || user.id || user._id;
        const response = await fetch(`http://localhost:5000/api/orders/store/${storeId}`);
        if (response.ok) {
          const data = await response.json();
          const ordersArray = Array.isArray(data) ? data : data.orders || [];
          setOrders(ordersArray);
        } else {
          console.error('Failed to fetch store orders');
        }
      } catch (error) {
        console.error('Error fetching store orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreOrders();
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in as Vendor to see your dashboard</div>;

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const productData = { ...newProduct, price: Number(newProduct.price) };
      
      const response = await fetch('http://localhost:5000/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        alert('Product added successfully!');
        setNewProduct({ name: '', description: '', price: '', image: '', isAvailable: true });
        setIsAddingProduct(false);
      } else {
        const error = await response.json();
        alert(`Failed to add product: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Network error occurred while adding product.');
    }
  };

  const handlePaySubscription = async () => {
    setIsPaying(true);
    try {
      const response = await fetch('http://localhost:5000/api/vendor/pay-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setSubscriptionStatus('active');
        alert('تم تفعيل مطعمك بنجاح! 🎉');
      } else {
        const error = await response.json();
        alert(`Payment failed: ${error.error || error.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Subscription payment error:', err);
      alert('Network error occurred during payment.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleUpdateStoreCategory = async () => {
    setIsSavingCategory(true);
    try {
      const response = await fetch('http://localhost:5000/api/vendor/update-category', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ category: storeCategory })
      });
      if (response.ok) {
        alert('تم تحديث نوع المتجر بنجاح!');
      } else {
        alert('فشل تحديث نوع المتجر');
      }
    } catch (err) {
      console.error('Update category error:', err);
      alert('خطأ في الاتصال بالسيرفر');
    } finally {
      setIsSavingCategory(false);
    }
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
          <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id || order.id, 'Out for Delivery')} style={{ background: 'var(--accent-primary)', border: 'none', padding: '8px 16px', fontSize: '0.9rem' }}>
            <Navigation size={16} /> خرج للتوصيل (Out for Delivery)
          </button>
        );
      case 'Out for Delivery':
        return (
          <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id || order.id, 'Delivered')} style={{ background: 'var(--success)', border: 'none', padding: '8px 16px', fontSize: '0.9rem' }}>
            <Check size={16} /> تم التسليم (Mark Delivered)
          </button>
        );
      case 'Delivered':
        return <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>تم التوصيل بنجاح ✅</span>;
      default:
        return <span style={{ color: 'var(--text-secondary)' }}>{order.status}</span>;
    }
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Store Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage products and incoming orders for your store.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (subscriptionStatus !== 'active') {
              alert('عذراً، يجب دفع الاشتراك الشهري أولاً لتتمكن من إضافة المنتجات.');
              return;
            }
            setIsAddingProduct(!isAddingProduct);
          }}
          style={{ opacity: subscriptionStatus !== 'active' ? 0.6 : 1, cursor: subscriptionStatus !== 'active' ? 'not-allowed' : 'pointer' }}
        >
          {isAddingProduct ? <X size={20} /> : <PlusCircle size={20} />}
          {isAddingProduct ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {/* Store Setup Section */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid var(--accent-primary)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={20} /> إعدادات المتجر (Store Setup)
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>نوع المتجر (Store Category)</label>
            <select 
              className="form-control"
              value={storeCategory}
              onChange={(e) => setStoreCategory(e.target.value)}
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              <option value="restaurant">مطعم (Restaurant)</option>
              <option value="cafe">كافيه (Cafe)</option>
              <option value="supermarket">سوبر ماركت (Supermarket)</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleUpdateStoreCategory}
            disabled={isSavingCategory}
            style={{ padding: '12px 32px' }}
          >
            {isSavingCategory ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>

      {/* Subscription Banner */}
      <div style={{
        marginBottom: '32px',
        padding: '20px 24px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: subscriptionStatus === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${subscriptionStatus === 'active' ? 'var(--success)' : 'var(--danger)'}`,
        color: subscriptionStatus === 'active' ? 'var(--success)' : 'var(--danger)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {subscriptionStatus === 'active' ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>حالة الحساب (Account Status)</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
              {subscriptionStatus === 'active' 
                ? 'حسابك مفعل وجاهز لاستقبال الطلبات' 
                : 'حسابك غير مفعل، منتجاتك مخفية من المنصة. يرجى دفع الاشتراك الشهري'}
            </p>
          </div>
        </div>
        {subscriptionStatus !== 'active' && (
          <button 
            className="btn btn-primary" 
            style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '12px 24px', fontWeight: 'bold' }}
            onClick={handlePaySubscription}
            disabled={isPaying}
          >
            {isPaying ? 'جاري الدفع...' : 'دفع الاشتراك الشهري (500 ج.م)'}
          </button>
        )}
      </div>

      {isAddingProduct && (
        <div className="glass-panel animate-fade-up" style={{ marginBottom: '40px', padding: '32px' }}>
          <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Store size={24} color="var(--accent-primary)" />
            Add New Product
          </h2>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Cheese Burger"
                />
              </div>
              <div className="form-group">
                <label>Price (EGP)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="e.g. 150"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="form-control" 
                required 
                rows="3"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Briefly describe the product..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input 
                type="url" 
                className="form-control" 
                required 
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={newProduct.isAvailable}
                onChange={(e) => setNewProduct({...newProduct, isAvailable: e.target.checked})}
                style={{ width: '20px', height: '20px' }}
              />
              Product is currently available
            </label>

            <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start', padding: '12px 32px' }}>
              Save Product
            </button>
          </form>
        </div>
      )}

      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Live Orders</h2>

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading orders...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {orders.map(order => (
            <div key={order.id || order._id} className="glass-panel" style={{ padding: '24px', borderLeft: `4px solid ${order.status === 'Pending' ? 'var(--warning)' : (order.status === 'Preparing' || order.status === 'Accepted') ? 'var(--info)' : 'var(--success)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>#{order.id || (order._id && order._id.slice(-6))}</h3>
                  <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {order.date || new Date().toLocaleString()}</span>
                    <span style={{ color: order.type === 'Online' || order.payment_method === 'Online' ? 'var(--success)' : 'var(--warning)' }}>{order.type || order.payment_method || 'Cash'} Payment</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>EGP {order.total}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{order.status}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px', background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Customer Name</p>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{order.customer_name || order.customerName || 'Customer'}</p>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Delivery Address</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <MapPin size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {order.address || order.deliveryAddress || 'No address provided'}
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Phone Number</p>
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
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Order Items:</p>
                <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                  {order.items ? (Array.isArray(order.items) ? order.items.map(i => i.name || i).join(', ') : 'Various items') : 'Various items'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {getActionButtons(order)}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>No active orders at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
