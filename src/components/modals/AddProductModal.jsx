import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle2, Camera, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { API_URL } from '../../api/config';

const AddProductModal = ({ isOpen, onClose, storeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'restaurant',
    image_url: '', // This will hold the Base64 string
    is_available: true
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        setStatus({ type: 'error', text: 'حجم الصورة كبير جداً! الحد الأقصى 5 ميجابايت.' });
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image_url: base64String }));
        setIsUploading(false);
      };

      reader.onerror = () => {
        setStatus({ type: 'error', text: 'فشل في قراءة ملف الصورة.' });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
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
            image_url: '',
            is_available: true
          });
          setImagePreview(null);
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
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ padding: 'clamp(24px, 5vw, 40px)', maxHeight: '90vh' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '50%', color: 'var(--text-secondary)', zIndex: 10 }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(255, 90, 31, 0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-primary)', boxShadow: '0 0 20px rgba(255, 90, 31, 0.2)' }}>
            <PlusCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>إضافة منتج جديد</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>املأ البيانات لإضافة صنف جديد للمنيو الخاص بك.</p>
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
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>صورة المنتج</label>
            
            <div style={{ position: 'relative' }}>
              {!imagePreview ? (
                <div 
                  className="upload-area"
                  style={{ 
                    width: '100%', 
                    height: '160px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '2px dashed var(--border-color)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    background: 'var(--bg-tertiary)',
                    overflow: 'hidden'
                  }}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <div style={{ padding: '12px', background: 'rgba(255, 90, 31, 0.1)', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                    <Camera size={28} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>اضغط هنا للتصوير أو اختيار صورة</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>PNG, JPG حتى 5MB</p>
                  </div>
                  <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} 
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: 'rgba(0,0,0,0.6)', 
                      backdropFilter: 'blur(5px)',
                      padding: '8px 16px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>تم اختيار الصورة ✓</span>
                    <button 
                      type="button"
                      onClick={removeImage}
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.2)', 
                        border: '1px solid var(--danger)', 
                        color: 'var(--danger)', 
                        padding: '6px 12px', 
                        borderRadius: 'var(--radius-md)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} /> تغيير الصورة
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Hidden fallback if they still want URL, but simplified */}
            <input type="hidden" name="image_url" value={formData.image_url} />
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
