import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, logoutUser, getMe } from '../api/auth.api.js';
import { setAccessToken } from '../api/axiosInstance.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await getMe();
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Session expired or not logged in — silently fail
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const register = useCallback(async (userData) => {
    const data = await registerUser(userData);
    if (data.success) {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    if (data.success) {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if API call fails, clear local state
    }
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
