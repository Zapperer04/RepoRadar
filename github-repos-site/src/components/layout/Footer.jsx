import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>RepoRadar</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Discover underrated open-source repositories before they blow up.
          </p>
        </div>

        <div className="site-footer-links">
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>Explore</h4>
            <Link to="/explore">Explore</Link>
            <Link to="/hidden-gems">Hidden Gems</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/domains">Domains</Link>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>Workspace</h4>
            <Link to="/saved">Saved Repos</Link>
            <Link to="/collections">Collections</Link>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {currentYear} RepoRadar.</span>
        <span>Built as a developer discovery dashboard for open-source exploration.</span>
      </div>
    </footer>
  );
};


export default Footer;
