import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import this to read URL
import SearchBar from './SearchBar';
import RepoList from './RepoList';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(null);

  const rawQuery = searchParams.get('q');

  useEffect(() => {
    if (rawQuery) {
      setQuery(`q=${encodeURIComponent(rawQuery)}`);
    }
  }, [rawQuery]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Command Center</h2>
        <p>Filter by language, sort by relevance, and find hidden gems.</p>
      </div>

      <SearchBar onSearch={setQuery} />

      {query && (
        <div style={{ marginTop: '2rem' }}>
          <RepoList
            query={query}
            title={rawQuery?.includes('topic:') ? `Exploring Topic: ${rawQuery.replace('topic:', '')}` : "Search Results"}
          />
        </div>
      )}
    </div>
  );
};

export default Search;