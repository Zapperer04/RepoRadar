/**
 * Auth Context
 * Global authentication state management
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../utils/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Verify token is still valid
   */
  const verifyToken = useCallback(async () => {
    try {
      const verifyRes = await auth.verify();
      
      if (verifyRes) {
        const userData = await auth.me();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Token verification error:', err);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user is logged in (on app load)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, [verifyToken]);

  /**
   * Signup
   */
  const signup = useCallback(async (email, username, password, fullName) => {
    setError(null);
    try {
      const data = await auth.signup({ email, username, password, fullName });
      
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await auth.login(email, password);

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  const getToken = useCallback(() => localStorage.getItem('authToken'), []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signup,
    login,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
