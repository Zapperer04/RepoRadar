import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // <--- NEW IMPORT

const RepoModal = ({ repo, onClose }) => {
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  
  // AI State
  const [summary, setSummary] = useState(null);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    if (!repo) return;

    const fetchReadme = async () => {
      setLoading(true);
      setReadme('');
      setSummary(null);

      try {
        const [owner, name] = repo.full_name.split('/');
        // Connect to your backend
        const res = await fetch(`http://localhost:5000/api/readme/${owner}/${name}`);
        
        if (!res.ok) throw new Error('Failed to fetch readme');

        const data = await res.json();
        if (data.content) {
          const decodedContent = decodeURIComponent(escape(atob(data.content)));
          setReadme(decodedContent);
        } else {
          setReadme('*No README.md found.*');
        }
      } catch (error) {
        console.error(error);
        setReadme(`### ⚠️ Readme Unavailable\n\nView on [GitHub](${repo.html_url}).`);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [repo]);

  const handleExplain = async () => {
    if (!readme || readme.length < 50) return;
    
    setExplaining(true);
    try {
      const res = await fetch('http://localhost:5000/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: readme })
      });
      
      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      setSummary("Sorry, I couldn't summarize this repo right now.");
    } finally {
      setExplaining(false);
    }
  };

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
        
        {/* AI Toolbar */}
        <div className="ai-toolbar">
          {!summary && !explaining && (
            <button className="explain-btn" onClick={handleExplain}>
              ✨ Explain like I'm 5
            </button>
          )}
          
          {explaining && <div className="ai-loading">🤖 AI is reading the code...</div>}
          
          {summary && (
            <div className="ai-summary-box">
              <strong>🤖 AI Summary:</strong>
              <p>{summary}</p>
            </div>
          )}
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-spinner">Fetching documentation...</div>
          ) : (
            <div className="markdown-body">
              {/* 👇 THE FIX IS HERE: rehypePlugins={[rehypeRaw]} */}
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
              >
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