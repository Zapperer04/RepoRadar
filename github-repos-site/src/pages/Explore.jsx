import React, { useState, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import RepoFilters from '../components/repo/RepoFilters.jsx';
import RepoSortBar from '../components/repo/RepoSortBar.jsx';
import RepoSearchBar from '../components/repo/RepoSearchBar.jsx';
import { mockRepos } from '../data/mockRepos.js';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    language: '',
    stars: '',
    activityLevel: '',
    repoType: '',
    isHiddenGem: false,
    isBeginnerFriendly: false
  });
  const [sort, setSort] = useState('hiddenGemScore');

  const filteredAndSortedRepos = useMemo(() => {
    return mockRepos.filter(repo => {
      // Search
      if (searchQuery && !repo.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !repo.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !repo.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Filters
      if (filters.domain && repo.domain !== filters.domain) return false;
      if (filters.language && repo.language !== filters.language) return false;
      if (filters.activityLevel && repo.activityLevel !== filters.activityLevel) return false;
      if (filters.repoType && repo.repoType !== filters.repoType) return false;
      if (filters.isHiddenGem && !repo.isHiddenGem) return false;
      if (filters.isBeginnerFriendly && !repo.isBeginnerFriendly) return false;
      
      // Star Ranges
      if (filters.stars) {
        const starIdx = parseInt(filters.stars, 10);
        if (starIdx === 1 && repo.stars > 1000) return false; // Under 1k
        if (starIdx === 2 && (repo.stars <= 1000 || repo.stars > 5000)) return false; // 1k - 5k
        if (starIdx === 3 && repo.stars <= 5000) return false; // 5k+
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'lastUpdated') {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return (b[sort] || 0) - (a[sort] || 0);
    });
  }, [searchQuery, filters, sort]);

  const SidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Filters</h3>
        <RepoFilters filters={filters} onFilterChange={setFilters} />
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebar={SidebarContent}>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
          <h1 className="page-title">Explore Intelligence</h1>
          <p className="page-subtitle">
            Filter, sort, and discover open-source projects using deep repository analytics.
          </p>
        </header>

        <RepoSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <RepoSortBar 
          sort={sort} 
          onSortChange={setSort} 
          resultCount={filteredAndSortedRepos.length} 
        />
        
        <RepoGrid repos={filteredAndSortedRepos} />
      </div>
    </DashboardLayout>
  );
};

export default Explore;
