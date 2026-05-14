/**
 * Signup Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.email || !formData.username || !formData.password) {
      setError('Email, username, and password are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.username, formData.password, formData.fullName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Join the Network" subtitle="Start tracking underrated repositories">
      {error && <div className="rr-error-state" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="content-stack">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="username" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
          <Input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="coder_goat"
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="fullName" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name (Optional)</label>
          <Input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="confirmPassword" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Confirm Password</label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          style={{ width: '100%', marginTop: 'var(--space-2)' }} 
          disabled={isLoading}
        >
          {isLoading ? 'Allocating Resources...' : 'Create Account'}
        </Button>
      </form>

      <div style={{ marginTop: 'var(--space-5)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Already a member? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Sign In</Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;
