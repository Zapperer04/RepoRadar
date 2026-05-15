import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import Badge from '../components/ui/Badge.jsx';
import { DOMAINS } from '../constants/domains.js';
import { useRepoData } from '../hooks/useRepoData.js';
import { repoService } from '../services/repoService.js';

const Domains = () => {
  const { data: serverRepos, source, loading } = useRepoData(repoService.getRepos);
  const repoList = serverRepos || [];
  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">🏷️ Technology Domains</h1>
          <p className="page-subtitle">
            Explore intelligence across specialized technological landscapes.
            {source && <Badge variant={source === 'github' ? 'success' : 'muted'} style={{ marginLeft: '8px' }}>Source: {source}</Badge>}
          </p>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}><Loader /></div>
        ) : (
          <div className="grid-3">
            {DOMAINS.map(domain => {
              const domainReposCount = repoList.filter(r => r.domain === domain.value).length;
            
            return (
              <Card key={domain.value} style={{ borderColor: domain.accent, borderTopWidth: '3px' }}>
                <CardHeader>
                  <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{domain.iconName}</span>
                    {domain.label}
                  </CardTitle>
                </CardHeader>
                <CardDescription>
                  {domain.description}
                </CardDescription>
                
                <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{domainReposCount}</span> tracked repositories
                </div>
                
                <CardFooter>
                  <Link to={`/explore?domain=${encodeURIComponent(domain.value)}`} style={{ width: '100%' }}>
                    <Button variant="secondary" style={{ width: '100%' }}>Explore Domain</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Domains;
