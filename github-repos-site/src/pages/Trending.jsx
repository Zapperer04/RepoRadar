import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import { mockRepos } from '../data/mockRepos.js';

const Trending = () => {
  const trendingRepos = mockRepos.filter(repo => repo.isTrending).sort((a, b) => b.growthScore - a.growthScore);
  const trendingToday = trendingRepos.slice(0, 3);
  const trendingThisWeek = trendingRepos.slice(3, 6);
  const trendingUnder1k = trendingRepos.filter(r => r.stars < 1000).slice(0, 3);

  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">📈 Trending Repositories</h1>
          <p className="page-subtitle">
            Track fastest-growing repositories across the GitHub ecosystem by velocity and momentum.
          </p>
        </header>

        <section className="section">
          <header className="section-header">
            <h2 className="section-title">Trending Today</h2>
            <p className="section-subtitle">Highest velocity in the last 24 hours</p>
          </header>
          <RepoGrid repos={trendingToday} />
        </section>

        {trendingThisWeek.length > 0 && (
          <section className="section">
            <header className="section-header">
              <h2 className="section-title">Trending This Week</h2>
            </header>
            <RepoGrid repos={trendingThisWeek} />
          </section>
        )}

        {trendingUnder1k.length > 0 && (
          <section className="section">
            <header className="section-header">
              <h2 className="section-title">Trending Under 1k Stars</h2>
              <p className="section-subtitle">Fastest growing hidden gems</p>
            </header>
            <RepoGrid repos={trendingUnder1k} />
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default Trending;
