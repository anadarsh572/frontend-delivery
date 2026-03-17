import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { MOCK_STORES, MOCK_PRODUCTS, simulateDelay } from '../../data/mockDb';
import { Star, Clock, MapPin, Plus, ArrowLeft } from 'lucide-react';

import { API_URL } from '../../api/config';

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
          // We use toString() to ensure safe comparison regardless of data type
          const storeProducts = productsArray.filter(p => p.storeId?.toString() === storeId?.toString());
          
          // If the DB doesn't have any products for this store yet, we can optionally fall back to mocks
          // But as per user request, we want to show DB products.
          setProducts(storeProducts.length > 0 ? storeProducts : []);
        } else {
          // Fallback if API fails
          setProducts(MOCK_PRODUCTS.filter(p => p.storeId === storeId));
        }
      } catch (error) {
        console.error("API Error:", error);
        // Fallback if network fails
        setProducts(MOCK_PRODUCTS.filter(p => p.storeId === storeId));
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();
  }, [storeId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>Loading menu...</div>;
  if (!store) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--danger)' }}>Store not found.</div>;

  return (
    <div className="animate-fade-up">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary"
        style={{ marginBottom: '24px', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}
      >
        <ArrowLeft size={18} /> Back
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
        
        <div style={{ position: 'absolute', bottom: '24px', left: '32px', right: '32px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>{store.name}</h1>
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={18} color="var(--warning)" fill="var(--warning)"/> {store.averageRating} Rating</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18}/> {store.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={18}/> 25-35 min delivery</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>Menu</h2>
      
      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {products.map(product => (
          <div key={product.id} className="glass-panel card-hover" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{product.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>EGP {product.price}</span>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}
                  onClick={() => addToCart(product, store.id, 1)}
                  disabled={!product.isAvailable}
                >
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>This store has no products available yet.</p>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;
