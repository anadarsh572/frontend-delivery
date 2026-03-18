import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

import { API_URL } from '../../api/config';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'Customer'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' });
        // Optional: clear form or navigate after delay
        // setTimeout(() => navigate('/'), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ type: 'error', text: 'Network error. Please make sure the backend server is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container animate-fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <ArrowLeft size={18} style={{ marginLeft: '8px', transform: 'rotate(180deg)' }} /> العودة للرئيسية
        </Link>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: 'clamp(24px, 5vw, 40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(255, 90, 31, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-primary)' }}>
            <UserPlus size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>إنشاء حساب جديد</h1>
          <p style={{ color: 'var(--text-secondary)' }}>انضم إلى منصتنا المميزة للتوصيل اليوم.</p>
        </div>

        {message && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
            {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <p style={{ fontWeight: 'bold' }}>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>الاسم بالكامل</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثلاً: مصطفى علي"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mostafa@example.com"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01012345678"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Delivery Address / Store Location</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street Name, City"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>نوع الحساب</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', appearance: 'none' }}
            >
              <option value="Customer">عميل (طلب طعام ومنتجات)</option>
              <option value="Vendor">تاجر (صاحب مطعم/متجر)</option>
              <option value="Driver">مندوب (شريك توصيل)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', marginTop: '12px', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'جاري إنشاء الحساب...' : 'تسجيل الحساب'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p>لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>تسجيل الدخول</Link></p>
          <p style={{ fontSize: '0.9rem' }}>هل أنت صاحب متجر؟ <Link to="/vendor/register" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>سجل كتاجر هنا</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
