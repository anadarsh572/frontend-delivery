import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Navigation, ShieldCheck, Plus, ShoppingCart, LogIn, Search, X } from 'lucide-react';
import './App.css';

// Placeholder Components
import { useCart } from './context/CartContext';
import CustomerLayout from './components/layouts/CustomerLayout';
import Cart from './pages/customer/Cart';
import CategoryPage from './pages/customer/CategoryPage';
import { Utensils, Coffee, ShoppingBasket } from 'lucide-react';
import CategoryProductCard from './components/products/CategoryProductCard';
import CafeCustomizationModal from './components/modals/CafeCustomizationModal';

import { API_URL } from './api/config';
import { SearchProvider, useSearch } from './context/SearchContext';
import SplashScreen from './components/common/SplashScreen';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch();
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Modal state for Cafe in search
  const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        const productsArray = Array.isArray(data) ? data : data.products || [];
        // Show only available products
        setProducts(productsArray.filter(p => p.isAvailable !== false));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setHasSearched(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      fetchAllProducts();
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(`${API_URL}/api/products/search?q=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray.filter(p => p.isAvailable !== false));
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchAllProducts();
  };

  const handleAddToCart = (product, quantity = 1) => {
    // Add product to CartContext safely (works for guests)
    addToCart(product, product.store_id || product.storeId || 1, quantity);
    // Send user directly to cart to review or checkout
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
          في السريع منه مع اضافه علم السرعه 🏁
        </p>
        
        {!localStorage.getItem('token') && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-secondary" style={{ minWidth: '140px' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ minWidth: '140px' }}>
              Create an Account
            </Link>
          </div>
        )}
      </div>

      <div className="container" style={{ padding: '0 20px 80px' }}>
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>
            {isSearching ? 'نتائج البحث' : 'جميع المنتجات'}
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
              Loading delicious items...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '40px 0' }}>
              {isSearching ? 'عذراً، لم نجد أكلات تطابق بحثك' : 'لا يوجد منتجات متاحة حالياً'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
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

          {isSearching && (
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
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase() || 'customer')) {
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
        
        <Route element={<PrivateRoute allowedRoles={['customer', 'admin']} />}>
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
