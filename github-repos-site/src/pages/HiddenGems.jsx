import React, { useState, useEffect, useCallback } from 'react';
import RepoCard from '../components/repo/RepoCard.jsx';
import { getHiddenGems } from '../services/apiClient';
import MainLayout from '../layouts/MainLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

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
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ alignItems: 'center', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">💎 Hidden Gems</h1>
          <p className="page-subtitle" style={{ maxWidth: '600px' }}>
            High-quality projects with low visibility. Filtered by recent activity and quality signals.
          </p>
          
          <div style={{ marginTop: 'var(--space-4)', width: '100%', maxWidth: '300px' }}>
            <select 
              className="rr-select" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
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

        {error && <div className="rr-error-state" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}

        <div className="grid-3" style={{ marginTop: 'var(--space-6)' }}>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="rr-card">
                <Skeleton style={{ height: '24px', width: '70%', marginBottom: 'var(--space-3)' }} />
                <Skeleton style={{ height: '16px', width: '100%', marginBottom: 'var(--space-2)' }} />
                <Skeleton style={{ height: '16px', width: '80%', marginBottom: 'var(--space-4)' }} />
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Skeleton style={{ height: '20px', width: '60px', borderRadius: 'var(--radius-full)' }} />
                  <Skeleton style={{ height: '20px', width: '60px', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))
          ) : repos.length > 0 ? (
            repos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState 
                icon="🕳️"
                title="No gems uncovered"
                message="We couldn't find any untouched repositories matching this filter."
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HiddenGems;
