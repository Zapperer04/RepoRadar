import React from 'react';
import RepoCard from './RepoCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

const RepoGrid = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return (
      <EmptyState 
        icon="🔍" 
        title="No repositories found" 
        message="Try adjusting your search or filters to find what you're looking for." 
      />
    );
  }

  return (
    <div className="grid-3">
      {repos.map(repo => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

export default RepoGrid;
