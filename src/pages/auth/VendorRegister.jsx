import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

import { API_URL } from '../../api/config';

const VendorRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    store_category: 'restaurant',
    role: 'Vendor'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Safety timeout to reset loading state if the request hangs
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('استغرق الطلب وقتاً طويلاً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
      }
    }, 25000);

    try {
      const response = await apiClient.post('/api/register', formData);
      clearTimeout(timeoutId);
      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        if (data.token) localStorage.setItem('token', data.token);
        
        const userObj = data.user || { 
            ...formData, 
            id: data.id || Date.now()
        };
        
        login(userObj);
        navigate('/vendor');
      } else {
        setError(data.message || 'فشل إنشاء الحساب. تأكد من صحة البيانات.');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Vendor Registration error details:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container animate-fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <ArrowLeft size={18} /> العودة للرئيسية
        </Link>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(255, 75, 43, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-primary)' }}>
            <Store size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>سجل كتاجر (Vendor)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>ابدأ بيع منتجاتك والوصول لآلاف العملاء اليوم.</p>
        </div>

        {error && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <AlertCircle size={24} />
            <p style={{ fontWeight: 'bold' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>البيانات الشخصية</h3>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>الاسم الكامل</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثلاً: محمد علي"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>البريد الإلكتروني</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>رقم الهاتف</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010xxxxxxx"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>كلمة المرور</label>
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

          <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>بيانات المتجر (Store Details)</h3>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>اسم المتجر</label>
            <input 
              type="text" 
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="مثلاً: مطعم الشرق"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>نوع النشاط (Category)</label>
            <select 
              name="store_category"
              value={formData.store_category}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', appearance: 'none' }}
            >
              <option value="restaurant">مطعم (Restaurant)</option>
              <option value="supermarket">سوبر ماركت (Supermarket)</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب التاجر'}
            </button>

            <div style={{ margin: '20px 0', position: 'relative', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: 0 }} />
              <span style={{ position: 'relative', background: 'var(--bg-secondary)', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 1 }}>أو</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin 
                onSuccess={async (credentialResponse) => {
                  setLoading(true);
                  setError(null);
                  try {
                    const response = await apiClient.post('/api/auth/google', {
                      token: credentialResponse.credential,
                      role: 'Vendor'
                    });
                    if (response.status === 200 || response.status === 201) {
                      const data = response.data;
                      if (data.token) localStorage.setItem('token', data.token);
                      
                      const userObj = data.user || data;
                      login(userObj);
                      navigate('/vendor');
                    }
                  } catch (err) {
                    console.error('Google auth error:', err);
                    setError('فشل التسجيل بواسطة جوجل.');
                  } finally {
                    setLoading(false);
                  }
                }} 
                onError={() => setError('فشل التسجيل بواسطة جوجل')}
                theme="outline"
                shape="pill"
                text="signup_with"
                locale="ar"
              />
            </div>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>سجل دخول</Link>
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;
