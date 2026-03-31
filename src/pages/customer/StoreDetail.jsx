import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../context/CartContext';
import { MOCK_STORES, simulateDelay } from '../../data/mockDb';
import { Star, Clock, MapPin, ArrowLeft } from 'lucide-react';
import apiClient from '../../api/client';
import ProductCard from '../../components/products/ProductCard';
import InfiniteProductList from '../../components/products/InfiniteProductList';
import ProductSkeleton from '../../components/common/ProductSkeleton';
import ProductSkeleton from '../../components/common/ProductSkeleton';

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Modal state
  const [activeProduct, setActiveProduct] = useState(null);

  // Fetch Store Details
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      await simulateDelay(300);
      return MOCK_STORES.find(s => s.id?.toString() === storeId?.toString());
    }
  });

  // Fetch Store Products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['store-products', storeId],
    queryFn: async () => {
      const response = await apiClient.get('/api/products');
      const data = response.data;
      const productsArray = Array.isArray(data) ? data : data.products || [];
      
      return productsArray.filter(p => 
        (p.store_id?.toString() === storeId?.toString()) || 
        (p.storeId?.toString() === storeId?.toString())
      );
    },
    enabled: !!storeId
  });

  const handleAddToCart = useCallback((product, quantity = 1) => {
    addToCart(product, storeId, quantity);
  }, [addToCart, storeId]);

  const handleConfirmAdd = useCallback((customizedProduct) => {
    addToCart(customizedProduct, customizedProduct.store_id || storeId, 1);
  }, [addToCart, storeId]);

  const loading = storeLoading || (productsLoading && products.length === 0);

  if (loading && !store) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '32px' }} />
        <div className="product-grid">
          {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!store) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--danger)' }}>عذراً، المتجر غير موجود.</div>;

  return (
    <div className="animate-fade-up">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary"
        style={{ marginBottom: '24px', padding: '8px 16px', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /> رجوع
      </button>

      {/* Store Header */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '0', 
          overflow: 'hidden', 
          marginBottom: '40px',
          position: 'relative',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ height: 'clamp(200px, 40vw, 350px)', width: '100%', position: 'relative' }}>
          <img 
            src={store.image} 
            alt={store.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' 
          }} />
          
          <div style={{ 
            position: 'absolute', 
            bottom: '24px', 
            right: '24px', 
            left: '24px',
            color: 'white'
          }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', marginBottom: '8px', fontWeight: '900' }}>{store.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.95rem', opacity: 0.9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={18} color="var(--warning)" fill="var(--warning)"/> {store.averageRating} تقييم</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18}/> {store.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> ٢٥-٣٥ دقيقة</span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '32px', fontSize: '1.8rem', fontWeight: '800' }}>قائمة الأصناف</h2>
      
      {products.length === 0 && !productsLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
           <p style={{ fontSize: '1.1rem' }}>لا توجد منتجات متاحة في هذا المتجر حالياً.</p>
        </div>
      ) : (
        <InfiniteProductList 
          products={products.map(p => ({ ...p, store_name: store.name }))}
          isLoading={productsLoading}
          onAddToCart={handleAddToCart}
        />
      )}

    </div>
  );
};

export default StoreDetail;

