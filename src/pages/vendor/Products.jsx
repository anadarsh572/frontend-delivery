import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../api/config';
import AddProductModal from '../../components/modals/AddProductModal';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const VendorProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formStatus, setFormStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/api/vendor/my-products');
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleAvailability = (id) => {
    // In a full implementation, this should also send a PUT/PATCH to the API
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '8px' }}>منتجات المنيو</h1>
          <p style={{ color: 'var(--text-secondary)' }}>إدارة مخزون متجرك وأسعارك بسهولة. مرتبطة بقاعدة البيانات الحية.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }} onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> إضافة منتج
        </button>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        storeId={user?.storeId || user?.id}
        onSuccess={fetchProducts}
      />

      {/* PRODUCTS LIST */}
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>جاري تحميل المخزون من قاعدة البيانات...</div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>لا توجد منتجات في قاعدة البيانات حالياً.</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>تأكد من تشغيل السيرفر أو قم بإضافة منتجات جديدة باستخدام الزر أعلاه.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>المنتج</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>السعر</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>الحالة</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold', textAlign: 'left' }}>رقم المتجر</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id || product._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 'bold' }}>{product.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {product.id || product._id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>{product.price} جنيه</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div 
                      onClick={() => toggleAvailability(product.id || product._id)}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '6px 12px', 
                        borderRadius: 'var(--radius-full)', 
                        background: product.isAvailable !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                        color: product.isAvailable !== false ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                      {product.isAvailable !== false ? 'متوفر' : 'غير متوفر'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {product.storeId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
