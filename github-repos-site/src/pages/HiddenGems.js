import React, { useState, useEffect, useCallback } from 'react';
import RepoCard from '../components/RepoCard';
import { getHiddenGems } from '../utils/apiClient';

const HiddenGems = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('');
  const [error, setError] = useState(null);

  const fetchGems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHiddenGems(language);
      setRepos(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to uncover gems.');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchGems();
  }, [fetchGems]);

  return (
    <div className="hidden-gems-page">
      <header className="page-header">
        <h1 className="page-title">💎 Untouched Gems</h1>
        <p className="page-subtitle">
          The core differentiator: High-quality projects with low visibility. 
          Filtered by recent activity and quality signals.
        </p>
        
        <div className="filter-group" style={{ justifyContent: 'center', marginTop: '2rem' }}>
          <select 
            className="search-select" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
          </select>
        </div>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="repo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="repo-card skeleton-card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            </div>
          ))
        ) : repos.length > 0 ? (
          repos.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))
        ) : (
          <p className="end-message">No untouched gems found for this filter. Try a different language!</p>
        )}
      </div>
    </div>
  );
};

export default HiddenGems;
