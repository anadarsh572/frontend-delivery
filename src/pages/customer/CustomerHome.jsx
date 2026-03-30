import { useCart } from '../../context/CartContext';
import CategoryProductCard from '../../components/products/CategoryProductCard';
import CafeCustomizationModal from '../../components/modals/CafeCustomizationModal';

const CustomerHome = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();
  const { addToCart } = useCart();
  
  // Modal state for Cafe
  const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

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

  const handleQuickAdd = (product, quantity = 1) => {
    const storeId = product.store_id || product.storeId || 1;
    addToCart(product, storeId, quantity);
  };

  const handleOpenCafeModal = (product) => {
    setActiveProduct(product);
    setIsCafeModalOpen(true);
  };

  const handleConfirmCafeAdd = (customizedProduct) => {
    addToCart(customizedProduct, customizedProduct.store_id || customizedProduct.storeId || 1, 1);
    setIsCafeModalOpen(false);
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase()) || 
    store.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-up">

      {/* Featured Stores Section */}
      <section style={{ marginBottom: '80px', padding: '24px 0', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '2.2rem', textAlign: 'center', fontWeight: '900' }}>
          <span className="gradient-text">المطاعم المميزة</span> ✨
        </h2>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '100px 0' }}>
            <RefreshCw size={40} className="spinning" color="var(--accent-primary)" />
            <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل أرقى المتاجر...</p>
          </div>
        ) : (
          <div className="grid-responsive-2 grid-responsive-3" style={{ display: 'grid', gap: '32px' }}>
            {filteredStores.map(store => (
              <Link 
                key={store.id} 
                to={`/customer/store/${store.id}`} 
                className="card-hover glass-panel"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)' }}
              >
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <img 
                    src={store.image} 
                    alt={store.name} 
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
        )}
      </section>
      
      {/* Dynamic Product Categories */}
      {!loading && ['restaurant', 'cafe', 'supermarket'].map(category => {
        const sectionProducts = products.filter(p => p.category === category);
        if (sectionProducts.length === 0) return null;

        const titles = {
          'restaurant': 'أشهى الوجبات والمطاعم 🍔',
          'cafe': 'ركن القهوة والمزاج ☕',
          'supermarket': 'احتياجات البيت والسوبر ماركت 🛒'
        };

        const colors = {
          'restaurant': 'var(--accent-primary)',
          'cafe': '#8B4513', // Coffee color
          'supermarket': 'var(--success)'
        };

        return (
          <section key={category} className="glass-panel" style={{ marginBottom: '80px', padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderRight: `6px solid ${colors[category]}`, paddingRight: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>{titles[category]}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>اكتشف العروض الحصرية في هذا القسم</p>
              </div>
              <Link to={`/customer/category/${category}`} className="btn btn-secondary" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', background: 'transparent', color: colors[category], borderColor: colors[category], fontSize: '0.9rem' }}>
                عرض الكل
              </Link>
            </div>
            
            {/* Grid Layout on Mobile/Desktop */}
            <div className="product-grid">
              {sectionProducts.slice(0, 8).map(product => (
                <CategoryProductCard 
                  key={product.id || product._id}
                  product={product}
                  category={category}
                  onAddToCart={handleQuickAdd}
                  onOpenCafeModal={handleOpenCafeModal}
                />
              ))}
            </div>
          </section>
        );
      })}

      {loading === false && filteredStores.length === 0 && products.length === 0 && (
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

      <style dangerouslySetInnerHTML={{ __html: `
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default CustomerHome;
