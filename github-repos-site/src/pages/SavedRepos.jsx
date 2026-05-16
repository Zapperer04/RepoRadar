import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';


import RepoCard from '../components/repo/RepoCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useSavedRepos } from '../hooks/useSavedRepos.js';

const SavedRepos = () => {
  const { savedRepos, loading } = useSavedRepos();
  const [removingIds, setRemovingIds] = useState(new Set());

  const handleDeleteAnimation = (repo) => {
    return new Promise(resolve => {
      setRemovingIds(prev => new Set(prev).add(repo.fullName));
      setTimeout(resolve, 300); // Match animation duration
    });
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">💾 Saved Repositories</h1>
          <p className="page-subtitle">Your personal stash of tracked open-source projects.</p>
        </header>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <Loader />
          </div>
        ) : savedRepos.length > 0 ? (
          <div className="repo-grid">
            {savedRepos.map(repo => (
              <div 
                key={repo.id} 
                className={`repo-card-anim-wrap ${removingIds.has(repo.fullName) ? 'removing' : ''}`}
              >
                <RepoCard 
                  repo={repo} 
                  onDeleteAnimation={handleDeleteAnimation} 
                />
              </div>
            ))}

          </div>
        ) : (
          <EmptyState 
            title="No Saved Repositories" 
            message="You haven't saved any repositories yet. Explore trending projects to start your stash!"
          />
        )}
      </div>
    </DashboardLayout>
  );
};


export default SavedRepos;
