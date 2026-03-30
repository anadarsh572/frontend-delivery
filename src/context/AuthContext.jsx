import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('ecom_user');
    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.warn("Could not parse saved user:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData should include: id, name, email, role
    setUser(userData);
    localStorage.setItem('ecom_user', JSON.stringify(userData));
  };

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
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
