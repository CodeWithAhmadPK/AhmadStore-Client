import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ahmad_store_admin_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify admin session on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('ahmad_store_admin_token');
      if (storedToken) {
        try {
          const data = await authService.getProfile();
          if (data && data.admin) {
            setAdmin(data.admin);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (error) {
          // Token is expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.token && data.admin) {
      localStorage.setItem('ahmad_store_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
      return data.admin;
    }
    throw new Error('Invalid authentication response');
  };

  const logout = () => {
    localStorage.removeItem('ahmad_store_admin_token');
    setToken(null);
    setAdmin(null);
  };

  const updateProfile = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    if (data && data.admin) {
      setAdmin(data.admin);
    }
    return data;
  };

  const value = {
    admin,
    token,
    isAuthenticated: Boolean(token && admin),
    loading,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
