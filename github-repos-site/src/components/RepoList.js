import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import RepoCard from './RepoCard';
import RepoModal from './RepoModal';
import ComparisonAudit from './ComparisonAudit';
import { searchRepositories } from '../utils/apiClient';

const RepoSkeleton = ({ layout }) => {
  if (layout === 'compact') {
    return <div className="compact-row skeleton" style={{ height: '50px', marginBottom: '2px' }}></div>;
  }
  return (
    <div className={`repo-card skeleton-card ${layout === 'horizontal' ? 'horizontal-card' : ''}`}>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
    </div>
  );
};

const RepoList = ({ query, title, layout = 'grid', limit, sort = 'stars', order = 'desc' }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [error, setError] = useState(null);
  const [comparisonRepos, setComparisonRepos] = useState([]);
  const [showAudit, setShowAudit] = useState(false);

  const handleCompare = (repo) => {
    setComparisonRepos(prev => {
      if (prev.find(r => r.id === repo.id)) {
        return prev.filter(r => r.id !== repo.id);
      }
      if (prev.length >= 2) return [prev[1], repo];
      return [...prev, repo];
    });
  };

  const fetchRepos = useCallback(async (pageNum, searchQuery, isNewSearch) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);

    // If it's a new search, clear current results immediately to avoid cache-overlap
    if (isNewSearch) setRepos([]);

    try {
      // Use a more robust cache key that includes the query, page, and sort
      const cacheKey = `goat_audit_${searchQuery}_s${sort}_p${pageNum}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached && !isNewSearch) {
        const data = JSON.parse(cached);
        setRepos(prev => [...prev, ...data]);
        setLoading(false);
        if (data.length === 0) setHasMore(false);
        return;
      }

      const fetchCount = limit || (layout === 'grid' ? 30 : 10);
      const data = await searchRepositories(searchQuery, pageNum, fetchCount, sort, order);
      const items = data.items || [];

      if (items.length === 0) setHasMore(false);
      
      // Cache results for subsequent pages, but allow fresh fetches for new query strings
      sessionStorage.setItem(cacheKey, JSON.stringify(items));

      if (isNewSearch) setRepos(items);
      else setRepos(prev => [...prev, ...items]);
    } catch (err) {
      setError(err.message || 'Failed to fetch repositories');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [layout, limit, sort, order]);

  useEffect(() => {
    setRepos([]);
    setPage(1);
    setHasMore(true);
    fetchRepos(1, query, true);
  }, [query, sort, order, fetchRepos]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRepos(nextPage, query, false);
  };

  const displayedRepos = limit ? repos.slice(0, limit) : repos;

  const renderContent = () => {
    if (layout === 'ranked') {
      return (
        <div className="ranked-list">
          {displayedRepos.map((repo, idx) => (
            <div key={repo.id} className="ranked-card" onClick={() => setSelectedRepo(repo)}>
              <div className="rank-number">#{(idx + 1).toString().padStart(2, '0')}</div>
              <div style={{ flex: 1 }}>
                <RepoCard 
                  repo={repo} 
                  onCompare={handleCompare} 
                  isComparing={!!comparisonRepos.find(r => r.id === repo.id)} 
                />
              </div>
            </div>
          ))}
          {loading && <RepoSkeleton layout="grid" />}
        </div>
      );
    }

    if (layout === 'horizontal') {
      return (
        <div className="horizontal-scroll">
          {displayedRepos.map((repo) => (
            <div key={repo.id} onClick={() => setSelectedRepo(repo)} style={{ scrollSnapAlign: 'start' }}>
              <RepoCard 
                repo={repo} 
                onCompare={handleCompare} 
                isComparing={!!comparisonRepos.find(r => r.id === repo.id)} 
              />
            </div>
          ))}
          {loading && <RepoSkeleton layout="grid" />}
        </div>
      );
    }

    if (layout === 'compact') {
      return (
        <div className="compact-list">
          {displayedRepos.map((repo) => (
            <div key={repo.id} className="compact-row" onClick={() => setSelectedRepo(repo)} style={{ cursor: 'pointer' }}>
              <div style={{ fontWeight: '600', color: 'var(--accent-primary)', minWidth: '150px' }}>{repo.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1, margin: '0 1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {repo.description}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                ⭐ {repo.stargazers_count.toLocaleString()}
              </div>
            </div>
          ))}
          {loading && <RepoSkeleton layout="compact" />}
        </div>
      );
    }

    return (
      <div className="repo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {displayedRepos.map((repo) => (
          <div key={repo.id} onClick={() => setSelectedRepo(repo)} className="repo-card-wrapper" style={{ cursor: 'pointer' }}>
            <RepoCard 
              repo={repo} 
              onCompare={handleCompare} 
              isComparing={!!comparisonRepos.find(r => r.id === repo.id)} 
            />
          </div>
        ))}
        {loading && <><RepoSkeleton /><RepoSkeleton /><RepoSkeleton /></>}
      </div>
    );
  };

  return (
    <section className="repo-section">
      {title && <h2 className="repo-section-title">{title}</h2>}
      {error && <div className="error-banner">⚠️ {error}</div>}
      {renderContent()}
      {!loading && hasMore && repos.length > 0 && layout === 'grid' && (
        <div className="pagination-controls">
          <button onClick={handleLoadMore} className="load-more-btn">Load More Results ↓</button>
        </div>
      )}
      
      {selectedRepo && <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />}
      
      {comparisonRepos.length > 0 && (
        <div className="comparison-tray" style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          background: 'var(--bg-secondary)', 
          border: '2px solid var(--accent-primary)', 
          padding: '1rem 2rem', 
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 20px var(--accent-glow)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          zIndex: 2000
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>📊 COMPARE MODE</div>
          {comparisonRepos.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-primary)' }}>{r.name}</span>
              <button onClick={(e) => { e.stopPropagation(); handleCompare(r); }} style={{ background: 'none', border: 'none', color: '#ff7b72', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          {comparisonRepos.length === 2 && (
            <button className="search-btn" style={{ padding: '0.5rem 1rem' }} onClick={(e) => { e.stopPropagation(); setShowAudit(true); }}>
              Run Deep Audit →
            </button>
          )}
        </div>
      )}

      {showAudit && (
        <ComparisonAudit 
          repos={comparisonRepos} 
          onClose={() => setShowAudit(false)} 
        />
      )}
    </section>
  );
};

RepoList.propTypes = {
  query: PropTypes.string.isRequired,
  title: PropTypes.string,
  layout: PropTypes.oneOf(['grid', 'ranked', 'horizontal', 'compact']),
  limit: PropTypes.number
};

export default RepoList;