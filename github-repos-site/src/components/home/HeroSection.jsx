import React from 'react';
import Navbar from '../layout/Navbar.jsx';

const HeroSection = () => {
  return (
    <header className="site-header">
      <div className="brand-group">
        <h1 className="site-logo">
          <span role="img" aria-label="radar">🛰️</span> 
          RepoRadar
        </h1>
        <span className="site-tagline">Index of Underrated Repositories</span>
      </div>
      
      <Navbar />
    </header>
  );
};

export default HeroSection;
