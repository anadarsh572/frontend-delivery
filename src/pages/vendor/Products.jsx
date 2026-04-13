import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import { API_URL } from '../../api/config';
import AddProductModal from '../../components/modals/AddProductModal';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const VendorProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/api/vendor/products');
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

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await apiClient.delete(`/api/vendor/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('فشل في حذف المنتج');
    }
  };

  const openAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-fade-up admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '800' }}>المنتجات</h1>
        <button className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 'var(--radius-lg)' }} onClick={openAddModal}>
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}>
           <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="ابحث عن منتجات..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', 
            padding: '16px 48px 16px 16px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-color)',
            background: 'white',
            fontSize: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
          }}
        />
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        storeId={user?.storeId || user?.id}
        onSuccess={fetchProducts}
        editProduct={productToEdit}
      />

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>جاري تحميل المنتجات...</div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>لا توجد منتجات في المستودع.</p>
        </div>
      ) : (
        <div className="admin-product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(product => (
            <div key={product.id || product._id} style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              position: 'relative'
            }}>
              {/* Image Header area */}
              <div style={{
                height: '160px',
                background: 'var(--bg-secondary)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
                  <button onClick={() => handleDelete(product.id || product._id)} style={{width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', color: 'var(--danger)', cursor: 'pointer', border: 'none'}}>
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => openEditModal(product)} style={{width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', border: 'none'}}>
                    <Edit2 size={16} />
                  </button>
                </div>
                {product.image_url || product.image ? (
                   <img src={product.image_url || product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{opacity: 0.5}}><Package size={48} /></div>
                )}
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.2 }}>{product.name}</h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'left', marginBottom: '16px' }}>
                  {product.category_name || 'بدون فئة'}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', justifyContent: 'flex-end' }}>
                  {product.colors && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', background: '#FCE7F3', color: '#9D174D', borderRadius: 'var(--radius-sm)'}}>
                      ألوان: {product.colors.split(',').length}
                    </span>
                  )}
                  {product.stock_count > 0 && (
                     <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', background: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-sm)'}}>
                       بالمخزن {product.stock_count}
                     </span>
                  )}
                  {product.sizes && (
                     <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', background: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-sm)'}}>
                       مقاسات: {product.sizes}
                     </span>
                  )}
                </div>
                
                <hr style={{border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0'}} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: product.is_active !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: product.is_active !== false ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {product.is_active !== false ? 'نشط' : 'متوقف'}
                  </span>
                  <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{product.price} ج.م</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
