import React from 'react';
import Input from '../ui/Input.jsx';

const RepoSearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <Input 
        type="text" 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search AI tools, React templates, DevOps utilities..." 
        className="rr-search-input"
        style={{ padding: '14px 14px 14px 42px', fontSize: '1rem' }}
      />
    </div>
  );
};

export default RepoSearchBar;
