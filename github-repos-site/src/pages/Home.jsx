import React from 'react';
import { useNavigate } from 'react-router-dom';
import RepoList from '../components/repo/RepoList.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Card, { CardTitle, CardDescription } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';

const Home = () => {
  const navigate = useNavigate();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const date7 = sevenDaysAgo.toISOString().split('T')[0];
  const viralQuery = `q=created:>${date7}&sort=stars&order=desc`;

  const utilityQuery = `q=topic:cli+topic:productivity+stars:500..5000&sort=updated&order=desc`;
  const stackQuery = `q=topic:framework+topic:library+pushed:>2024-12-01&sort=stars&order=desc`;

  return (
    <MainLayout>
      <div className="page-container">
        
        {/* Hero Section */}
        <header className="page-header" style={{ alignItems: 'center', textAlign: 'center', padding: 'var(--space-8) 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-8)' }}>
          <Badge variant="accent" style={{ marginBottom: 'var(--space-4)' }}>System Status: Online</Badge>
          <h1 className="page-title" style={{ fontSize: '3.5rem', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 'var(--space-4)' }}>
            Engineer's Discovery Engine
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '600px', fontSize: '1.25rem' }}>
            RepoRadar surfaces high-quality open-source projects that fly under the radar. Find your next favorite library before it goes mainstream.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <Button size="lg" onClick={() => navigate('/explore')}>
              🔍 Start Deep Search
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/hidden-gems')}>
              💎 View Hidden Gems
            </Button>
          </div>
        </header>

        {/* Side-by-Side Row */}
        <div className="split-layout section">
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">🔥 The Hot List</h2>
                <p className="section-subtitle">Trending repositories created this week</p>
              </div>
            </div>
            <RepoList query={viralQuery} title="" layout="ranked" limit={5} />
          </div>

          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">🛠️ Utility Tooling</h2>
                <p className="section-subtitle">CLI and productivity tools (500 - 5k stars)</p>
              </div>
            </div>
            <RepoList query={utilityQuery} title="" layout="compact" limit={8} />
          </div>
        </div>

        {/* Stack Architecture Section */}
        <div className="section" style={{ marginTop: 'var(--space-8)' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">🏗️ Modern Stack Architecture</h2>
              <p className="section-subtitle">High-quality infrastructure components.</p>
            </div>
          </div>
          <RepoList query={stackQuery} title="" layout="horizontal" limit={10} />
        </div>

        {/* Curations */}
        <div className="section" style={{ marginTop: 'var(--space-8)' }}>
          <div className="section-header">
            <h2 className="section-title">🏆 Expert Curations</h2>
          </div>
          <div className="grid-3">
            <Card style={{ cursor: 'pointer' }} onClick={() => navigate('/explore?q=topic:ai+topic:agent')}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🤖</div>
              <CardTitle>AI Agents</CardTitle>
              <CardDescription style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>Autonomous LLM workflows.</CardDescription>
            </Card>
            
            <Card style={{ cursor: 'pointer' }} onClick={() => navigate('/explore?q=topic:rust+topic:wasm')}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🦀</div>
              <CardTitle>Edge (Rust)</CardTitle>
              <CardDescription style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>High-performance WASM.</CardDescription>
            </Card>
            
            <Card style={{ cursor: 'pointer' }} onClick={() => navigate('/explore?q=topic:minimalist+topic:clean-code')}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🍃</div>
              <CardTitle>Minimalist</CardTitle>
              <CardDescription style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>Zero-dependency tools.</CardDescription>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <footer style={{ marginTop: 'var(--space-9)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>🐐 RepoRadar</div>
          <div style={{ color: 'var(--text-muted)' }}>© 2026 RepoRadar</div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default Home;
