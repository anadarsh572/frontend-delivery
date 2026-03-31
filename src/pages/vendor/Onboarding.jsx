import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Utensils, Coffee, ShoppingBasket, ArrowLeft, CheckCircle } from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const Onboarding = ({ onSuccess }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    store_name: '',
    store_category: 'restaurant'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'restaurant', label: 'مطعم', icon: <Utensils size={24} />, greeting: "أهلاً بيك يا شيف في منصة طلقة! 👨‍🍳 يلا نأسس مطعمك ونظبط المنيو بتاعك." },
    { id: 'supermarket', label: 'سوبر ماركت', icon: <ShoppingBasket size={24} />, greeting: "يا هلا بيك في طلقة! 🛒 يلا نجهز الرفوف ونرص بضاعتك عشان الناس تطلب أسهل وفي السريع منه." }
  ];

  const selectedCategory = categories.find(c => c.id === formData.store_category);

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({ ...prev, store_category: categoryId }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.store_name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/api/vendor/create-store', formData);
      
      if (response.status === 200 || response.status === 201) {
        const storeData = response.data.store || response.data;
        const updatedUser = { 
          ...user, 
          has_store: true, 
          storeId: storeData.id || storeData.storeId || 1,
          store_id: storeData.id || storeData.storeId || 1 
        };
        login(updatedUser);
        if (onSuccess) onSuccess();
        // Auto-redirect to dashboard
        navigate('/vendor/dashboard');
      } else {
        setError(response.data.message || 'فشل في إنشاء المتجر. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('حدث خطأ في الاتصال بالسيرفر. يرجى التأكد من تشغيل الباكيند.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container animate-fade-up" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }} dir="rtl">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: 'clamp(24px, 5vw, 40px)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--info)' }}>
            <Store size={40} />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '800' }}>مرحباً بك يا {user?.name.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
            {selectedCategory.greeting}
          </p>
        </div>

        {error && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}>اختر نوع نشاطك التجاري:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  style={{ 
                    padding: '20px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: `2px solid ${formData.store_category === cat.id ? 'var(--info)' : 'var(--border-color)'}`, 
                    background: formData.store_category === cat.id ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    color: formData.store_category === cat.id ? 'var(--info)' : 'var(--text-primary)'
                  }}
                >
                  <div style={{ opacity: formData.store_category === cat.id ? 1 : 0.6 }}>{cat.icon}</div>
                  <span style={{ fontWeight: formData.store_category === cat.id ? 'bold' : 'normal' }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>اسم المتجر / العلامة التجارية:</label>
            <input 
              type="text" 
              name="store_name"
              value={formData.store_name}
              onChange={handleInputChange}
              placeholder="مثلاً: مطعم الشرق، فريش ماركت، قهوة المصريين..."
              required
              style={{ 
                width: '100%', 
                padding: '16px', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)', 
                background: 'var(--bg-tertiary)', 
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none'
              }} 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '18px', 
              fontSize: '1.2rem', 
              background: 'var(--info)', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
          >
            {loading ? 'جاري إنشاء متجرك...' : 'ابدأ الآن 🚀'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          بالضغط على "ابدأ الآن"، أنت توافق على شروط وأحكام منصة طلقة. ⚡
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
