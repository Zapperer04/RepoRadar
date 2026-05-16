import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="page-shell" style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};


export default MainLayout;
