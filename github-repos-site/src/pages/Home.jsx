import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import { mockRepos } from '../data/mockRepos.js';

const Home = () => {
  const featuredGems = mockRepos.filter(r => r.isHiddenGem).slice(0, 3);

  return (
    <MainLayout>
      <div className="page-container">
        {/* 1. Hero */}
        <section style={{ textAlign: 'center', padding: 'var(--space-8) 0', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 'var(--space-4)', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Discover underrated open-source repositories before they blow up.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto var(--space-6)' }}>
            RepoRadar ranks repositories by growth, quality, activity, and domain relevance — not just stars.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <Link to="/hidden-gems">
              <Button variant="primary" size="lg">Explore Hidden Gems</Button>
            </Link>
            <Link to="/explore">
              <Button variant="secondary" size="lg">Search Repositories</Button>
            </Link>
          </div>
        </section>

        {/* 2. Signal Metrics Row */}
        <section className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>12+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hidden Gems Indexed</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>10</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domains Tracked</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>85%</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Growth Signal</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>6</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Beginner-Friendly Picks</div>
          </Card>
        </section>

        {/* 3. USP Cards */}
        <section className="section">
          <header className="section-header">
            <h2 className="section-title">Why RepoRadar?</h2>
          </header>
          <div className="grid-4">
            <Card>
              <CardHeader><CardTitle>💎 Hidden Gem Discovery</CardTitle></CardHeader>
              <CardDescription>Find high-quality repositories under 1,000 stars that are poised for explosive growth.</CardDescription>
            </Card>
            <Card>
              <CardHeader><CardTitle>📈 Growth Signals</CardTitle></CardHeader>
              <CardDescription>Our velocity engine tracks momentum, active forks, and issue resolution rates.</CardDescription>
            </Card>
            <Card>
              <CardHeader><CardTitle>🎯 Domain Intelligence</CardTitle></CardHeader>
              <CardDescription>Categorized cleanly into robust technological domains so you find exactly what you need.</CardDescription>
            </Card>
            <Card>
              <CardHeader><CardTitle>🤝 Contribution Friendly</CardTitle></CardHeader>
              <CardDescription>Easily identify projects that welcome beginners and have excellent documentation.</CardDescription>
            </Card>
          </div>
        </section>

        {/* 4. Featured Hidden Gems */}
        <section className="section">
          <header className="section-header">
            <div>
              <h2 className="section-title">Featured Hidden Gems</h2>
              <p className="section-subtitle">Top curated picks of the day</p>
            </div>
            <Link to="/hidden-gems"><Button variant="ghost">View All →</Button></Link>
          </header>
          <RepoGrid repos={featuredGems} />
        </section>

        {/* 5. Ranking Explainer */}
        <section className="section" style={{ backgroundColor: 'var(--bg-soft)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
            <h2 className="section-title">How we rank</h2>
            <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>We calculate composite scores using key repository health metrics</p>
          </div>
          <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Activity</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Commit frequency</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚀</div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Growth</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Star/fork velocity</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Documentation</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>README depth</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛠️</div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Issue Health</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resolution time</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏷️</div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Domain Relevance</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Topic focus</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
