import React from 'react';

const RepoCard = ({ repo }) => {
  return (
    <div className="repo-card">
      <div className="card-header">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-title">
          {repo.full_name} {/* "user/repo" is more technical than just "repo" */}
        </a>
        <div className="stars-badge">
          ★ {repo.stargazers_count.toLocaleString()}
        </div>
      </div>

      <p className="repo-desc">
        {repo.description || "No description provided."}
      </p>

      <div className="card-meta">
        {repo.language && <span className="lang-tag">{repo.language}</span>}
        <span>Updated: {new Date(repo.updated_at).toISOString().split('T')[0]}</span>
      </div>
    </div>
  );
};

export default RepoCard;