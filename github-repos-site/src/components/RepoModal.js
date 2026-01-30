import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RepoModal = ({ repo, onClose }) => {
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repo) return;

    const fetchReadme = async () => {
      setLoading(true);
      setReadme(''); // Clear previous content

      try {
        // 1. Parse the owner and repo name from the full string
        // Example: "facebook/react" -> owner="facebook", name="react"
        const [owner, name] = repo.full_name.split('/');

        // 2. Hit your Local Server
        const res = await fetch(`http://localhost:5000/api/readme/${owner}/${name}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch readme');
        }

        const data = await res.json();
        
        // 3. Decode the content (GitHub API sends Base64)
        if (data.content) {
          // 'atob' decodes Base64 to string
          // We use a safe decode for UTF-8 characters
          const decodedContent = decodeURIComponent(escape(atob(data.content)));
          setReadme(decodedContent);
        } else {
          setReadme('*No README.md found for this repository.*');
        }
      } catch (error) {
        console.error(error);
        setReadme(`### ⚠️ Readme Unavailable\n\nCould not load documentation. You can view it directly on [GitHub](${repo.html_url}).`);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [repo]);

  if (!repo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="modal-title">
              {repo.full_name} ↗
            </a>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {repo.language} • {repo.stargazers_count.toLocaleString()} stars
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading-spinner">Fetching documentation...</div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {readme}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoModal;