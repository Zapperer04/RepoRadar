import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import { mockRepos } from '../data/mockRepos.js';

const SavedRepos = () => {
  const savedRepos = mockRepos.filter(repo => repo.isSaved);

  return (
    <DashboardLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">💾 Saved Repositories</h1>
          <p className="page-subtitle">Your personal stash of tracked open-source projects.</p>
        </header>
        
        <RepoGrid repos={savedRepos} />
      </div>
    </DashboardLayout>
  );
};

export default SavedRepos;
