import { Link, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { useSavedRepos } from '../../hooks/useSavedRepos.js';
import { useAuth } from '../../hooks/useAuth.js';

const RepoCard = ({ repo }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleSave, isSaved } = useSavedRepos();
  
  if (!repo) return null;

  const fullName = repo.fullName || repo.full_name;
  const saved = isSaved(fullName);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    await toggleSave(repo);
  };

  return (
    <Card className="rr-repo-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CardTitle style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Link to={`/repo/${repo.owner}/${repo.name}`} style={{ color: 'var(--text-primary)' }} title={repo.name}>
              {repo.name}
            </Link>
          </CardTitle>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={fullName}>
            {fullName}
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
        <Badge variant="muted">{repo.domain}</Badge>
        <Badge variant="muted">{repo.language}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600 }}>
        <span title="Stars" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⭐ {repo.stars.toLocaleString()}</span>
        <span title="Forks" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🍴 {repo.forks.toLocaleString()}</span>
        <span title="Open Issues" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🐛 {repo.openIssues.toLocaleString()}</span>
        <span title="Hidden Gem Score" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>💎 {repo.hiddenGemScore}</span>
      </div>

      <CardFooter style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <Link to={`/repo/${repo.owner}/${repo.name}`} style={{ flex: 1, marginRight: '8px' }}>
          <Button variant="primary" style={{ width: '100%' }}>View Details</Button>
        </Link>
        {repo.githubUrl ? (
          <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: '8px' }}>
            <Button variant="secondary" title="Open in GitHub">GitHub</Button>
          </a>
        ) : null}
        <Button 
          variant={saved ? 'secondary' : 'ghost'} 
          style={{ minWidth: '80px' }}
          onClick={handleSave}
        >
          {saved ? 'Saved' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RepoCard;
