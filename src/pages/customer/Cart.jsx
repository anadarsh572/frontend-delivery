import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus, Minus, Banknote, ArrowRight, X, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

import apiClient from '../../api/client';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Checkout Modal State
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [customerName, setCustomerName] = useState(user?.name || '');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const deliveryFee = 15; // Aligned with backend default
  const grandTotal = cartTotal + deliveryFee;

  const triggerCheckout = () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      // Open inline auth modal instead of redirecting
      setShowAuthModal(true);
      return;
    }
    // Already authenticated, so show the delivery details (Checkout) modal immediately
    setShowModal(true);
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const endpoint = authMode === 'login' ? `${API_URL}/api/login` : `${API_URL}/api/register`;

    try {
      const response = await apiClient.post(authMode === 'login' ? '/api/login' : '/api/register', authFormData);

      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        if (data.token) localStorage.setItem('token', data.token);
        
        const userObj = data.user || data; 
        const role = userObj.role?.toLowerCase() || data.role?.toLowerCase() || 'user';
        if (!userObj.role && data.role) userObj.role = data.role;
        
        login(userObj);

        // Pre-fill if we just registered/logged in and they have data (unlikely on fresh register but fits login)
        setPhone(userObj.phone || '');
        setAddress(userObj.address || '');

        setShowAuthModal(false);
        // Instantly transition to delivery details modal
        setShowModal(true);
      } else {
        setAuthError(data.error || data.message || (authMode === 'login' ? 'Invalid email or password.' : 'Failed to register.'));
      }
    } catch (err) {
      console.error('Auth error:', err);
      setAuthError('Network error. Please make sure the backend server is running.');
    } finally {
      setAuthLoading(false);
    }
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!user || !token) return;
    
    if (!phone.trim() || !address.trim() || !customerName.trim()) {
      alert("يرجى إدخال الاسم، رقم التليفون، وعنوان التوصيل.");
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      // Assuming all items in cart are from the same store for food delivery
      const storeId = cartItems.length > 0 ? cartItems[0].storeId : null;
      
      const payload = {
        store_id: storeId, 
        items: cartItems.map(item => ({
          id: item.productId || item.product?.id || item.product?._id,
          name: item.product?.name,
          quantity: parseInt(item.quantity, 10),
          price: Number(item.product?.price)
        })),
        items_price: cartTotal,
        delivery_fee: deliveryFee,
        total_price: grandTotal,
        customer_name: customerName,
        customer_phone: phone,
        customer_address: address,
        payment_method: 'cash'
      };

      console.log("Submitting Order Payload:", payload);
      const response = await apiClient.post('/api/orders', payload);

      if (response.status === 200 || response.status === 201) {
        // Clear cart and show success dialog
        clearCart();
        setShowModal(false);
        setOrderSuccess(true);
      } else {
        alert(`Failed to place order: ${response.data.message || 'Backend Error'}`);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      const serverMsg = error.response?.data?.error || "Network error. Please make sure the backend server is running.";
      const serverDetails = error.response?.data?.details || "";
      alert(`حصلت مشكلة: ${serverMsg} \n ${serverDetails}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="glass-panel animate-fade-up" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle size={40} color="white" />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '800' }}>تم تأكيد طلبك بنجاح!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.2rem', fontWeight: '500' }}>
          تم إرسال طلبك بنجاح وفي انتظار قبول المطعم ⚡🏁
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/customer')}>
            العودة للرئيسية
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/customer/profile')}>
            طلباتي (My Orders)
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="glass-panel animate-fade-up" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>سلتك فارغة</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>يبدو أنك لم تضف أي أكلات مميزة بعد.</p>
        <button className="btn btn-primary" onClick={() => navigate('/customer')}>
          تصفح المطاعم
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
      gap: '32px',
      alignItems: 'start'
    }}>
      
      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }} dir="rtl">
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--info)' }}>
                {authMode === 'login' ? <LogIn size={28} /> : <UserPlus size={28} />}
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{authMode === 'login' ? 'أهلاً بك مجدداً' : 'إنشاء حساب جديد'}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{authMode === 'login' ? 'سجل دخولك لإتمام الطلب.' : 'أنشئ حساباً لإتمام الطلب.'}</p>
            </div>

            {authError && (
              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.9rem' }}>
                <AlertCircle size={20} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authMode === 'register' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>الاسم بالكامل</label>
                  <input type="text" name="name" value={authFormData.name} onChange={handleAuthChange} placeholder="مثلاً: محمد علي" required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>البريد الإلكتروني</label>
                <input type="email" name="email" value={authFormData.email} onChange={handleAuthChange} placeholder="example@mail.com" required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>كلمة المرور</label>
                <input type="password" name="password" value={authFormData.password} onChange={handleAuthChange} placeholder="••••••••" required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px', justifyContent: 'center' }} disabled={authLoading}>
                {authLoading ? 'جاري التنفيذ...' : (authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {authMode === 'login' ? (
                <>ليس لديك حساب؟ <button type="button" onClick={() => { setAuthMode('register'); setAuthError(null); }} style={{ background: 'none', border: 'none', color: 'var(--info)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>سجل الآن</button></>
              ) : (
                <>لديك حساب بالفعل؟ <button type="button" onClick={() => { setAuthMode('login'); setAuthError(null); }} style={{ background: 'none', border: 'none', color: 'var(--info)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>تسجيل الدخول</button></>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal Overlay */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <form className="glass-panel animate-fade-up" onSubmit={submitOrder} style={{ width: '100%', maxWidth: '500px', padding: '32px', margin: '20px', position: 'relative' }} dir="rtl">
            <button type="button" onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--accent-primary)', textAlign: 'center' }}>تأكيد الطلب</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>الإجمالي: <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{grandTotal} جنيه</span></p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-full)', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <Banknote size={16} />
                <span>كاش عند الاستلام</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', marginRight: '8px' }}>اسم العميل <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثلاً: محمد علي"
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', marginRight: '8px' }}>رقم التليفون <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', marginRight: '8px' }}>عنوان التوصيل <span style={{ color: 'var(--danger)' }}>*</span></label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اكتب العنوان بالتفصيل (العمارة، الدور، رقم الشقة)..."
                required
                rows={3}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>
                إلغاء
              </button>
              <button type="submit" className="btn btn-primary" disabled={isPlacingOrder} style={{ flex: 1, justifyContent: 'center' }}>
                {isPlacingOrder ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cart Items */}
      <div dir="rtl">
        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>سلتك (Your Cart)</h2>
        <div className="glass-panel" style={{ padding: '24px' }}>
          {cartItems.map((item) => (
            <div 
              key={item.productId} 
              className="cart-item-container" 
              style={{ 
                display: 'flex',
                gap: '20px', 
                padding: '24px 0', 
                borderBottom: '1px solid var(--border-color)', 
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Delete Button - Top Left */}
              <button 
                onClick={() => removeFromCart(item.productId)} 
                style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  left: '0', 
                  color: 'var(--danger)', 
                  padding: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  zIndex: 2
                }}
              >
                <Trash2 size={18} />
              </button>

              <img 
                src={item.product.image} 
                alt={item.product.name} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'; }}
                style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
                className="cart-item-img"
              />
              
              <div className="cart-item-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>{item.product.price} جنيه</p>
                <p className="cart-item-total" style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem', margin: 0 }}>الإجمالي: {item.product.price * item.quantity} جنيه</p>
              </div>
              
              <div className="cart-item-controls" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px', 
                background: 'var(--bg-tertiary)', 
                padding: '10px 20px', 
                borderRadius: 'var(--radius-full)',
                justifyContent: 'center'
              }}>
                <button 
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                  style={{ color: 'var(--text-primary)', padding: '4px' }}
                >
                  <Minus size={20} />
                </button>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                  style={{ color: 'var(--text-primary)', padding: '4px' }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .cart-item-container {
            flex-direction: column !important;
            text-align: center;
          }
          .cart-item-img {
            width: 140px !important;
            height: 140px !important;
          }
          .cart-item-info {
            width: 100%;
          }
          .cart-item-controls {
            width: 100%;
            max-width: 200px;
          }
          .cart-item-total {
             margin-top: 8px !important;
          }
        }
      `}} />

      {/* Checkout Summary */}
      <div>
        <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>ملخص الطلب</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <span>المجموع الفرعي</span>
            <span>{cartTotal} جنيه</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-secondary)' }}>
            <span>رسوم التوصيل</span>
            <span>{deliveryFee} جنيه</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span>الإجمالي</span>
            <span className="gradient-text">{grandTotal} جنيه</span>
          </div>

          <div style={{ marginBottom: '24px', padding: '16px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)', fontWeight: 'bold', marginBottom: '4px' }}>
              <Banknote size={20} />
              <span>الدفع كاش عند الاستلام</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>سيتم دفع المبلغ عند استلام الطلب من المندوب</p>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            onClick={triggerCheckout}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'جاري التنفيذ...' : `إتمام الطلب • ${grandTotal} جنيه`} 
            {!isPlacingOrder && <ArrowRight size={20} style={{ marginRight: '8px', transform: 'rotate(180deg)' }} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
