import React, { useState, useEffect, useCallback } from 'react';
import RepoCard from './RepoCard';
import RepoModal from './RepoModal';

const RepoList = ({ query, title }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRepos([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchRepos(1, query, true);
  }, [query]);

  const fetchRepos = async (pageNum, searchQuery, isNewSearch) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);

    try {
      
      const cacheKey = `${searchQuery}&page=${pageNum}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        const data = JSON.parse(cached);
        if (isNewSearch) {
          setRepos(data);
        } else {
          setRepos(prev => [...prev, ...data]);
        }
        setLoading(false);
        if (data.length === 0) setHasMore(false);
        return; // Exit early if cached
      }

      const response = await fetch(`http://localhost:5000/api/search?${searchQuery}&page=${pageNum}&per_page=30`);
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      const items = data.items || [];

      if (items.length === 0) setHasMore(false);

      sessionStorage.setItem(cacheKey, JSON.stringify(items));

      if (isNewSearch) {
        setRepos(items);
      } else {
        setRepos(prev => [...prev, ...items]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Is 'node server/index.js' running?");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepos(nextPage, query, false);
  };

  return (
    <section className="repo-section">
      {title && (
        <h2 style={{ marginBottom: '20px', marginTop: '30px', color: 'var(--text-primary)' }}>
          {title}
        </h2>
      )}

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="repo-list">
        {repos.map((repo, index) => (
          <div 
            key={`${repo.id}-${index}`} 
            onClick={() => setSelectedRepo(repo)} 
            style={{ cursor: 'pointer' }}
          >
            <RepoCard repo={repo} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-indicator">
          Scanning Sector {page}...
        </div>
      )}

      {!loading && hasMore && repos.length > 0 && (
        <div className="pagination-controls">
          <button onClick={handleLoadMore} className="load-more-btn">
            Load More Results ↓
          </button>
        </div>
      )}

      {!hasMore && repos.length > 0 && (
        <p className="end-message">-- End of Results --</p>
      )}

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </section>
  );
};

export default RepoList;