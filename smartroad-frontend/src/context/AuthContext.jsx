import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartroad_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state by verifying token with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smartroad_token');
      if (storedToken) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('smartroad_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const registerDriver = async (driverData) => {
    const data = await authApi.registerDriver(driverData);
    localStorage.setItem('smartroad_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const registerProvider = async (providerData) => {
    const data = await authApi.registerProvider(providerData);
    localStorage.setItem('smartroad_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartroad_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    role: user?.role,
    loading,
    login,
    registerDriver,
    registerProvider,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
