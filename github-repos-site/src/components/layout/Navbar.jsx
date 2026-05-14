import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-6)',
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-secondary)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span role="img" aria-label="radar">🛰️</span> 
          RepoRadar
        </Link>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <NavLink to="/" className={({ isActive }) => isActive ? "rr-btn rr-btn-ghost" : "rr-btn rr-btn-ghost"} end style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
            Home
          </NavLink>
          <NavLink to="/explore" className="rr-btn rr-btn-ghost" style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
            Explore
          </NavLink>
          <NavLink to="/hidden-gems" className="rr-btn rr-btn-ghost" style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
            Hidden Gems
          </NavLink>
          <NavLink to="/trending" className="rr-btn rr-btn-ghost" style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
            Trending
          </NavLink>
          <NavLink to="/domains" className="rr-btn rr-btn-ghost" style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
            Domains
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/collections" className="rr-btn rr-btn-ghost" style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
                Collections
              </NavLink>
              <NavLink to="/saved" className="rr-btn rr-btn-ghost" style={({ isActive }) => ({ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' })}>
                Saved
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="rr-btn rr-btn-secondary">
              👤 {user?.username || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="rr-btn rr-btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="rr-btn rr-btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="rr-btn rr-btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
