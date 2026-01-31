import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
        Trending
      </NavLink>
      
      <NavLink to="/gems" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        💎 Hidden Gems
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Search
      </NavLink>
      
      <NavLink to="/categories" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Categories
      </NavLink>

      <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        ❤️ Stash
      </NavLink>
    </nav>
  );
};

export default Navbar;