import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { fetchReadme, getAIExplanation } from '../utils/apiClient';

const RepoModal = ({ repo, onClose }) => {
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [explaining, setExplaining] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  useEffect(() => {
    if (!repo) return;
    const loadReadme = async () => {
      setLoading(true);
      setReadme('');
      setSummary(null);
      setExplanationError(null);
      try {
        const [owner, name] = repo.full_name.split('/');
        const data = await fetchReadme(owner, name);
        if (data.content) {
          const decodedContent = decodeURIComponent(escape(atob(data.content)));
          setReadme(decodedContent);
        } else {
          setReadme('*No README.md found.*');
        }
      } catch (error) {
        setReadme(`### ⚠️ Readme Unavailable\n\n[View on GitHub](${repo?.html_url || '#'}).`);
      } finally {
        setLoading(false);
      }
    };
    loadReadme();
  }, [repo]);

  const handleExplain = async () => {
    if (!readme || readme.length < 50) return;
    setExplaining(true);
    setExplanationError(null);
    try {
      const data = await getAIExplanation(readme);
      setSummary(data.summary);
    } catch (error) {
      setExplanationError(error.message || 'Could not generate explanation.');
    } finally {
      setExplaining(false);
    }
  };

  if (!repo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="feature-badge">Technical Deep Dive</div>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="modal-title" style={{ fontSize: '1.75rem' }}>
              {repo.full_name} ↗
            </a>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="ai-toolbar" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {!summary && !explaining && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Don't have time to read the whole documentation?
              </p>
              <button className="search-btn" onClick={handleExplain} style={{ background: 'var(--accent-primary)', color: 'white' }}>
                🤖 Run Architectural Review
              </button>
            </div>
          )}
          
          {explaining && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div className="loading-indicator">Senior Auditor is analyzing the tech stack...</div>
            </div>
          )}
          
          {summary && (
            <div className="ai-summary-box" style={{ border: 'none', padding: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🎯</span>
                <strong style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Senior Architect's Brief</strong>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-primary)', fontStyle: 'italic' }}>"{summary}"</p>
              <button 
                className="nav-link"
                style={{ marginTop: '1rem', padding: '0', fontSize: '0.8rem' }}
                onClick={() => setSummary(null)}
              >
                ↻ Refresh Analysis
              </button>
            </div>
          )}

          {explanationError && (
            <div className="ai-error-box">
              <strong>⚠️ Audit Failed:</strong> {explanationError}
              <button className="explain-btn" onClick={handleExplain}>Retry Audit</button>
            </div>
          )}
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-spinner">Decrypting repository artifacts...</div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {readme}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RepoModal.propTypes = {
  repo: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default RepoModal;