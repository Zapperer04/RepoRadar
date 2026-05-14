/**
 * User Favorites Page
 * View and manage saved favorite repositories
 */

import React, { useState, useEffect, useCallback } from 'react';
import { user as userApi } from '../services/apiClient';
import RepoCard from '../components/repo/RepoCard.jsx';
import RepoModal from '../components/repo/RepoModal.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';

const SavedRepos = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getFavorites();
      setFavorites(data.favorites || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">⭐ My Stash</h1>
          <p className="page-subtitle">
            You have {favorites.length} {favorites.length === 1 ? 'gem' : 'gems'} saved in your vault.
          </p>
        </header>

        {error && <div className="rr-error-state" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <Loader />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState 
            icon="📭"
            title="Your vault is currently empty"
            message="Start exploring repositories to build your collection!"
          />
        ) : (
          <div className="grid-3">
            {favorites.map(fav => (
              <div 
                key={fav.id} 
                style={{ cursor: 'pointer', height: '100%' }}
                onClick={() => setSelectedRepo({
                  id: fav.repo_id,
                  full_name: fav.repo_name,
                  html_url: fav.repo_url,
                  owner: { login: fav.repo_owner },
                  description: fav.repo_description,
                  stargazers_count: fav.repo_stars,
                  language: fav.repo_language,
                })}
              >
                <RepoCard
                  repo={{
                    id: fav.repo_id,
                    full_name: fav.repo_name,
                    html_url: fav.repo_url,
                    repo_owner: fav.repo_owner,
                    description: fav.repo_description,
                    stargazers_count: fav.repo_stars,
                    language: fav.repo_language,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {selectedRepo && (
          <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
        )}
      </div>
    </MainLayout>
  );
};

export default SavedRepos;
