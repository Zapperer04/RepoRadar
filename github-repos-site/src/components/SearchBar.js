import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('stars');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term) return;

    
    let query = `q=${term}`;
    if (language) query += `+language:${language}`;
    query += `&sort=${sort}&order=desc`;

    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-container">
      <div className="search-group">
        <input
          type="text"
          className="search-input"
          placeholder="Search repos (e.g. 'neural networks', 'game engine')..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <select 
          className="search-select" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="c++">C++</option>
          <option value="java">Java</option>
        </select>

        <select 
          className="search-select" 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="stars">Most Stars</option>
          <option value="updated">Recently Updated</option>
          <option value="forks">Most Forks</option>
          <option value="help-wanted-issues">Help Wanted</option>
        </select>

        <button type="submit" className="search-btn">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;