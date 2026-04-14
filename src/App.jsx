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

import CustomerLanding from './pages/CustomerLanding';


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
          <Route path="/" element={<CustomerLanding />} />
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
