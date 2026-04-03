import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

import { API_URL } from '../../api/config';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'customer',
    store_category: 'restaurant' // Default category if vendor
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

    // Safety timeout to reset loading state if the request hangs
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setMessage({ type: 'error', text: 'استغرق الطلب وقتاً طويلاً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' });
      }
    }, 25000); // 25 seconds for registration (includes potential email/heavy ops)

    try {
      const response = await apiClient.post('/api/register', formData);
      clearTimeout(timeoutId);
      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        setMessage({ type: 'success', text: data.message || 'تم إنشاء الحساب بنجاح! جاري توجيهك لصفحة الدخول...' });
        if (data.token) localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Registration error details:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'فشل الاتصال بالسيرفر. يرجى التأكد من صحة البيانات.';
      setMessage({ type: 'error', text: errorMsg });
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
            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>نوع الحساب</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <label 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${formData.role === 'customer' ? 'var(--info)' : 'var(--border-color)'}`,
                  background: formData.role === 'customer' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="customer" 
                  checked={formData.role === 'customer'} 
                  onChange={handleChange} 
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span style={{ fontWeight: 'bold', color: formData.role === 'customer' ? 'var(--info)' : 'var(--text-primary)' }}>تسجيل كعميل</span>
              </label>

              <label 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${formData.role === 'vendor' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  background: formData.role === 'vendor' ? 'rgba(255, 90, 31, 0.05)' : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="vendor" 
                  checked={formData.role === 'vendor'} 
                  onChange={handleChange} 
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '1.2rem' }}>🏪</span>
                <span style={{ fontWeight: 'bold', color: formData.role === 'vendor' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>تسجيل كتاجر</span>
              </label>
            </div>
          </div>

          {/* Conditional Store Category Dropdown for Vendors */}
          {formData.role === 'vendor' && (
            <div className="animate-fade-down" style={{ marginTop: '-8px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>تصنيف المتجر</label>
              <select 
                name="store_category"
                value={formData.store_category}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '2px solid var(--accent-primary)', 
                  background: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              >
                <option value="restaurant">مطعم (Restaurant)</option>
                <option value="supermarket">سوبر ماركت (Supermarket)</option>
              </select>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>هذا التصنيف سيساعد العملاء في العثور عليك بسهولة.</p>
            </div>
          )}

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

          <div style={{ margin: '20px 0', position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: 0 }} />
            <span style={{ position: 'relative', background: 'var(--bg-secondary)', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 1 }}>أو</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
              onSuccess={async (credentialResponse) => {
                setLoading(true);
                setMessage(null);
                try {
                  const response = await apiClient.post('/api/auth/google', {
                    token: credentialResponse.credential,
                    role: formData.role // Pass intended role
                  });
                  if (response.status === 200 || response.status === 201) {
                    const data = response.data;
                    if (data.token) localStorage.setItem('token', data.token);
                    setMessage({ type: 'success', text: 'تم تسجيل الدخول بنجاح!' });
                    setTimeout(() => navigate('/'), 1500);
                  }
                } catch (err) {
                  setMessage({ type: 'error', text: 'فشل التسجيل بواسطة جوجل.' });
                } finally {
                  setLoading(false);
                }
              }} 
              onError={() => setMessage({ type: 'error', text: 'فشل التسجيل بواسطة جوجل' })}
              theme="outline"
              shape="pill"
              text="signup_with"
              locale="ar"
            />
          </div>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p>لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>تسجيل الدخول</Link></p>
          <p style={{ fontSize: '0.9rem' }}>هل أنت صاحب متجر؟ <Link to="/vendor/register" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>سجل كتاجر هنا</Link></p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-down {
          animation: fadeDown 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}

export default Register;
