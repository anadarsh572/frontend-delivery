import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
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

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // We need the user info, at least the role, to determine where to redirect.
        // If your API returns the user object inside `data.user`, we'll use that.
        // Otherwise, we'll see if `data.role` is available on the root object.
        const userObj = data.user || data; 
        const role = userObj.role?.toLowerCase() || data.role?.toLowerCase() || 'customer'; // Check both levels

        // Force inject role into userObj if it was only present on data level
        if (!userObj.role && data.role) {
          userObj.role = data.role;
        }

        // Save user to AuthContext and localStorage
        login(userObj);

        // Redirect based on Return URL or Role
        const returnUrl = location.state?.returnUrl;

        if (returnUrl) {
          navigate(returnUrl);
        } else if (role === 'admin') {
          navigate('/mustafa-admin-secret');
        } else if (role === 'vendor' || role === 'seller') {
          navigate('/vendor');
        } else {
          navigate('/customer');
        }

      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/google', {
        token: credentialResponse.credential
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        if (data.token) localStorage.setItem('token', data.token);
        
        const userObj = data.user || data;
        login(userObj);

        const role = userObj.role?.toLowerCase() || 'customer';
        const returnUrl = location.state?.returnUrl;

        if (returnUrl) {
          navigate(returnUrl);
        } else if (role === 'admin') {
          navigate('/mustafa-admin-secret');
        } else if (role === 'vendor' || role === 'seller') {
          navigate('/vendor');
        } else {
          navigate('/customer');
        }
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError('فشل تسجيل الدخول بواسطة جوجل. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

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
