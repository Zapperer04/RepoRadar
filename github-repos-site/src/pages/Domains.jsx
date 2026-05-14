import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { DOMAINS } from '../constants/domains.js';
import { mockRepos } from '../data/mockRepos.js';

const Domains = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">🏷️ Technology Domains</h1>
          <p className="page-subtitle">
            Explore intelligence across specialized technological landscapes.
          </p>
        </header>

        <div className="grid-3">
          {DOMAINS.map(domain => {
            const domainReposCount = mockRepos.filter(r => r.domain === domain.value).length;
            
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
      </div>
    </MainLayout>
  );
};

export default Domains;
