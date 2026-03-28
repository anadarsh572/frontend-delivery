import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../api/config';

const AddProductModal = ({ isOpen, onClose, storeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', // Default image
    is_available: true
  });
  
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      // Ensure storeId is included in the payload
      const payload = { 
        ...formData, 
        price: Number(formData.price),
        storeId: storeId || 1 // Fallback if storeId is missing
      };

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', text: 'تم إضافة المنتج بنجاح!' });
        setTimeout(() => {
          onSuccess();
          onClose();
          // Reset form
          setFormData({
            name: '',
            price: '',
            description: '',
            category: 'restaurant',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
            is_available: true
          });
          setStatus(null);
        }, 1500);
      } else {
        setStatus({ type: 'error', text: data.message || 'خطأ في إضافة المنتج.' });
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setStatus({ type: 'error', text: 'خطأ في الاتصال. يرجى التأكد من تشغيل السيرفر.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '15px' }}>
      <div className="glass-panel animate-fade-up" style={{ width: '100%', maxWidth: '600px', padding: 'clamp(20px, 5vw, 40px)', position: 'relative', maxHeight: '95vh', overflowY: 'auto', border: '1px solid var(--accent-primary)', boxShadow: '0 0 40px rgba(255, 90, 31, 0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(255, 90, 31, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-primary)' }}>
            <PlusCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>إضافة منتج جديد</h2>
          <p style={{ color: 'var(--text-secondary)' }}>املأ البيانات لإضافة صنف جديد للمنيو الخاص بك.</p>
        </div>

        {status && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <p style={{ fontWeight: 'bold' }}>{status.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>اسم المنتج</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                placeholder="مثلاً: بيف برجر عائلي" 
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>السعر (جنيه)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                required 
                placeholder="مثلاً: 150" 
                min="0" 
                step="0.01" 
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>القسم (الفئة)</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="restaurant">مطعم (Restaurant)</option>
              <option value="cafe">كافيه (Cafe)</option>
              <option value="supermarket">سوبر ماركت (Supermarket)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>الوصف</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              required 
              rows="3" 
              placeholder="وصف مشهي للمنتج..." 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', resize: 'vertical' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>رابط صورة المنتج</label>
            <input 
              type="url" 
              name="image" 
              value={formData.image} 
              onChange={handleInputChange} 
              placeholder="https://..." 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="checkbox" 
              id="is_available" 
              name="is_available" 
              checked={formData.is_available} 
              onChange={handleInputChange} 
              style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
            />
            <label htmlFor="is_available" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>المنتج متوفر حالياً</label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting} 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '12px', justifyContent: 'center' }}
          >
            {isSubmitting ? 'جاري الحفظ...' : 'إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
