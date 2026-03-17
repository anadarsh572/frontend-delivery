import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus, Minus, CreditCard, Banknote, ArrowRight, X, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

import { API_URL } from '../../api/config';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Checkout Modal State
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const deliveryFee = 35; // Fixed for now
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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authFormData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        
        const userObj = data.user || data; 
        const role = userObj.role?.toLowerCase() || data.role?.toLowerCase() || 'customer';
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
    
    if (!phone.trim() || !address.trim()) {
      alert("Please provide both phone number and delivery address.");
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      // Assuming all items in cart are from the same store for food delivery
      const storeId = cartItems.length > 0 ? cartItems[0].storeId : null;
      
      const payload = {
        user_id: parseInt(user.id || user._id, 10), 
        store_id: 1, // Hardcoded to 1 as requested for now
        total_price: grandTotal, // Updated from total
        payment_method: paymentMethod,
        delivery_address: address,
        customer_phone: phone,
        items: cartItems.map(item => ({
          product_id: parseInt(item.productId || item.product._id || item.product.id, 10),
          quantity: parseInt(item.quantity, 10),
          price: Number(item.product.price)
        }))
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Clear cart and show success dialog
        clearCart();
        setShowModal(false);
        setOrderSuccess(true);
      } else {
        const data = await response.json();
        alert(`Failed to place order: ${data.message || 'Backend Error'}`);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Network error. Please make sure the backend server is running.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="glass-panel animate-fade-up" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your delicious food is being prepared.</p>
        <button className="btn btn-primary" onClick={() => navigate('/customer/profile')}>
          Track Order
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="glass-panel animate-fade-up" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Looks like you haven't added any premium food yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/customer')}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
      
      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-up" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }} dir="ltr">
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--info)' }}>
                {authMode === 'login' ? <LogIn size={28} /> : <UserPlus size={28} />}
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{authMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{authMode === 'login' ? 'Sign in to complete your order.' : 'Register to complete your order.'}</p>
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
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input type="text" name="name" value={authFormData.name} onChange={handleAuthChange} placeholder="John Doe" required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" name="email" value={authFormData.email} onChange={handleAuthChange} placeholder="john@example.com" required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                <input type="password" name="password" value={authFormData.password} onChange={handleAuthChange} placeholder="••••••••" required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px', justifyContent: 'center' }} disabled={authLoading}>
                {authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {authMode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(null); }} style={{ background: 'none', border: 'none', color: 'var(--info)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>Register</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(null); }} style={{ background: 'none', border: 'none', color: 'var(--info)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>Sign In</button></>
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
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center' }}>الإجمالي: <span style={{ fontWeight: 'bold' }}>{grandTotal} جنيه</span></p>

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
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Your Cart</h2>
        <div className="glass-panel" style={{ padding: '24px' }}>
          {cartItems.map((item) => (
            <div key={item.productId} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
              <img src={item.product.image} alt={item.product.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>EGP {item.product.price}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ color: 'var(--text-primary)' }}><Minus size={16} /></button>
                <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ color: 'var(--text-primary)' }}><Plus size={16} /></button>
              </div>
              
              <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                EGP {item.product.price * item.quantity}
              </div>
              
              <button onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--danger)', padding: '8px' }}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Summary */}
      <div>
        <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <span>Subtotal</span>
            <span>EGP {cartTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-secondary)' }}>
            <span>Delivery Fee</span>
            <span>EGP {deliveryFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span>Total</span>
            <span className="gradient-text">EGP {grandTotal}</span>
          </div>

          <h4 style={{ marginBottom: '16px' }}>Payment Method</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid ${paymentMethod === 'Cash' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)' }}>
              <input type="radio" name="payment" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} style={{ display: 'none' }} />
              <Banknote size={24} color={paymentMethod === 'Cash' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: paymentMethod === 'Cash' ? 'bold' : 'normal' }}>Cash on Delivery</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid ${paymentMethod === 'Online' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)' }}>
              <input type="radio" name="payment" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} style={{ display: 'none' }} />
              <CreditCard size={24} color={paymentMethod === 'Online' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: paymentMethod === 'Online' ? 'bold' : 'normal' }}>Online Payment</span>
            </label>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            onClick={triggerCheckout}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'Processing...' : `Place Order • EGP ${grandTotal}`} 
            {!isPlacingOrder && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
