import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const Trending = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">📈 Trending Repositories</h1>
          <p className="page-subtitle">
            Track fastest-growing repositories across the GitHub ecosystem by velocity and momentum.
          </p>
        </header>

        <EmptyState
          icon="🚀"
          title="Trending Intelligence"
          message="Velocity calculation engine is currently indexing repository star growth. Check back soon."
        />
      </div>
    </MainLayout>
  );
};

export default Trending;
