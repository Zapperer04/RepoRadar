import React from 'react';
import Input from '../ui/Input.jsx';
import { DOMAINS } from '../../constants/domains.js';
import { LANGUAGES, ACTIVITY_LEVELS, REPO_TYPES, STAR_RANGES } from '../../constants/filters.js';

const RepoFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Domain</label>
        <select name="domain" value={filters.domain || ''} onChange={handleChange} className="rr-select">
          <option value="">All Domains</option>
          {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Language</label>
        <select name="language" value={filters.language || ''} onChange={handleChange} className="rr-select">
          <option value="">All Languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Star Range</label>
        <select name="stars" value={filters.stars || ''} onChange={handleChange} className="rr-select">
          {STAR_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Activity Level</label>
        <select name="activityLevel" value={filters.activityLevel || ''} onChange={handleChange} className="rr-select">
          <option value="">All Levels</option>
          {ACTIVITY_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Repo Type</label>
        <select name="repoType" value={filters.repoType || ''} onChange={handleChange} className="rr-select">
          <option value="">All Types</option>
          {REPO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginTop: 'var(--space-2)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            name="isHiddenGem" 
            checked={filters.isHiddenGem || false} 
            onChange={handleChange} 
          />
          Hidden Gems Only
        </label>
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            name="isBeginnerFriendly" 
            checked={filters.isBeginnerFriendly || false} 
            onChange={handleChange} 
          />
          Beginner Friendly Only
        </label>
      </div>
    </div>
  );
};

export default RepoFilters;
