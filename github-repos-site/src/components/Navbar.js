import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
          🔥 Trending
        </NavLink>
        
        <NavLink to="/gems" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          💎 Untouched
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          🌐 Explorer
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          ⚡ Command Center
        </NavLink>
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <NavLink to="/stash" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              ⭐ Vault
            </NavLink>

            <NavLink to="/collections" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              📁 Collections
            </NavLink>

            <div className="nav-dropdown">
              <button className="nav-user-btn">
                👤 {user?.username || 'Account'}
              </button>
              <div className="dropdown-menu">
                <NavLink to="/profile" className="dropdown-item">
                  👤 Profile
                </NavLink>
                <button onClick={handleLogout} className="dropdown-item logout">
                  🚪 Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              🔑 Login
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? "nav-link active nav-link-primary" : "nav-link nav-link-primary"}>
              ✨ Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {};

export default Navbar;