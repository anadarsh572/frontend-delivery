import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, MapPin } from 'lucide-react';
import { MOCK_STORES, simulateDelay } from '../../data/mockDb';

import { useSearch } from '../../context/SearchContext';

const CustomerHome = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, productsRes] = await Promise.all([
          simulateDelay(600).then(() => ({ ok: true, json: () => MOCK_STORES })),
          fetch(`${import.meta.env.VITE_API_URL || 'https://talqa-backend.vercel.app'}/api/products`)
        ]);

        const storesData = await storesRes.json();
        setStores(storesData);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(Array.isArray(productsData) ? productsData : productsData.products || []);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase()) || 
    store.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-up">

      <h2 style={{ marginTop: '40px', marginBottom: '32px', fontSize: '2rem', textAlign: 'center' }}>المطاعم المميزة</h2>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
          جاري تحميل أرقى المتاجر...
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '32px', marginBottom: '60px' }}>
            {filteredStores.map(store => (
              <Link 
                key={store.id} 
                to={`/customer/store/${store.id}`} 
                className="card-hover glass-panel"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(8px)' }}>
                    <Star size={16} color="var(--warning)" fill="var(--warning)" />
                    <span style={{ fontWeight: 'bold' }}>{store.averageRating}</span>
                  </div>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{store.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16}/> {store.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> ٢٥-٣٥ دقيقة</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* DYNAMIC PRODUCT CATEGORIES */}
          {['restaurant', 'cafe', 'supermarket'].map(category => {
            const sectionProducts = products.filter(p => p.category === category);
            if (sectionProducts.length === 0) return null;

            const titles = {
              'restaurant': 'أشهى الوجبات والمطاعم 🍔',
              'cafe': 'ركن القهوة والمزاج ☕',
              'supermarket': 'احتياجات البيت والسوبر ماركت 🛒'
            };

            return (
              <div key={category} style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>{titles[category]}</h2>
                  <Link to={`/customer/category/${category}`} className="btn btn-secondary" style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', fontSize: '0.9rem', flexShrink: 0 }}>
                    عرض الكل
                  </Link>
                </div>
                
                <div className="horizontal-scroll" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '24px', scrollSnapType: 'x mandatory' }}>
                  {sectionProducts.slice(0, 8).map(product => (
                    <div key={product.id || product._id} className="glass-panel card-hover" style={{ minWidth: '260px', maxWidth: '280px', flex: '0 0 auto', scrollSnapAlign: 'start', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{product.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', height: '40px', overflow: 'hidden' }}>{product.description}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{product.price} ج.م</span>
                          <Link to={`/customer/store/${product.store_id || product.storeId || 1}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>التفاصيل</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredStores.length === 0 && products.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>عذراً، لم نجد نتائج تطابق بحثك أو المنتجات قيد الإضافة.</p>
          )}

          <style dangerouslySetInnerHTML={{ __html: `
            .horizontal-scroll::-webkit-scrollbar {
              height: 6px;
            }
            .horizontal-scroll::-webkit-scrollbar-track {
              background: var(--bg-tertiary);
              border-radius: 10px;
            }
            .horizontal-scroll::-webkit-scrollbar-thumb {
              background: var(--accent-primary);
              border-radius: 10px;
            }
          `}} />
        </>
      )}
    </div>
  );
};

export default CustomerHome;
