import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { fetchReadme, getAIExplanation } from '../utils/apiClient';

const RepoModal = ({ repo, onClose }) => {
  const [readme, setReadme] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  const decodeUniversal = (base64) => {
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
      return atob(base64);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingReadme(true);
      try {
        const data = await fetchReadme(repo.owner.login, repo.name);
        setReadme(decodeUniversal(data.content));
      } catch (err) {
        setReadme('Technical documentation unavailable for this repository.');
      } finally {
        setLoadingReadme(false);
      }
    };
    loadData();
    handleExplain();
  }, [repo]);

  const handleExplain = async () => {
    setLoadingAI(true);
    try {
      // Pass both description and full_name for better context
      const prompt = `Repo: ${repo.full_name}. Description: ${repo.description}`;
      const data = await getAIExplanation(prompt);
      // FIXED: Server returns 'summary', not 'explanation'
      setExplanation(data.summary || 'No summary generated.');
    } catch (err) {
      setExplanation('AI briefing service is temporarily offline. Please audit the README directly.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content deep-dive-modal">
        <header className="modal-header">
          <div className="header-main-info">
            <span className="feature-badge">Technical Deep Dive</span>
            <h2 className="modal-title">{repo.full_name}</h2>
          </div>
          
          <div className="header-actions">
            <div className="modal-stats">
              <span className="stat-item">⭐ {repo.stargazers_count.toLocaleString()}</span>
              <span className="stat-item">🍴 {repo.forks_count.toLocaleString()}</span>
              <span className="stat-item">🛠️ {repo.language || 'Multi'}</span>
            </div>
            <button className="close-btn-circle" onClick={onClose}>✕</button>
          </div>
        </header>

        <div className="modal-layout-container">
          <main className="modal-main-docs">
            {loadingReadme ? (
              <div className="modal-loading">Scanning technical documents...</div>
            ) : (
              <div className="markdown-body-container">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                >
                  {readme}
                </ReactMarkdown>
              </div>
            )}
          </main>

          <aside className="modal-ai-sidebar">
            <div className="sidebar-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="sidebar-label" style={{ margin: 0, border: 'none', padding: 0 }}>Architect's Brief</h3>
                <span className="ai-badge-mini">AI POWERED</span>
              </div>
              
              {loadingAI ? (
                <div className="ai-loading-pulse">
                  <span className="scanning-line"></span>
                  Analyzing Architecture...
                </div>
              ) : (
                <div className="ai-brief-content">
                  <p>{explanation}</p>
                </div>
              )}
            </div>

            <div className="sidebar-section controls-section">
              <h3 className="sidebar-label">Intelligence Controls</h3>
              <div className="sidebar-action-grid">
                <button className="search-btn sidebar-btn" onClick={handleExplain} disabled={loadingAI}>
                  {loadingAI ? 'PROCESSING...' : 'GENERATE AI BRIEF'}
                </button>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="search-btn secondary-btn sidebar-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  VIEW ON GITHUB
                </a>
              </div>
            </div>
            
            <div className="sidebar-footer">
              <p>Goat Discovery Engine v2.0</p>
              <p>Auditor: Senior Architect AI</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RepoModal;