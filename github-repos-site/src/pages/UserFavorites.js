/**
 * User Favorites Page
 * View and manage saved favorite repositories
 */

import React, { useState, useEffect, useCallback } from 'react';
import { user as userApi } from '../utils/apiClient';
import RepoCard from '../components/RepoCard';
import RepoModal from '../components/RepoModal';

const UserFavorites = () => {
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
    <div className="favorites-page">
      <header className="page-header">
        <h1 className="page-title">⭐ My Stash</h1>
        <p className="page-subtitle">
          You have {favorites.length} {favorites.length === 1 ? 'gem' : 'gems'} saved in your vault.
        </p>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {isLoading ? (
        <div className="loading-indicator">Retrieving your collection...</div>
      ) : favorites.length === 0 ? (
        <div className="page-header">
          <p>Your vault is currently empty.</p>
          <p className="page-subtitle">Start exploring repositories to build your collection!</p>
        </div>
      ) : (
        <div className="repo-grid">
          {favorites.map(fav => (
            <div 
              key={fav.id} 
              className="repo-card-wrapper"
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
  );
};

export default UserFavorites;
