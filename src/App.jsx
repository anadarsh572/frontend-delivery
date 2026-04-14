import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { SupermarketProvider } from './context/SupermarketContext';
import './App.css';

// The Single Unified ERP Dashbaord
import UnifiedAdminDashboard from './pages/admin/AdminSupermarket';

function App() {
  return (
    <SearchProvider>
      <AuthProvider>
        <SupermarketProvider>
          <Router>
            <Routes>
              {/* Pure ERP Layout - Directly mapped to Root */}
              <Route path="/" element={<UnifiedAdminDashboard />} />
              
              {/* Fallback for old routes to redirect to ERP */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SupermarketProvider>
      </AuthProvider>
    </SearchProvider>
  );
}

export default App;
