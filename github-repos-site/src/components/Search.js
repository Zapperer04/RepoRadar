import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import RepoList from './RepoList';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState('');

  // The search string from the URL (e.g., "?q=react&sort=stars")
  const searchString = location.search;

  useEffect(() => {
    if (searchString) {
      // Pass the raw search string (minus the '?') to RepoList
      // apiClient.js will handle the 'q=' prefix if needed
      setQuery(searchString.substring(1));
    } else {
      setQuery('');
    }
  }, [searchString]);

  const handleSearch = (newQuery) => {
    // SearchBar provides a string like "q=react&sort=stars"
    // We update the URL which in turn updates searchString
    const params = new URLSearchParams(newQuery);
    setSearchParams(params);
  };

  const urlQuery = searchParams.get('q');

  return (
    <div className="search-page">
      <header className="page-header">
        <h1 className="page-title">⚡ Command Center</h1>
        <p className="page-subtitle">Precision discovery engine. Query the GitHub index with developer-centric filters.</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      <div className="search-results-container" style={{ minHeight: '400px' }}>
        {query ? (
          <RepoList
            query={query}
            title={urlQuery && urlQuery.startsWith('topic:') ? `Domain: ${urlQuery.replace('topic:', '')}` : "Audited Results"}
          />
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 0', opacity: '0.5' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛰️</div>
            <p>Awaiting coordinates. Enter a query or select a domain in the Explorer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;