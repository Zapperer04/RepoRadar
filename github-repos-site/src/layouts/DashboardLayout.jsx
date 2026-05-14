import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';

const DashboardLayout = ({ children, sidebar }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard-layout">
        {sidebar && (
          <aside className="dashboard-sidebar">
            {sidebar}
          </aside>
        )}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
