import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { MOCK_STORES, MOCK_PRODUCTS, simulateDelay } from '../../data/mockDb';
import { Star, Clock, MapPin, Plus, ArrowLeft } from 'lucide-react';

import CategoryProductCard from '../../components/products/CategoryProductCard';
import CafeCustomizationModal from '../../components/modals/CafeCustomizationModal';

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state for Cafe
  const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      // Fetch mock store details for aesthetics
      await simulateDelay(300);
      const foundStore = MOCK_STORES.find(s => s.id === storeId);
      setStore(foundStore);

      // Fetch LIVE products from DB
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          const productsArray = data.data || data.products || (Array.isArray(data) ? data : []);
          
          // Filter to only match THIS store
          const storeProducts = productsArray.filter(p => 
            (p.store_id?.toString() === storeId?.toString()) || 
            (p.storeId?.toString() === storeId?.toString())
          );
          
          setProducts(storeProducts.length > 0 ? storeProducts : []);
        } else {
          // Fallback if API fails
          setProducts(MOCK_PRODUCTS.filter(p => p.storeId === storeId));
        }
      } catch (error) {
        console.error("API Error:", error);
        setProducts(MOCK_PRODUCTS.filter(p => p.storeId === storeId));
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();
  }, [storeId]);

  const handleQuickAdd = (product, quantity = 1) => {
    addToCart(product, store?.id || storeId, quantity);
  };

  const handleOpenCafeModal = (product) => {
    setActiveProduct(product);
    setIsCafeModalOpen(true);
  };

  const handleConfirmCafeAdd = (customizedProduct) => {
    addToCart(customizedProduct, customizedProduct.store_id || storeId, 1);
    setIsCafeModalOpen(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>جاري تحميل المنيو...</div>;
  if (!store) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--danger)' }}>عذراً، المتجر غير موجود.</div>;

  return (
    <div className="animate-fade-up">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary"
        style={{ marginBottom: '24px', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}
      >
        <ArrowLeft size={18} style={{ marginLeft: '8px' }} /> رجوع
      </button>

      {/* Store Header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '0', 
          overflow: 'hidden', 
          marginBottom: '40px',
          position: 'relative'
        }}
      >
        <div style={{ height: '300px', width: '100%' }}>
          <img 
            src={store.image} 
            alt={store.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, var(--bg-primary), transparent)' }} />
        </div>
        
        <div style={{ position: 'absolute', bottom: '24px', right: '32px', left: '32px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>{store.name}</h1>
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={18} color="var(--warning)" fill="var(--warning)"/> {store.averageRating} تقييم</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18}/> {store.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={18}/> توصيل في ٢٥-٣٥ دقيقة</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>المنيو</h2>
      
      {/* Products Grid */}
      <div className="product-grid">
        {products.map(product => (
          <CategoryProductCard 
            key={product.id || product._id}
            product={{...product, store_name: store.name}} 
            category={store.id.includes('cafe') ? 'cafe' : (store.id.includes('supermarket') ? 'supermarket' : 'restaurant')}
            onAddToCart={handleQuickAdd}
            onOpenCafeModal={handleOpenCafeModal}
          />
        ))}
        {products.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', padding: '40px 0' }}>لا توجد منتجات متاحة في هذا المتجر حالياً.</p>
        )}
      </div>

      {activeProduct && (
        <CafeCustomizationModal 
          isOpen={isCafeModalOpen}
          onClose={() => setIsCafeModalOpen(false)}
          product={activeProduct}
          onConfirm={handleConfirmCafeAdd}
        />
      )}
    </div>
  );
};

export default StoreDetail;
