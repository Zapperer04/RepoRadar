import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import RepoFilters from '../components/repo/RepoFilters.jsx';
import RepoSortBar from '../components/repo/RepoSortBar.jsx';
import RepoSearchBar from '../components/repo/RepoSearchBar.jsx';
import Loader from '../components/ui/Loader.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useRepoData } from '../hooks/useRepoData.js';
import { repoService } from '../services/repoService.js';
import { normalizeRepo } from '../utils/normalizeRepo.js';

const Explore = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlDomain = searchParams.get('domain');

  const { data: serverRepos, source, loading } = useRepoData(repoService.getRepos);

  // Task 2: Normalize server repos immediately
  const normalizedRepos = useMemo(() => (serverRepos || []).map(normalizeRepo), [serverRepos]);

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

  // Task 5: Effect to sync URL domain to filters
  useEffect(() => {
    if (urlDomain) {
      setFilters(prev => ({ ...prev, domain: urlDomain }));
    }
  }, [urlDomain]);

  const [sort, setSort] = useState('hiddenGemScore');

  const filteredAndSortedRepos = useMemo(() => {
    return normalizedRepos.filter(repo => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = repo.name && repo.name.toLowerCase().includes(query);
        const matchesOwner = repo.owner && repo.owner.toLowerCase().includes(query);
        const matchesDesc = repo.description && repo.description.toLowerCase().includes(query);
        const matchesDomain = repo.domain && repo.domain.toLowerCase().includes(query);
        const matchesLang = repo.language && repo.language.toLowerCase().includes(query);
        const matchesTopics = repo.topics && repo.topics.some(t => t.toLowerCase().includes(query));
        
        if (!matchesName && !matchesOwner && !matchesDesc && !matchesDomain && !matchesLang && !matchesTopics) {
          return false;
        }
      }
      
      // Filters (Case-insensitive for robust matching)
      if (filters.domain && repo.domain.toLowerCase() !== filters.domain.toLowerCase()) return false;
      if (filters.language && repo.language.toLowerCase() !== filters.language.toLowerCase()) return false;
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
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      }
      return (b[sort] || 0) - (a[sort] || 0);
    });
  }, [normalizedRepos, searchQuery, filters, sort]);

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
          <div>
            <h1 className="page-title">Explore Intelligence</h1>
            <p className="page-subtitle">
              Filter, sort, and discover open-source projects using deep repository analytics.
              {source && <Badge variant={source === 'github' ? 'success' : 'muted'} style={{ marginLeft: '8px' }}>Source: {source}</Badge>}
            </p>
          </div>
        </header>

        <RepoSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <RepoSortBar 
          sort={sort} 
          onSortChange={setSort} 
          resultCount={filteredAndSortedRepos.length} 
        />
        
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}><Loader /></div> : <RepoGrid repos={filteredAndSortedRepos} />}
      </div>
    </DashboardLayout>
  );
};

export default Explore;

