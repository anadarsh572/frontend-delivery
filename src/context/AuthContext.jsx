import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on initialization
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('ecom_user');

      if (!token) {
        setLoading(false);
        return;
      }

      // Try to use saved user first for instant UI response
      if (savedUser && savedUser !== 'null') {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing saved user", e);
        }
      }

      try {
        // Always verify with backend /api/auth/me
        const response = await apiClient.get('/api/auth/me');
        if (response.status === 200) {
          const userData = response.data.user || response.data;
          
          // Force lowercasing/normalization for unified roles
          if (userData.role) {
            userData.role = userData.role.toLowerCase();
          }

          setUser(userData);
          localStorage.setItem('ecom_user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err.response?.data || err.message);
        // If 401 or 403, apiClient interceptor will handle it, 
        // but for other errors we might want to clear local state if unauthorized
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = (userData) => {
    // Force lowercase role for consistency
    if (userData.role) {
        userData.role = userData.role.toLowerCase();
    }
    setUser(userData);
    localStorage.setItem('ecom_user', JSON.stringify(userData));
  };

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    if (updatedUser.role) {
        updatedUser.role = updatedUser.role.toLowerCase();
    }
    setUser(updatedUser);
    localStorage.setItem('ecom_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecom_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
