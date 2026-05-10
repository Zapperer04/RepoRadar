import React from 'react';
import Navbar from './Navbar';

const Header = () => {
  return (
    <header className="site-header">
      <div className="brand-group">
        <h1 className="site-logo">
          <span role="img" aria-label="goat">🐐</span> 
          GOAT_FINDER
        </h1>
        <span className="site-tagline">Index of Underrated Repositories</span>
      </div>
      
      <Navbar />
    </header>
  );
};

export default Header;