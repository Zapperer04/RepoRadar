import React, { useState } from 'react';
import SearchBar from './SearchBar';
import RepoList from './RepoList';

const Search = () => {
  const [query, setQuery] = useState(null);

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Command Center</h2>
        <p>Filter by language, sort by relevance, and find hidden gems.</p>
      </div>

      <SearchBar onSearch={setQuery} />

      {query && (
        <div style={{ marginTop: '2rem' }}>
          <RepoList query={query} title="Search Results" />
        </div>
      )}
    </div>
  );
};

export default Search;