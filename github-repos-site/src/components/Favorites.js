import React, { useState, useEffect } from 'react';
import RepoCard from './RepoCard';
import RepoModal from './RepoModal';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const loadFavorites = () => {
      const saved = JSON.parse(localStorage.getItem('goat_favorites') || '[]');
      setFavorites(saved);
    };

    loadFavorites();

    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  return (
    <div className="page-container">
      <div className="search-header">
        <h2>Your Stash</h2>
        <p>The collection of hidden gems you've discovered.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h3>Your stash is empty.</h3>
          <p>Go to Search or Hidden Gems and click the 🤍 to save items here.</p>
        </div>
      ) : (
        <div className="repo-list">
          {favorites.map(repo => (
            <div 
              key={repo.id} 
              onClick={() => setSelectedRepo(repo)} 
              style={{ cursor: 'pointer' }}
            >
              <RepoCard repo={repo} />
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

export default Favorites;