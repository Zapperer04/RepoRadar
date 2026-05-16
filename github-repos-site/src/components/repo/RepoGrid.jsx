import React from 'react';
import RepoCard from './RepoCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

const RepoGrid = ({ repos, onRemoveFromCollection }) => {
  if (!repos || repos.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8) 0' }}>
        <EmptyState 
          icon="🔍" 
          title="No repositories found" 
          message="Try adjusting your search or filters to find what you're looking for." 
        />
      </div>
    );
  }

  return (
    <div className="grid-3">
      {repos.map(repo => (
        <RepoCard 
          key={repo.id} 
          repo={repo} 
          onRemoveFromCollection={onRemoveFromCollection}
        />
      ))}
    </div>
  );
};


export default RepoGrid;
