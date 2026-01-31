import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RepoCard = ({ repo }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('goat_favorites') || '[]');
    const exists = saved.find(item => item.id === repo.id);
    if (exists) setIsFavorite(true);
  }, [repo.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('goat_favorites') || '[]');
    if (isFavorite) {
      const newSaved = saved.filter(item => item.id !== repo.id);
      localStorage.setItem('goat_favorites', JSON.stringify(newSaved));
      setIsFavorite(false);
    } else {
      saved.push(repo);
      localStorage.setItem('goat_favorites', JSON.stringify(saved));
      setIsFavorite(true);
    }
  };

  const handleTopicClick = (e, topic) => {
    e.stopPropagation();
    navigate(`/search?q=topic:${topic}&sort=stars`);
  };

  return (
    <div className="repo-card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-title" onClick={(e) => e.stopPropagation()}>
            {repo.full_name}
          </a>
          <button 
            onClick={toggleFavorite}
            className="favorite-btn"
            title={isFavorite ? "Remove from Stash" : "Add to Stash"}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div className="stars-badge" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
        ★ {repo.stargazers_count ? repo.stargazers_count.toLocaleString() : 0}
      </div>

      <p className="repo-desc">
        {repo.description || "No description provided."}
      </p>

      
      {repo.topics && repo.topics.length > 0 && (
        <div className="topic-group">
          {repo.topics.slice(0, 4).map(topic => (
            <span 
              key={topic} 
              className="topic-tag"
              onClick={(e) => handleTopicClick(e, topic)}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="card-meta">
        {repo.language && <span className="lang-tag">{repo.language}</span>}
        <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default RepoCard;