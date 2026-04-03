import { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { ShoppingBag, Store, Navigation, ShieldCheck, Plus, ShoppingCart, LogIn, Search, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from './api/client';
import './App.css';

// Context & Providers
import { useCart } from './context/CartContext';
import { SearchProvider, useSearch } from './context/SearchContext';
import { useAuth } from './context/AuthContext';

// Components & Layouts
import CustomerLayout from './components/layouts/CustomerLayout';
import SplashScreen from './components/common/SplashScreen';
import ProductCard from './components/products/ProductCard';
import ProductSkeleton from './components/common/ProductSkeleton';
import InfiniteProductList from './components/products/InfiniteProductList';

// Pages
import Cart from './pages/customer/Cart';
import CategoryPage from './pages/customer/CategoryPage';

const LandingPage = () => {
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Redirect Vendors & Admins away from Customer Landing Page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      const role = user.role?.toLowerCase();
      if (role === 'admin') navigate('/mustafa-admin-secret');
      else if (role === 'vendor') navigate('/vendor/dashboard');
    }
  }, [user, navigate]);

  // Modal state
  const [activeProduct, setActiveProduct] = useState(null);

  // React Query for products and search
  const {
    data: products = [],
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      const url = searchQuery.trim()
        ? `/api/products/search?q=${encodeURIComponent(searchQuery)}`
        : '/api/products';
      const response = await apiClient.get(url);
      const data = response.data;
      const productsArray = Array.isArray(data) ? data : data.products || [];
      return productsArray.filter(p => p.isAvailable !== false);
    },
    enabled: true,
  });

  const categoryProducts = useMemo(() => {
    if (searchQuery.trim()) return { search: products };
    const categories = ['restaurant', 'supermarket'];
    const result = {};
    categories.forEach(cat => {
      result[cat] = products.filter(p => p.category === cat).slice(0, 10);
    });
    return result;
  }, [products, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleAddToCart = useCallback((product, quantity = 1) => {
    const storeId = product.store_id || product.storeId || 1;
    addToCart(product, storeId, quantity);
  }, [addToCart]);


  const handleConfirmAdd = useCallback((customizedProduct) => {
    addToCart(customizedProduct, customizedProduct.store_id || customizedProduct.storeId || 1, 1);
    navigate('/cart');
  }, [addToCart, navigate]);

  return (
    <div className="landing-container animate-fade-up">
      <div className="hero-section" style={{ minHeight: 'auto', padding: 'clamp(40px, 10vw, 80px) 20px', textAlign: 'center' }}>
        <h1 className="gradient-text hero-title" style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', lineHeight: 1.1, marginBottom: '24px' }}>
          طلقة ⚡
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '32px', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)' }}>
          في السريع منه ⚡
        </p>

        {!localStorage.getItem('token') && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-secondary" style={{ minWidth: '140px' }}>
              تسجيل الدخول
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ minWidth: '140px' }}>
              إنشاء حساب جديد
            </Link>
          </div>
        )}
      </div>

      <div className="container" style={{ padding: '0 20px 80px' }}>
        <div style={{ marginTop: '20px' }}>
          {isError ? (
            <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px 0' }}>
              <p>حدث خطأ أثناء تحميل البيانات.</p>
              <button onClick={() => refetch()} className="btn btn-secondary" style={{ marginTop: '16px' }}>إعادة المحاولة</button>
            </div>
          ) : products.length === 0 && !isLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '40px 0' }}>
              {searchQuery ? 'عذراً، لم نجد أكلات تطابق بحثك' : 'لا يوجد منتجات متاحة حالياً'}
            </div>
          ) : searchQuery.trim() ? (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '32px', textAlign: 'center', fontWeight: '800' }}>نتائج البحث</h2>
              <InfiniteProductList
                products={products}
                isLoading={isLoading}
                onAddToCart={handleAddToCart}
              />
            </div>
          ) : (
            <div style={{ opacity: isFetching && !isLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
              {['restaurant', 'supermarket'].map(category => {
                const sectionProducts = categoryProducts[category];
                if (!sectionProducts || sectionProducts.length === 0) return null;

                const titles = {
                  'restaurant': 'أشهى الوجبات والمطاعم 🍔',
                  'supermarket': 'احتياجات البيت والسوبر ماركت 🛒'
                };

                const colors = {
                  'restaurant': 'var(--accent-primary)',
                  'supermarket': 'var(--success)'
                };

                return (
                  <section key={category} className="glass-panel" style={{ marginBottom: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderRight: `5px solid ${colors[category]}`, paddingRight: '12px' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{titles[category]}</h2>
                      <Link to={`/category/${category}`} className="mobile-hide" style={{ color: colors[category], fontSize: '0.9rem', fontWeight: '600' }}>عرض الكل</Link>
                    </div>

                    <div className="product-grid scroll-container">
                      {sectionProducts.map(product => (
                        <div key={product.id || product._id} className="scroll-item">
                          <ProductCard
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}


          {searchQuery && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button onClick={clearSearch} className="btn btn-secondary">العودة للكل</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import CustomerApp from './pages/customer';
import VendorApp from './pages/vendor';
import AdminApp from './pages/admin';
import Register from './pages/auth/Register';
import VendorRegister from './pages/auth/VendorRegister';
import Login from './pages/auth/Login';
import AdminGuard from './components/guards/AdminGuard';
import VendorGuard from './components/guards/VendorGuard';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>جاري التحميل...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role?.toLowerCase() || 'customer';
  const isAuthorized = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SearchProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router>
        <Routes>
          <Route path="/" element={<CustomerLayout fullWidth><LandingPage /></CustomerLayout>} />
          <Route path="/category/:category" element={<CustomerLayout><CategoryPage /></CustomerLayout>} />
          <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute allowedRoles={['customer', 'user', 'admin']} />}>
            <Route path="/customer/*" element={<CustomerApp />} />
          </Route>

          <Route element={<VendorGuard />}>
            <Route path="/vendor/*" element={<VendorApp />} />
          </Route>

          <Route element={<AdminGuard />}>
            <Route path="/mustafa-admin-secret/*" element={<AdminApp />} />
          </Route>
        </Routes>
      </Router>
    </SearchProvider>
  );
}


export default App;
