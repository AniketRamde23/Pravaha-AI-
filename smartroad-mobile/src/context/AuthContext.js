import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, saveAuthToken, getStoredToken, initApiConfig } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on startup
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initApiConfig();
        const storedToken = await getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          try {
            const userData = await authApi.getMe();
            setUser(userData);
          } catch (err) {
            console.warn('Stored token is invalid or expired:', err.message);
            await logout();
          }
        }
      } catch (e) {
        console.warn('Bootstrap auth failed:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    await saveAuthToken(data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const registerDriver = async (driverData) => {
    const data = await authApi.registerDriver(driverData);
    await saveAuthToken(data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const registerProvider = async (providerData) => {
    const data = await authApi.registerProvider(providerData);
    await saveAuthToken(data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await saveAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    token,
    role: user?.role,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    registerDriver,
    registerProvider,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
