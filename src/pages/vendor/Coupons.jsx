import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2, Search } from 'lucide-react';
import apiClient from '../../api/client';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/vendor/coupons');
      setCoupons(res.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    try {
      await apiClient.delete(`/api/vendor/coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('فشل في حذف الكوبون');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_percentage || !formData.expiry_date) {
        return alert('يرجى ملء جميع الحقول');
    }

    try {
      setIsSubmitting(true);
      await apiClient.post('/api/vendor/coupons', formData);
      setFormData({ code: '', discount_percentage: '', expiry_date: '' });
      fetchCoupons();
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert('فشل إضافة الكوبون');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orders-container animate-fade-up">
      <div className="orders-header">
        <div>
          <h1 className="page-title">إدارة الكوبونات</h1>
          <p className="page-subtitle">إنشاء ومتابعة كوبونات الخصم لعملائك</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Add Coupon Form */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <Plus size={20} className="text-primary" /> إضافة كوبون جديد
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>كود الخصم (Code)</label>
              <input type="text" name="code" className="form-input" value={formData.code} onChange={handleInputChange} placeholder="مثال: SALE20" required style={{ textTransform: 'uppercase' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>نسبة الخصم (%)</label>
              <input type="number" name="discount_percentage" className="form-input" value={formData.discount_percentage} onChange={handleInputChange} placeholder="مثال: 15" min="1" max="100" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>تاريخ الانتهاء</label>
              <input type="date" name="expiry_date" className="form-input" value={formData.expiry_date} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '8px', justifyContent: 'center' }}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'إنشاء الكوبون'}
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>الكوبونات النشطة</h3>
             <div className="search-bar" style={{ width: '200px' }}>
               <Search size={16} className="search-icon" />
               <input type="text" placeholder="بحث بكود الكوبون..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '8px 32px 8px 12px', fontSize: '0.85rem' }} />
             </div>
           </div>

           {isLoading ? (
             <div style={{ margin: 'auto', color: 'var(--text-secondary)' }}><Loader2 className="animate-spin" size={32} /></div>
           ) : filteredCoupons.length === 0 ? (
             <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <Tag size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                <p>لا توجد كوبونات للعرض</p>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, maxHeight: '400px', paddingRight: '8px' }}>
                {filteredCoupons.map((coupon) => (
                  <div key={coupon.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={16} color="var(--accent-primary)" />
                        <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>{coupon.code}</h4>
                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>{coupon.discount_percentage}% خصم</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>ينتهي في: {new Date(coupon.expiry_date).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <button onClick={() => handleDelete(coupon.id)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '8px', borderRadius: '8px' }} title="حذف الكوبون">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Coupons;
