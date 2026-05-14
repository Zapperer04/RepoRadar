import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

const RepoCard = ({ repo }) => {
  if (!repo) return null;

  return (
    <Card className="rr-repo-card">
      <CardHeader>
        <div>
          <CardTitle>
            <Link to={`/repo/${repo.owner}/${repo.name}`} style={{ color: 'var(--text-primary)' }}>
              {repo.name}
            </Link>
          </CardTitle>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {repo.fullName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '50%' }}>
          {repo.isHiddenGem && <Badge variant="accent">Hidden Gem</Badge>}
          {repo.isTrending && <Badge variant="warning">Trending</Badge>}
          {repo.isBeginnerFriendly && <Badge variant="success">Beginner</Badge>}
        </div>
      </CardHeader>
      
      <CardDescription>
        {repo.description}
      </CardDescription>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Badge variant="muted">{repo.domain}</Badge>
        <Badge variant="muted">{repo.language}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <span title="Stars">⭐ {repo.stars}</span>
        <span title="Forks">🍴 {repo.forks}</span>
        <span title="Open Issues">🐛 {repo.openIssues}</span>
        <span title="Hidden Gem Score">💎 {repo.hiddenGemScore}/100</span>
      </div>

      <CardFooter>
        <Link to={`/repo/${repo.owner}/${repo.name}`} style={{ flex: 1, marginRight: '8px' }}>
          <Button variant="primary" style={{ width: '100%' }}>View Details</Button>
        </Link>
        <Button variant={repo.isSaved ? 'secondary' : 'ghost'}>
          {repo.isSaved ? 'Saved' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RepoCard;
