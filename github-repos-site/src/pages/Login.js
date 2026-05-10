/**
 * Login Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ fontSize: '2rem' }}>🐐 Welcome Back</h1>
          <p className="page-subtitle">Access your personal vault of gems</p>
        </header>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="search-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="search-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="search-btn" 
            style={{ width: '100%', height: '48px', marginTop: '1rem' }} 
            disabled={isLoading}
          >
            {isLoading ? 'Decrypting Vault...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          New around here? <Link to="/signup">Initialize Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
