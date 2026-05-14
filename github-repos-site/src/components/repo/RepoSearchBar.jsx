import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RepoSearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('stars');
  const [minStars, setMinStars] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term) return;

    const encodedTerm = encodeURIComponent(term.trim());
    let query = `q=${encodedTerm}`;
    if (language) query += `+language:${encodeURIComponent(language)}`;
    if (minStars) query += `+stars:>${encodeURIComponent(minStars)}`;
    query += `&sort=${encodeURIComponent(sort)}&order=desc`;

    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-container" style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
      <div className="search-group" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="search-input"
          style={{ fontSize: '1.1rem', padding: '1rem 1.5rem' }}
          placeholder="What are you building today? (e.g. 'auth library', 'realtime graph')..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="filter-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>LANGUAGE</label>
          <select 
            className="search-select" 
            style={{ width: '100%' }}
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Any Language</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="c++">C++</option>
            <option value="zig">Zig</option>
            <option value="mojo">Mojo</option>
            <option value="swift">Swift</option>
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>MIN STARS</label>
          <input 
            type="number"
            className="search-input" 
            style={{ width: '100%', height: '42px' }}
            placeholder="0"
            value={minStars} 
            onChange={(e) => setMinStars(e.target.value)}
          />
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>SORT BY</label>
          <select 
            className="search-select" 
            style={{ width: '100%' }}
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="stars">Most Stars</option>
            <option value="updated">Recently Updated</option>
            <option value="forks">Most Forks</option>
            <option value="help-wanted-issues">Help Wanted</option>
          </select>
        </div>

        <button type="submit" className="search-btn" style={{ height: '42px', marginTop: 'auto', padding: '0 2rem' }}>
          Execute Query
        </button>
      </div>
    </form>
  );
};

RepoSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default RepoSearchBar;
