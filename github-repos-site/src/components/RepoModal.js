import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { fetchReadme, getAIExplanation } from '../utils/apiClient';

const RepoModal = ({ repo, onClose }) => {
  const [readme, setReadme] = useState('');
  const [explanation, setExplanation] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);
  const [loadingReadme, setLoadingReadme] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const lastRepoRef = useRef(null);
  const watchdogRef = useRef(null);
  const isLoadingRef = useRef(true); // Precision tracker for watchdog

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

  const handleExplain = useCallback(async (contentToUse) => {
    if (!contentToUse) return;

    setLoadingAI(true);
    try {
      const prompt = `Repo: ${repo.full_name}\n\nCONTENT:\n${contentToUse.substring(0, 10000)}`;
      const data = await getAIExplanation(prompt);
      setExplanation(data.summary || 'No summary generated.');
    } catch (err) {
      setExplanation('AI briefing service is temporarily offline.');
    } finally {
      setLoadingAI(false);
    }
  }, [repo.full_name]);

  useEffect(() => {
    if (lastRepoRef.current === repo.full_name) return;
    lastRepoRef.current = repo.full_name;

    let isMounted = true;
    if (watchdogRef.current) clearTimeout(watchdogRef.current);

    const loadData = async () => {
      console.log(`[AUDIT] Initiating discovery for: ${repo.full_name}`);
      setLoadingReadme(true);
      isLoadingRef.current = true;
      setReadme('');
      setExplanation('');
      setErrorDetails(null);

      // --- PRECISION WATCHDOG ---
      watchdogRef.current = setTimeout(() => {
        if (isMounted && isLoadingRef.current) {
          console.error('[AUDIT] Connection Watchdog Triggered - No response from Port 5000');
          setErrorDetails('Backend Unresponsive: The discovery engine could not connect to the local API server. Ensure the backend is running on Port 5000.');
          setLoadingReadme(false);
          isLoadingRef.current = false;
        }
      }, 10000); // 10s hard-cap

      try {
        const data = await fetchReadme(repo.owner.login, repo.name);
        if (!isMounted) return;
        
        clearTimeout(watchdogRef.current);
        isLoadingRef.current = false;
        
        const decodedContent = data.encoding === 'base64' 
          ? decodeUniversal(data.content) 
          : data.content;
          
        setReadme(decodedContent);
        handleExplain(decodedContent);
      } catch (err) {
        if (!isMounted) return;
        clearTimeout(watchdogRef.current);
        isLoadingRef.current = false;
        
        const msg = err.response?.data?.error || err.message || 'Unknown network error';
        console.error('[AUDIT] Data bridge collapse:', msg);
        setErrorDetails(msg);
      } finally {
        if (isMounted) {
          setLoadingReadme(false);
          isLoadingRef.current = false;
        }
      }
    };

    loadData();
    
    return () => { 
      isMounted = false; 
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, [repo, handleExplain]);

  return (
    <div className="modal-overlay">
      <div className={`modal-content deep-dive-modal ${isSidebarCollapsed ? 'sidebar-hidden' : ''}`}>
        <button className="modal-close-trigger absolute-exit" onClick={onClose} title="Close Audit">✕</button>

        <header className="modal-header">
          <div className="header-main-info">
            <span className="feature-badge">Technical Deep Dive</span>
            <h2 className="modal-title">{repo.full_name}</h2>
            <div className="header-meta-row">
              <span className="stat-badge">⭐ {repo.stargazers_count.toLocaleString()}</span>
              <span className="stat-badge">🛠️ {repo.language || 'Multi'}</span>
              <button className="focus-pill" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                {isSidebarCollapsed ? '📂 SHOW AUDIT' : '📖 FOCUS MODE'}
              </button>
            </div>
          </div>
        </header>

        <div className="modal-layout-container">
          <main className="modal-main-docs">
            {loadingReadme ? (
              <div className="modal-loading-container">
                <div className="technical-loader"></div>
                <p>CONNECTING TO GITHUB INFRASTRUCTURE...</p>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '1rem' }}>Verifying local API bridge (Port 5000)...</span>
              </div>
            ) : errorDetails ? (
              <div className="modal-loading-container" style={{ color: '#ff7b72' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>CONNECTION FAILURE</p>
                <p style={{ letterSpacing: '0.1em', textAlign: 'center', maxWidth: '500px', lineHeight: '1.6', fontSize: '0.9rem' }}>{errorDetails.toUpperCase()}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                  <button className="search-btn" onClick={() => window.location.reload()}>RETRY AUDIT</button>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="search-btn secondary-btn" style={{ textDecoration: 'none' }}>MANUAL SOURCE</a>
                </div>
              </div>
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

          {!isSidebarCollapsed && (
            <aside className="modal-ai-sidebar">
              <div className="intel-card">
                <div className="intel-card-header">
                  <h3 className="sidebar-label">Architect's Brief</h3>
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

              <div className="intel-card controls-card">
                <h3 className="sidebar-label">Repository Source</h3>
                <div className="sidebar-action-grid">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="search-btn sidebar-btn-hardened" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    OPEN ON GITHUB
                  </a>
                </div>
              </div>

              <div className="intel-card">
                <h3 className="sidebar-label">Health Signals</h3>
                <div className="health-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-val">HIGH</span>
                    <span className="metric-lab">Velocity</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-val">{repo.open_issues_count}</span>
                    <span className="metric-lab">Open Issues</span>
                  </div>
                </div>
              </div>
              
              <div className="sidebar-footer">
                <div className="confidence-meter">
                  <div className="confidence-fill" style={{ width: '92%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem' }}>
                  <span>Confidence: High Precision</span>
                  <span>v2.1.2</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoModal;