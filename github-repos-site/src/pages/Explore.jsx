import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import RepoSearchBar from '../components/repo/RepoSearchBar.jsx';
import RepoList from '../components/repo/RepoList.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState('');

  const searchString = location.search;

  useEffect(() => {
    if (searchString) {
      setQuery(searchString.substring(1));
    } else {
      setQuery('');
    }
  }, [searchString]);

  const handleSearch = (newQuery) => {
    const params = new URLSearchParams(newQuery);
    setSearchParams(params);
  };

  const urlQuery = searchParams.get('q');

  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">⚡ Command Center</h1>
          <p className="page-subtitle">Precision discovery engine. Query the GitHub index with developer-centric filters.</p>
        </header>

        <RepoSearchBar onSearch={handleSearch} />

        <div className="section" style={{ minHeight: '400px', marginTop: 'var(--space-6)' }}>
          {query ? (
            <RepoList
              query={query}
              title={urlQuery && urlQuery.startsWith('topic:') ? `Domain: ${urlQuery.replace('topic:', '')}` : "Audited Results"}
            />
          ) : (
            <EmptyState 
              icon="🛰️"
              title="Awaiting coordinates"
              message="Enter a query or select a domain in the Explorer."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Explore;
