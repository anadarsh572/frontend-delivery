import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Star, MapPin, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { simulateDelay, MOCK_STORES } from '../../data/mockDb';
import ProductCard from '../../components/products/ProductCard';
import InfiniteProductList from '../../components/products/InfiniteProductList';
import CafeCustomizationModal from '../../components/modals/CafeCustomizationModal';

const CustomerHome = () => {
  const { query } = useSearch();
  const { addToCart } = useCart();
  
  // Modal state for Cafe
  const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // Fetch Stores (Simulated)
  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      await simulateDelay(600);
      return MOCK_STORES;
    }
  });

  // Fetch Products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products-home'],
    queryFn: async () => {
      const response = await apiClient.get('/api/products');
      const data = response.data;
      return Array.isArray(data) ? data : data.products || [];
    }
  });

  const handleQuickAdd = useCallback((product, quantity = 1) => {
    const storeId = product.store_id || product.storeId || 1;
    addToCart(product, storeId, quantity);
  }, [addToCart]);

  const handleOpenCafeModal = useCallback((product) => {
    setActiveProduct(product);
    setIsCafeModalOpen(true);
  }, []);

  const handleConfirmCafeAdd = useCallback((customizedProduct) => {
    addToCart(customizedProduct, customizedProduct.store_id || customizedProduct.storeId || 1, 1);
    setIsCafeModalOpen(false);
  }, [addToCart]);

  const filteredStores = useMemo(() => {
    if (!query) return stores;
    const lowerQuery = query.toLowerCase();
    return stores.filter(store => 
      store.name.toLowerCase().includes(lowerQuery) || 
      store.location.toLowerCase().includes(lowerQuery)
    );
  }, [stores, query]);

  const categoryProducts = useMemo(() => {
    const categories = ['restaurant', 'cafe', 'supermarket'];
    const result = {};
    categories.forEach(cat => {
      result[cat] = products.filter(p => p.category === cat).slice(0, 8);
    });
    return result;
  }, [products]);

  const loading = storesLoading || productsLoading;

  if (loading && stores.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '100px 0' }}>
        <RefreshCw size={40} className="spinning" color="var(--accent-primary)" />
        <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل أرقى المتاجر والباقات...</p>
        <style dangerouslySetInnerHTML={{ __html: `
          .spinning { animation: spin 1.s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">

      {/* Featured Stores Section */}
      <section style={{ marginBottom: '60px', padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
             <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>
               المطاعم المميزة ✨
             </h2>
        </div>
        
        <div className="grid-responsive-2 grid-responsive-3 scroll-container" style={{ display: 'grid', gap: '32px' }}>
          {filteredStores.map(store => (
            <Link 
              key={store.id} 
              to={`/customer/store/${store.id}`} 
              className="card-hover glass-panel scroll-item store-scroll-item"
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)' }}
            >
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <img 
                  src={store.image} 
                  alt={store.name} 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}>
                  <Star size={16} color="var(--warning)" fill="var(--warning)" />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{store.averageRating}</span>
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{store.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16}/> {store.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px' }}><Clock size={14}/> ٢٥-٣٥ د</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Dynamic Product Categories */}
      {['restaurant', 'cafe', 'supermarket'].map(category => {
        const sectionProducts = categoryProducts[category];
        if (!sectionProducts || sectionProducts.length === 0) return null;

        const titles = {
          'restaurant': 'أشهى الوجبات والمطاعم 🍔',
          'cafe': 'ركن القهوة والمزاج ☕',
          'supermarket': 'احتياجات البيت والسوبر ماركت 🛒'
        };

        const colors = {
          'restaurant': 'var(--accent-primary)',
          'cafe': '#8B4513', 
          'supermarket': 'var(--success)'
        };

        return (
          <section key={category} className="glass-panel" style={{ marginBottom: '60px', padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderRight: `6px solid ${colors[category]}`, paddingRight: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>{titles[category]}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>اكتشف العروض الحصرية في هذا القسم</p>
              </div>
              <Link to={`/customer/category/${category}`} className="btn btn-secondary" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', background: 'transparent', color: colors[category], borderColor: colors[category], fontSize: '0.9rem' }}>
                عرض الكل
              </Link>
            </div>
            
            <div className="product-grid scroll-container">
              {sectionProducts.map(product => (
                <div key={product.id || product._id} className="scroll-item">
                  <ProductCard 
                    product={product}
                    onAddToCart={handleQuickAdd}
                    onOpenCafeModal={handleOpenCafeModal}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {!loading && filteredStores.length === 0 && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem' }}>عذراً، لم نجد نتائج تطابق بحثك أو المنتجات قيد الإضافة.</p>
        </div>
      )}

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

export default CustomerHome;
