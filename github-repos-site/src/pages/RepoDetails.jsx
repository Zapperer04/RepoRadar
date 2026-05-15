import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import { useRepoData } from '../hooks/useRepoData.js';
import { repoService } from '../services/repoService.js';

const RepoDetails = () => {
  const { owner, repoName } = useParams();
  
  const { data: repo, loading, source } = useRepoData(() => repoService.getRepoDetails(owner, repoName), [owner, repoName]);
  const { data: similarRepos } = useRepoData(() => repoService.getSimilarRepos(owner, repoName), [owner, repoName]);

  if (loading) {
    return (
      <MainLayout>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-8)' }}>
          <Loader />
        </div>
      </MainLayout>
    );
  }

  if (!repo) {
    return (
      <MainLayout>
        <div className="page-container">
          <EmptyState title="Repository Not Found" message="We couldn't find this repository in our index." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/explore" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            ← Back to Explore
          </Link>
        </div>

        <header className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '8px', wordBreak: 'break-word' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{repo.owner} /</span> {repo.name}
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.2rem', maxWidth: '800px', marginBottom: '16px' }}>
              {repo.description}
              {source && <Badge variant={source === 'github' ? 'success' : 'muted'} style={{ marginLeft: '8px', verticalAlign: 'middle' }}>Source: {source}</Badge>}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge variant="muted">{repo.domain || 'Unknown'}</Badge>
              <Badge variant="muted">{repo.language || 'Unknown'}</Badge>
              {repo.isHiddenGem && <Badge variant="accent">Hidden Gem</Badge>}
              {repo.isTrending && <Badge variant="warning">Trending</Badge>}
              {repo.isBeginnerFriendly && <Badge variant="success">Beginner Friendly</Badge>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {repo.githubUrl && (
              <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">Open GitHub</Button>
              </a>
            )}
            <Button variant={repo.isSaved ? 'secondary' : 'primary'} size="lg">
              {repo.isSaved ? 'Saved' : 'Save to Stash'}
            </Button>
          </div>
        </header>

        <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{repo.hiddenGemScore}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gem Score</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{repo.growthScore}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Growth</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>{repo.documentationScore}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Docs Quality</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{repo.beginnerScore}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Beginner friendly</div>
          </Card>
        </div>

        <div className="grid-2">
          <div className="content-stack">
            <Card>
              <CardHeader><CardTitle>Why this repo matters</CardTitle></CardHeader>
              <CardDescription>
                AI analysis placeholder. This project demonstrates strong growth metrics and excellent documentation relative to its star count, suggesting high potential value for the {repo.domain} ecosystem.
              </CardDescription>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Activity Insights</CardTitle></CardHeader>
              <CardDescription>
                Activity level is <strong>{repo.activityLevel || 'Unknown'}</strong>. 
                {repo.lastUpdated && ` Last updated on ${new Date(repo.lastUpdated).toLocaleDateString()}.`}
                It currently has {repo.openIssues || 0} open issues and {repo.forks || 0} forks.
              </CardDescription>
            </Card>
          </div>

          <div className="content-stack">
            <Card>
              <CardHeader><CardTitle>Contribution Readiness</CardTitle></CardHeader>
              <CardDescription>
                Maintenance score: <strong>{repo.maintenanceScore}/100</strong>. 
                {repo.isBeginnerFriendly ? " Highly recommended for first-time contributors." : " Might require advanced domain knowledge."}
              </CardDescription>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Similar Repositories</CardTitle></CardHeader>
              <CardDescription>
                {similarRepos && similarRepos.length > 0 ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {similarRepos.map(sim => (
                      <li key={sim.id} style={{ marginBottom: '8px' }}>
                        <Link to={`/repo/${sim.owner}/${sim.name}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                          {sim.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No similar repositories found.</p>
                )}
              </CardDescription>
            </Card>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default RepoDetails;
