import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import Card from '../components/ui/Card.jsx';
import Loader from '../components/ui/Loader.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useRepoData } from '../hooks/useRepoData.js';
import { repoService } from '../services/repoService.js';

const HiddenGems = () => {
  const { data: serverGems, source, loading } = useRepoData(repoService.getHiddenGems);
  
  const hiddenGems = (serverGems || []).sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);
  const todaysPicks = hiddenGems.slice(0, 3);
  const risingThisWeek = hiddenGems.slice(3, 6);
  const lowStarHighQuality = hiddenGems.filter(r => r.stars < 500).slice(0, 3);

  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">💎 Hidden Gems</h1>
          <p className="page-subtitle">
            Curated, high-quality repositories under 1,000 stars with exceptional documentation and growth signals.
            {source && <Badge variant={source === 'github' ? 'success' : 'muted'} style={{ marginLeft: '8px' }}>Source: {source}</Badge>}
          </p>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}><Loader /></div>
        ) : (
          <>
            <section className="grid-3" style={{ marginBottom: 'var(--space-8)' }}>
          <Card style={{ textAlign: 'center', backgroundColor: 'rgba(56, 189, 248, 0.05)', borderColor: 'var(--accent-primary)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{hiddenGems.length}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Gems Tracked</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>+3</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Added Today</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>92/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Avg Gem Score</div>
          </Card>
        </section>

        <section className="section">
          <header className="section-header">
            <h2 className="section-title">Today's Hidden Gems</h2>
          </header>
          <RepoGrid repos={todaysPicks} />
        </section>

        {risingThisWeek.length > 0 && (
          <section className="section">
            <header className="section-header">
              <h2 className="section-title">Rising This Week</h2>
            </header>
            <RepoGrid repos={risingThisWeek} />
          </section>
        )}
        
        {lowStarHighQuality.length > 0 && (
          <section className="section">
            <header className="section-header">
              <h2 className="section-title">Ultra-Low Stars, High Quality</h2>
              <p className="section-subtitle">Under 500 stars</p>
            </header>
            <RepoGrid repos={lowStarHighQuality} />
          </section>
        )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default HiddenGems;
