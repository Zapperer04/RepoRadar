import React from 'react';
import { SORT_OPTIONS } from '../../constants/filters.js';

const RepoSortBar = ({ sort, onSortChange, resultCount }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 'var(--space-4) 0',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 'var(--space-6)'
    }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{resultCount}</span> repositories
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sort by:</label>
        <select 
          value={sort} 
          onChange={(e) => onSortChange(e.target.value)} 
          className="rr-select"
          style={{ width: 'auto', padding: '6px 12px' }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RepoSortBar;
