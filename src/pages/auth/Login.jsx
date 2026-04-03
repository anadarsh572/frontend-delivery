import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
// import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

import { API_URL } from '../../api/config';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    }, 20000); // 20 seconds safety timeout

    try {
      const response = await apiClient.post('/api/login', formData);
      clearTimeout(timeoutId);
      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        const userObj = data.user || data; 
        const role = userObj.role?.toLowerCase() || data.role?.toLowerCase() || 'customer'; 

        if (!userObj.role && data.role) {
          userObj.role = data.role;
        }

        login(userObj);

        // Redirect based on Return URL or Role
        const returnUrl = location.state?.returnUrl;
        
        console.log('Login successful, navigating to:', returnUrl || role);

        if (returnUrl) {
          navigate(returnUrl);
        } else if (role === 'admin') {
          navigate('/mustafa-admin-secret');
        } else if (role === 'vendor') {
          if (userObj.has_store === false || userObj.has_store === 0) {
            navigate('/vendor/onboarding');
          } else {
            navigate('/vendor/dashboard');
          }
        } else {
          navigate('/customer/home');
        }

      } else {
        setError(data.message || data.error || 'خطأ في الدخول. تأكد من البريد أو الباسورد.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Login error details:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'فشل الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /*
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    // ... logic commented out ...
  };
  */

  return (
    <div className="landing-container animate-fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <ArrowLeft size={18} style={{ marginLeft: '8px', transform: 'rotate(180deg)' }} /> العودة للرئيسية
        </Link>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: 'clamp(24px, 5vw, 40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--info)' }}>
            <LogIn size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>أهلاً بك مجدداً</h1>
          <p style={{ color: 'var(--text-secondary)' }}>سجل دخولك إلى حسابك.</p>
        </div>

        {error && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <AlertCircle size={24} />
            <p style={{ fontWeight: 'bold' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>البريد الإلكتروني</label>
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

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', marginTop: '12px', fontSize: '1.1rem', background: 'var(--info)' }}
            disabled={loading}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          {/* 
          <div style={{ margin: '20px 0', position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: 0 }} />
            <span style={{ position: 'relative', background: 'var(--bg-secondary)', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 1 }}>أو</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => setError('فشل تسجيل الدخول بواسطة جوجل')}
              theme="filled_blue"
              shape="pill"
              text="signin_with"
              locale="ar"
            />
          </div>
          */}
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p>ليس لديك حساب؟ <Link to="/register" style={{ color: 'var(--info)', fontWeight: 'bold' }}>سجل الآن</Link></p>
          <p style={{ fontSize: '0.9rem' }}>هل أنت صاحب مطجر؟ <Link to="/vendor/register" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>سجل كتاجر</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
