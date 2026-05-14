import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-shell">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
