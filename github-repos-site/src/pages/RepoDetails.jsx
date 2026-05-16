import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import { useRepoData } from '../hooks/useRepoData.js';
import { repoService } from '../services/repoService.js';
import { useSavedRepos } from '../hooks/useSavedRepos.js';
import { useAuth } from '../hooks/useAuth.js';
import { normalizeRepo, isValidGithubUrl } from '../utils/normalizeRepo.js';
import SaveToCollectionModal from '../components/saved/SaveToCollectionModal.jsx';
import { 
  getWhyRepoMatters, 
  getActivityInsight, 
  getContributionInsight, 
  getRepoStrengths 
} from '../utils/repoInsights.js';

const RepoDetails = () => {
  const { owner, repoName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleSave, isSaved } = useSavedRepos();
  const [isSaving, setIsSaving] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  
  const { data: rawRepo, loading, source } = useRepoData(() => repoService.getRepoDetails(owner, repoName), [owner, repoName]);
  const { data: similarRepos } = useRepoData(() => repoService.getSimilarRepos(owner, repoName), [owner, repoName]);

  // Task 2: Normalize repo data
  const repo = normalizeRepo(rawRepo);

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

  const saved = isSaved(repo.fullName);
  const strengths = getRepoStrengths(repo);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    await toggleSave(repo);
    setIsSaving(false);
  };

  const hasValidGithub = isValidGithubUrl(repo.githubUrl);

  return (
    <MainLayout>
      <div className="page-container">
        <div style={{ marginBottom: 'var(--space-4)' }}>
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
              <Badge variant="muted">{repo.domain || 'General'}</Badge>
              <Badge variant="muted">{repo.language || 'Mixed'}</Badge>
              {repo.isHiddenGem && <Badge variant="accent">Hidden Gem</Badge>}
              {repo.isTrending && <Badge variant="warning">Trending</Badge>}
              {repo.isBeginnerFriendly && <Badge variant="success">Beginner Friendly</Badge>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            {hasValidGithub ? (
              <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">Open GitHub</Button>
              </a>
            ) : (
              <Button variant="secondary" size="lg" disabled title="Source URL unavailable">GitHub Unavailable</Button>
            )}
            <Button 
              variant={saved ? 'secondary' : 'primary'} 
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (saved ? 'Removing...' : 'Saving...') : (saved ? 'Unsave' : 'Save to Stash')}
            </Button>
            {saved && (
              <Button variant="outline" size="lg" onClick={() => setShowCollectionModal(true)}>
                Add to Collection
              </Button>
            )}
          </div>
        </header>


        <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{(repo.hiddenGemScore || 0)}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gem Score</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{(repo.growthScore || 0)}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Growth</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>{(repo.documentationScore || 0)}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Docs Quality</div>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{(repo.beginnerScore || 0)}/100</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Beginner friendly</div>
          </Card>
        </div>

        <div className="grid-2">
          <div className="content-stack">
            <Card>
              <CardHeader><CardTitle>Why this repo matters</CardTitle></CardHeader>
              <CardDescription>
                <div style={{ marginBottom: '16px', lineHeight: 1.6 }}>
                  {getWhyRepoMatters(repo)}
                </div>
                {strengths.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {strengths.map(strength => (
                      <Badge key={strength} variant="muted" style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        ✓ {strength}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardDescription>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Activity Insights</CardTitle></CardHeader>
              <CardDescription>
                <div style={{ lineHeight: 1.6 }}>
                  {getActivityInsight(repo)}
                </div>
              </CardDescription>
            </Card>
          </div>

          <div className="content-stack">
            <Card>
              <CardHeader><CardTitle>Contribution Readiness</CardTitle></CardHeader>
              <CardDescription>
                <div style={{ lineHeight: 1.6 }}>
                  {getContributionInsight(repo)}
                </div>
              </CardDescription>
            </Card>

            
            <Card>
              <CardHeader><CardTitle>Similar Repositories</CardTitle></CardHeader>
              <CardDescription>
                {similarRepos && similarRepos.length > 0 ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {similarRepos.map(sim => {
                      const s = normalizeRepo(sim);
                      return (
                        <li key={s.id} style={{ marginBottom: '8px' }}>
                          <Link to={`/repo/${s.owner}/${s.name}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                            {s.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No similar repositories found.</p>
                )}
              </CardDescription>
            </Card>
          </div>
        </div>

      </div>

      {showCollectionModal && (
        <SaveToCollectionModal 
          repo={repo} 
          onClose={() => setShowCollectionModal(false)} 
        />
      )}
    </MainLayout>
  );
};


export default RepoDetails;

