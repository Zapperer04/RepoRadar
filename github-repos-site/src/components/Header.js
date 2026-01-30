import React from 'react';
import Navbar from './Navbar';

const Header = () => {
  return (
    <header className="site-header">
      <div className="brand-group">
        <h1>
          <span role="img" aria-label="goat">🐐</span> 
          GOAT_FINDER
        </h1>
        <p>Index of Underrated Repositories</p>
      </div>
      
      {/* Navbar moves INSIDE the header for a compact "App" feel */}
      <Navbar />
    </header>
  );
};

export default Header;