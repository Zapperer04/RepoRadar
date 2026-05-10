import React from 'react';
import { useNavigate } from 'react-router-dom';
import RepoList from './RepoList';

const Home = () => {
  const navigate = useNavigate();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const date7 = sevenDaysAgo.toISOString().split('T')[0];
  const viralQuery = `q=created:>${date7}&sort=stars&order=desc`;

  const stackQuery = `q=topic:framework+topic:library+pushed:>2024-12-01&sort=stars&order=desc`;
  const utilityQuery = `q=topic:cli+topic:productivity+stars:500..5000&sort=updated&order=desc`;

  return (
    <div className="home-page">
      <header className="hero-section" style={{ padding: '4rem 2rem', marginBottom: '2rem' }}>
        <div className="hero-content">
          <div className="feature-badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}>
            System Status: Online
          </div>
          <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.1' }}>
            Engineer's <span style={{ color: 'var(--accent-primary)' }}>Discovery Engine</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            The "Greatest Of All Time" tools found before the mainstream.
          </p>
          
          <div className="footer-links" style={{ marginTop: '2rem' }}>
            <button onClick={() => navigate('/search')} className="search-btn" style={{ padding: '0.8rem 2rem' }}>
              🔍 Start Deep Search
            </button>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </header>

      {/* Side-by-Side Row for High Density */}
      <div className="section-row">
        <div className="half-section">
          <header className="offering-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="offering-title" style={{ fontSize: '1.5rem' }}>🔥 The Hot List</h2>
            <a href="/search?q=sort:stars" className="nav-link" style={{ fontSize: '0.8rem' }}>All →</a>
          </header>
          <RepoList query={viralQuery} title="" layout="ranked" limit={5} />
        </div>

        <div className="half-section">
          <header className="offering-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="offering-title" style={{ fontSize: '1.5rem' }}>🛠️ Utility Tooling</h2>
            <a href="/search?q=topic:cli" className="nav-link" style={{ fontSize: '0.8rem' }}>All →</a>
          </header>
          <RepoList query={utilityQuery} title="" layout="compact" limit={8} />
        </div>
      </div>

      {/* Horizontal Carousel for Architecture (Low vertical space) */}
      <div className="offering-section-premium" style={{ marginBottom: '4rem' }}>
        <header className="offering-header">
          <h2 className="offering-title" style={{ fontSize: '1.5rem' }}>🏗️ Modern Stack Architecture</h2>
          <p className="offering-subtitle" style={{ fontSize: '0.85rem' }}>High-quality infrastructure components.</p>
        </header>
        <RepoList query={stackQuery} title="" layout="horizontal" limit={10} />
      </div>

      {/* Curations in a tighter grid */}
      <div className="offering-section">
        <header className="offering-header">
          <h2 className="offering-title" style={{ fontSize: '1.5rem' }}>🏆 Expert Curations</h2>
        </header>
        
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="category-card" onClick={() => navigate('/search?q=topic:ai+topic:agent')} style={{ padding: '1.5rem' }}>
            <div className="category-icon">🤖</div>
            <div className="category-name">AI Agents</div>
            <p className="category-desc" style={{ fontSize: '0.85rem' }}>Autonomous LLM workflows.</p>
          </div>
          <div className="category-card" onClick={() => navigate('/search?q=topic:rust+topic:wasm')} style={{ padding: '1.5rem' }}>
            <div className="category-icon">🦀</div>
            <div className="category-name">Edge (Rust)</div>
            <p className="category-desc" style={{ fontSize: '0.85rem' }}>High-performance WASM.</p>
          </div>
          <div className="category-card" onClick={() => navigate('/search?q=topic:minimalist+topic:clean-code')} style={{ padding: '1.5rem' }}>
            <div className="category-icon">🍃</div>
            <div className="category-name">Minimalist</div>
            <p className="category-desc" style={{ fontSize: '0.85rem' }}>Zero-dependency tools.</p>
          </div>
        </div>
      </div>
      
      <footer className="site-footer" style={{ marginTop: '4rem', padding: '3rem 0' }}>
        <div className="site-logo logo-wrap" style={{ fontSize: '1.5rem' }}>🐐 GOAT_FINDER</div>
        <div className="footer-links" style={{ gap: '2rem' }}>
          <a href="/stash" className="nav-link">Vault</a>
          <a href="/categories" className="nav-link">Tech</a>
          <a href="/search" className="nav-link">Search</a>
        </div>
        <p className="copyright" style={{ marginTop: '2rem' }}>© 2026 GOAT Repo Finder</p>
      </footer>
    </div>
  );
};

export default Home;