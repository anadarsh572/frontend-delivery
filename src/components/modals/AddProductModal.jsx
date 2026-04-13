import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PlusCircle, AlertCircle, CheckCircle2, Camera, Trash2, Loader2, Edit2 } from 'lucide-react';
import apiClient from '../../api/client';

const AddProductModal = ({ isOpen, onClose, storeId, onSuccess, editProduct = null }) => {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    image_url: '', 
    is_active: true,
    colors: '',
    sizes: '',
    stock_count: 0
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [status, setStatus] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (editProduct) {
        setFormData({
          name: editProduct.name || '',
          price: editProduct.price || '',
          description: editProduct.description || '',
          category_id: editProduct.category_id || '',
          image_url: editProduct.image_url || editProduct.image || '',
          is_active: editProduct.is_active !== false,
          colors: editProduct.colors || '',
          sizes: editProduct.sizes || '',
          stock_count: editProduct.stock_count || 0
        });
        setImagePreview(editProduct.image_url || editProduct.image || null);
      } else {
        setFormData({
          name: '', price: '', description: '', category_id: '', image_url: '', is_active: true, colors: '', sizes: '', stock_count: 0
        });
        setImagePreview(null);
      }
      setStatus(null);
    }
  }, [isOpen, editProduct]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const res = await apiClient.get('/api/vendor/categories');
      setCategories(res.data);
      if (!editProduct && res.data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const compressImage = (base64Str, maxWidth = 600, maxHeight = 600, quality = 0.6) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', text: 'حجم الصورة كبير جداً، يرجى اختيار صورة أصغر من 10 ميجا.' });
        return;
      }
      
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
          const compressedBase64 = await compressImage(base64String);
          setImagePreview(compressedBase64);
          setFormData(prev => ({ ...prev, image_url: compressedBase64 }));
        } catch (err) {
          console.error('Compression error:', err);
          setStatus({ type: 'error', text: 'فشل في معالجة الصورة. حاول مرة أخرى.' });
        } finally {
          setIsCompressing(false);
        }
      };
      reader.onerror = () => {
        setIsCompressing(false);
        setStatus({ type: 'error', text: 'خطأ في قراءة الصورة.' });
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
    if (!formData.category_id) {
       setStatus({ type: 'error', text: 'يرجى اختيار الفئة أو إنشاء فئة أولاً.' });
       return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const payload = { 
        ...formData, 
        price: Number(formData.price)
      };

      let response;
      if (editProduct) {
        response = await apiClient.put(`/api/vendor/products/${editProduct.id}`, payload);
      } else {
        response = await apiClient.post('/api/vendor/products', payload);
      }

      if (response.status === 200 || response.status === 201) {
        setStatus({ type: 'success', text: editProduct ? 'تم تعديل المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!' });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setStatus({ type: 'error', text: response.data?.error || 'خطأ في العملية' });
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setStatus({ type: 'error', text: error.response?.data?.error || 'خطأ في الاتصال بالسيرفر.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="modal-overlay" style={{ perspective: '1000px', zIndex: 9999 }}>
      <div className="glass-panel modal-content scroll-container" style={{ maxHeight: '90vh', overflowY: 'auto', padding: 'clamp(24px, 5vw, 40px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ position: 'relative' }}>
            <button 
                onClick={onClose} 
                className="card-hover"
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '12px', color: 'var(--text-secondary)', zIndex: 10, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            >
                <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.2) 0%, rgba(255, 90, 31, 0.05) 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-primary)', border: '1px solid var(--border-glow)' }}>
                    {editProduct ? <Edit2 size={36} /> : <PlusCircle size={36} />}
                </div>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '900' }}>{editProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>املأ البيانات الخاصة بالمنتج.</p>
            </div>
        </div>

        {status && (
          <div className="animate-fade-up" style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${status.type === 'success' ? 'var(--success)' : 'var(--danger)'}30`, color: status.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <p style={{ fontWeight: 'bold' }}>{status.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>اسم المنتج</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="مثال: بيف برجر عائلي" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>السعر (ج.م)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="0.00" min="0" step="0.01" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>القسم (الفئة)</label>
            <select name="category_id" value={formData.category_id} onChange={handleInputChange} required style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <option value="" disabled>اختر فئة</option>
              {categories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {categories.length === 0 && !isLoadingCategories && (
               <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '8px' }}>لا توجد فئات! يرجى إضافة فئة من صفحة إدارة الفئات أولاً.</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>الكمية المخزنة (Stock)</label>
              <input type="number" name="stock_count" value={formData.stock_count} onChange={handleInputChange} placeholder="مثال: 100" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>الألوان المتاحة (اختياري)</label>
              <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} placeholder="أحمر, أزرق, أسود" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
             <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>المقاسات المتاحة (اختياري)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} placeholder="S, M, L, XL" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>الوصف</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="اكتب وصفاً جذاباً لمنتجك يشد الزبون..." style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', resize: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>صورة المنتج (اختياري لكن مفضل)</label>
            <div style={{ position: 'relative' }}>
              {!imagePreview ? (
                <div onClick={() => document.getElementById('image-upload').click()} className="upload-area card-hover" style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ padding: '16px', background: 'rgba(255, 90, 31, 0.1)', borderRadius: '50%', color: 'var(--accent-primary)', border: '1px solid var(--border-glow)' }}>
                    <Camera size={32} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>اضغط للتصوير أو اختيار صورة</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>الحد الأقصى 5 ميجابايت</p>
                  </div>
                  <input id="image-upload" type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18} color="var(--success)" /> جاهز
                    </span>
                    <button type="button" onClick={removeImage} className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Trash2 size={16} /> حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
            <label htmlFor="is_active" style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>المنتج متوفر ونشط للبيع</label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting || isCompressing} style={{ width: '100%', padding: '18px', fontSize: '1.2rem', marginTop: '12px', justifyContent: 'center' }}>
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={24} className="animate-spin" /> جاري الحفظ...
              </span>
            ) : editProduct ? 'حفظ التعديلات ✨' : 'إضافة المنتج للمتجر ✨'}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddProductModal;
