import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { useSavedRepos } from '../../hooks/useSavedRepos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { normalizeRepo, isValidGithubUrl } from '../../utils/normalizeRepo.js';
import SaveToCollectionModal from '../saved/SaveToCollectionModal.jsx';

const RepoCard = ({ repo: rawRepo, onDeleteAnimation, onRemoveFromCollection }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleSave, isSaved } = useSavedRepos();
  const [isSaving, setIsSaving] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  
  // Task 2 & 7: Normalize data and handle potential crashes
  const repo = normalizeRepo(rawRepo);
  
  if (!repo) {
    return (
      <Card style={{ padding: '16px', textAlign: 'center', opacity: 0.7 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Repository data unavailable</p>
      </Card>
    );
  }

  const saved = isSaved(repo.fullName);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsSaving(true);
    // Task 6: If it's a removal and we have an animation callback, call it first
    if (saved && onDeleteAnimation) {
      await onDeleteAnimation(repo);
    }
    
    // Add artificial delay for UX feedback visibility on fast connections
    await new Promise(r => setTimeout(r, 600));
    
    await toggleSave(repo);
    setIsSaving(false);
  };


  const handleOpenCollection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCollectionModal(true);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromCollection) {
      onRemoveFromCollection(repo.id);
    }
  };

  // Task 1: Safe number formatting
  const formatNum = (val) => {
    return (val || 0).toLocaleString();
  };

  const hasValidGithub = isValidGithubUrl(repo.githubUrl);

  return (
    <>
      <Card className="rr-repo-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CardTitle style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Link to={`/repo/${repo.owner}/${repo.name}`} style={{ color: 'var(--text-primary)' }} title={repo.name}>
                {repo.name}
              </Link>
            </CardTitle>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={repo.fullName}>
              {repo.fullName}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0, marginLeft: '8px' }}>
            {repo.isHiddenGem && <Badge variant="accent">Hidden Gem</Badge>}
            {repo.isTrending && <Badge variant="warning">Trending</Badge>}
            {repo.isBeginnerFriendly && <Badge variant="success">Beginner</Badge>}
          </div>
        </CardHeader>
        
        <CardDescription style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          flex: 1,
          marginBottom: '16px'
        }}>
          {repo.description}
        </CardDescription>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Badge variant="muted">{repo.domain || 'General'}</Badge>
          <Badge variant="muted">{repo.language || 'Mixed'}</Badge>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600 }}>
          <span title="Stars" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⭐ {formatNum(repo.stars)}</span>
          <span title="Forks" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🍴 {formatNum(repo.forks)}</span>
          <span title="Open Issues" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🐛 {formatNum(repo.openIssues)}</span>
          <span title="Hidden Gem Score" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>💎 {repo.hiddenGemScore}</span>
        </div>

        <div className="repo-card-actions">
          <Link to={`/repo/${repo.owner}/${repo.name}`}>
            <Button variant="primary">Details</Button>
          </Link>

          {hasValidGithub ? (
            <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" title="Open in GitHub">GitHub</Button>
            </a>
          ) : (
            <Button variant="secondary" disabled title="GitHub URL unavailable">GitHub</Button>
          )}

          {onRemoveFromCollection ? (
            <Button 
              variant="ghost" 
              style={{ color: 'var(--danger)' }}
              onClick={handleRemove}
            >
              Remove
            </Button>
          ) : (
            <Button 
              variant={saved ? 'secondary' : 'ghost'} 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (saved ? 'Removing...' : 'Saving...') : (saved ? 'Saved' : 'Save')}
            </Button>
          )}

          {!onRemoveFromCollection && (
            <Button 
              variant="outline" 
              onClick={handleOpenCollection}
              disabled={!saved || !isAuthenticated}
              title={!isAuthenticated ? "Login to organize" : !saved ? "Save first" : "Add to collection"}
            >
              List
            </Button>
          )}
        </div>

      </Card>

      {showCollectionModal && (
        <SaveToCollectionModal 
          repo={repo} 
          onClose={() => setShowCollectionModal(false)} 
        />
      )}
    </>
  );
};

export default RepoCard;


