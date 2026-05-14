import React from 'react';
import PropTypes from 'prop-types';

const RepoCard = ({ repo, onCompare, isComparing }) => {
  if (!repo) return null;

  const readiness = {
    isTyped: repo.language === 'TypeScript' || (repo.topics && repo.topics.includes('typescript')),
    hasTests: repo.description?.toLowerCase().includes('test') || (repo.topics && repo.topics.some(t => t.includes('test'))),
    isActive: (new Date() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24) < 7,
    isPopular: repo.stargazers_count > 1000
  };

  const getSentiment = () => {
    if (readiness.isActive && repo.open_issues_count < 10) return { label: '🔥 High Momentum', color: '#22c55e' };
    if (readiness.isActive) return { label: '⚡ Active', color: 'var(--accent-primary)' };
    return { label: '💤 Stable/Dormant', color: 'var(--text-muted)' };
  };

  const sentiment = getSentiment();

  return (
    <div className={`repo-card ${isComparing ? 'comparing' : ''}`}>
      <div className="card-header">
        <div className="stars-badge">
          ⭐ {repo.stargazers_count?.toLocaleString() || 0}
        </div>
        <div style={{ color: sentiment.color, fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
          {sentiment.label}
        </div>
      </div>

      <div className="repo-title">
        {repo.name}
      </div>
      
      <p className="repo-desc">
        {repo.description || "No description provided for this repository."}
      </p>

      <div className="confidence-matrix" style={{ display: 'flex', gap: '1rem', margin: '1rem 0', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div title="TypeScript Support" style={{ opacity: readiness.isTyped ? 1 : 0.2, filter: readiness.isTyped ? 'none' : 'grayscale(1)' }}>📘 <span style={{ fontSize: '0.7rem' }}>TYPED</span></div>
        <div title="Test Evidence" style={{ opacity: readiness.hasTests ? 1 : 0.2, filter: readiness.hasTests ? 'none' : 'grayscale(1)' }}>✅ <span style={{ fontSize: '0.7rem' }}>TESTS</span></div>
        <div title="Recent Activity" style={{ opacity: readiness.isActive ? 1 : 0.2, filter: readiness.isActive ? 'none' : 'grayscale(1)' }}>📝 <span style={{ fontSize: '0.7rem' }}>DOCS</span></div>
        <div title="Security/Health" style={{ opacity: 0.8 }}>🛡️ <span style={{ fontSize: '0.7rem' }}>SAFE</span></div>
      </div>

      <div className="topic-group">
        {(repo.topics || []).slice(0, 2).map(topic => (
          <span key={topic} className="topic-tag">{topic}</span>
        ))}
      </div>

      <div className="card-meta">
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Updated {new Date(repo.pushed_at).toLocaleDateString()}
        </div>
        <button 
          className="search-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onCompare && onCompare(repo);
          }}
          style={{ 
            marginLeft: 'auto', 
            padding: '0.3rem 0.8rem', 
            fontSize: '0.75rem',
            background: isComparing ? 'var(--accent-primary)' : 'transparent',
            border: '1px solid var(--accent-primary)'
          }}
        >
          {isComparing ? '✓ Comparing' : '＋ Compare'}
        </button>
      </div>
    </div>
  );
};

RepoCard.propTypes = {
  repo: PropTypes.object.isRequired,
  onCompare: PropTypes.func,
  isComparing: PropTypes.bool
};

export default RepoCard;
