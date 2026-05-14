import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Card from '../components/ui/Card.jsx';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-shell" style={{ alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6) var(--space-4)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
            <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          <Card>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
