import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Loader2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../api/client';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/vendor/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('حدث خطأ أثناء جلب الفئات');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setFormData({ name: '', description: '', image_url: '', is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image_url: category.image_url || '',
      is_active: category.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم تحويل المنتجات المرتبطة بها لتصبح بدون فئة.')) return;
    try {
      await apiClient.delete(`/api/vendor/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('فشل في حذف الفئة');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('اسم الفئة مطلوب');

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await apiClient.put(`/api/vendor/categories/${selectedCategory.id}`, formData);
      } else {
        await apiClient.post('/api/vendor/categories', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('حدث خطأ أثناء حفظ الفئة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orders-container animate-fade-up">
      <div className="orders-header">
        <div>
          <h1 className="page-title">إدارة الفئات</h1>
          <p className="page-subtitle">أضف ونظم الفئات لمنتجات متجرك</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={20} />
          <span>إضافة فئة</span>
        </button>
      </div>

      <div className="orders-controls" style={{ marginBottom: '24px' }}>
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث عن فئة..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto 16px' }} />
            <p>جاري تحميل الفئات...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Search size={40} opacity={0.5} />
            </div>
            <h3>لا توجد فئات</h3>
            <p>قم بإضافة فئات جديدة ليتمكن العملاء من تصفح منتجاتك بسهولة</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>صورة الفئة</th>
                <th>اسم الفئة</th>
                <th>الوصف</th>
                <th>الحالة</th>
                <th>تاريخ الإضافة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} color="var(--text-secondary)" />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{cat.description || '-'}</td>
                  <td>
                    <span className={`status-badge ${cat.is_active ? 'delivered' : 'cancelled'}`}>
                      {cat.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(cat.created_at).toLocaleDateString('ar-EG')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => openEditModal(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)' }} title="تعديل">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="حذف">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '32px', borderRadius: '24px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: '800' }}>{isEditing ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label>اسم الفئة <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="مثال: مشروبات، وجبات رئيسية..." 
                  required 
                />
              </div>

              <div className="form-group">
                <label>وصف الفئة</label>
                <textarea 
                  className="form-input" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="وصف مختصر للفئة (اختياري)" 
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>صورة الفئة (اختياري)</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
                      <ImageIcon size={30} color="var(--text-secondary)" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" style={{ flex: 1, padding: '10px' }} />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  id="active-check"
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="active-check" style={{ marginBottom: 0, cursor: 'pointer' }}>تفعيل הפئة وحالة ظهورها</label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <span>حفظ الفئة</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
