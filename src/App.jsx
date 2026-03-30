import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Navigation, ShieldCheck, Plus, ShoppingCart, LogIn, Search, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from './api/client';
import './App.css';

// Placeholder Components
import { useCart } from './context/CartContext';
import CustomerLayout from './components/layouts/CustomerLayout';
import Cart from './pages/customer/Cart';
import CategoryPage from './pages/customer/CategoryPage';
import { Utensils, Coffee, ShoppingBasket } from 'lucide-react';
import CategoryProductCard from './components/products/CategoryProductCard';
import CafeCustomizationModal from './components/modals/CafeCustomizationModal';

import { SearchProvider, useSearch } from './context/SearchContext';
import SplashScreen from './components/common/SplashScreen';

const LandingPage = () => {
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const { user } = useAuth(); // Retrieve user for redirection
  const { addToCart } = useCart();

  // Redirect Vendors & Admins away from Customer Landing Page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      const role = user.role?.toLowerCase();
      if (role === 'admin') navigate('/mustafa-admin-secret');
      else if (role === 'vendor' || role === 'seller') navigate('/vendor/dashboard');
    }
  }, [user, navigate]);

  // Modal state for Cafe in search
  const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // React Query for products and search
  const { 
    data: products = [], 
    isLoading, 
    isFetching,
    isError, 
    error,
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
    // Don't fetch if it's just a space or something
    enabled: true,
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleAddToCart = (product, quantity = 1) => {
    const storeId = product.store_id || product.storeId || 1;
    addToCart(product, storeId, quantity);
    navigate('/cart');
  };

  const handleOpenCafeModal = (product) => {
    setActiveProduct(product);
    setIsCafeModalOpen(true);
  };

  const handleConfirmCafeAdd = (customizedProduct) => {
    addToCart(customizedProduct, customizedProduct.store_id || customizedProduct.storeId || 1, 1);
    setIsCafeModalOpen(false);
    navigate('/cart');
  };

  return (
    <div className="landing-container animate-fade-up">
      <div className="hero-section" style={{ minHeight: 'auto', padding: 'clamp(40px, 10vw, 80px) 20px' }}>
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
          <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>
            {searchQuery ? 'نتائج البحث' : 'جميع المنتجات'}
          </h2>
          
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-panel animate-pulse" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ height: '200px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ height: '20px', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '70%', marginBottom: '12px' }} />
                    <div style={{ height: '16px', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '40%', marginBottom: '20px' }} />
                    <div style={{ height: '40px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px 0' }}>
              <p>حدث خطأ أثناء تحميل البيانات.</p>
              <button onClick={() => refetch()} className="btn btn-secondary" style={{ marginTop: '16px' }}>إعادة المحاولة</button>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '40px 0' }}>
              {searchQuery ? 'عذراً، لم نجد أكلات تطابق بحثك' : 'لا يوجد منتجات متاحة حالياً'}
            </div>
          ) : (
            <div className="product-grid" style={{ opacity: isFetching ? 0.7 : 1, transition: 'opacity 0.2s' }}>
              {products.map((product) => (
                <CategoryProductCard 
                  key={product.id || product._id}
                  product={product}
                  category={product.category || 'restaurant'} 
                  onAddToCart={handleAddToCart}
                  onOpenCafeModal={handleOpenCafeModal}
                />
              ))}
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
import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import AdminGuard from './components/guards/AdminGuard';
import VendorGuard from './components/guards/VendorGuard';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>جاري التحميل...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  const userRole = user.role?.toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
  
  // Dynamic Role Normalization (seller == vendor)
  const isAuthorized = normalizedAllowed.some(role => {
    if (role === 'vendor' || role === 'seller') {
      return userRole === 'vendor' || userRole === 'seller';
    }
    return userRole === role;
  });

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
