import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { user as userApi } from '../utils/apiClient';
import RepoCard from './RepoCard';
import RepoModal from './RepoModal';

const Stash = () => {
  const { isAuthenticated } = useAuth();
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (isAuthenticated) {
        // Fetch from Database
        const data = await userApi.getFavorites();
        const dbRepos = data.favorites || [];
        
        // Sync with local storage (optional but good for consistency)
        localStorage.setItem('goat_favorites', JSON.stringify(dbRepos.map(f => ({
          id: f.repo_id,
          full_name: f.repo_name,
          html_url: f.repo_url,
          stargazers_count: f.repo_stars,
          language: f.repo_language,
          description: f.repo_description
        }))));
        
        setRepos(dbRepos);
      } else {
        // Fetch from Local Storage
        const saved = JSON.parse(localStorage.getItem('goat_favorites') || '[]');
        setRepos(saved);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your stash');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
    
    // Listen for local changes if guest
    if (!isAuthenticated) {
      window.addEventListener('storage', loadData);
      return () => window.removeEventListener('storage', loadData);
    }
  }, [loadData, isAuthenticated]);

  return (
    <div className="stash-page">
      <header className="page-header">
        <h1 className="page-title">{isAuthenticated ? '⭐ My Vault' : '❤️ My Stash'}</h1>
        <p className="page-subtitle">
          {repos.length === 0 
            ? "Your collection is currently empty." 
            : `You have ${repos.length} ${repos.length === 1 ? 'gem' : 'gems'} saved.`
          }
          {!isAuthenticated && repos.length > 0 && " (Sign in to sync these across devices)"}
        </p>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {isLoading ? (
        <div className="loading-indicator">Accessing the vault...</div>
      ) : repos.length === 0 ? (
        <div className="page-header">
          <div className="empty-state-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔦</div>
          <p>No repositories found here yet.</p>
          <p className="page-subtitle">Go explore the trending feed or search for something specific!</p>
        </div>
      ) : (
        <div className="repo-grid">
          {repos.map(repo => {
            // Standardize for RepoCard
            const repoData = {
              id: repo.id || repo.repo_id,
              full_name: repo.full_name || repo.repo_name,
              html_url: repo.html_url || repo.repo_url,
              stargazers_count: repo.stargazers_count || repo.repo_stars,
              language: repo.language || repo.repo_language,
              description: repo.description || repo.repo_description,
              owner: repo.owner || { login: repo.repo_owner }
            };
            
            return (
              <div 
                key={repoData.id} 
                className="repo-card-wrapper"
                onClick={() => setSelectedRepo(repoData)}
              >
                <RepoCard repo={repoData} />
              </div>
            );
          })}
        </div>
      )}

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
};

export default Stash;
