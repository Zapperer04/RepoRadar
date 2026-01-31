import React from 'react';
import RepoList from './RepoList';

// 1. "Fresh & Trending" (New projects born in last 30 days)
// This captures the monthly trends.
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const date30 = thirtyDaysAgo.toISOString().split('T')[0];
const freshQuery = `q=created:>${date30}&sort=stars&order=desc&per_page=10`;

// 2. "Viral / Rising" (THE FIX: True Viral)
// Changed from 'pushed' to 'created' to filter out old repos.
// This now shows only items born in the last 7 days that are already famous.
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const date7 = sevenDaysAgo.toISOString().split('T')[0];
const viralQuery = `q=created:>${date7}&sort=stars&order=desc&per_page=10`;

// 3. "Hall of Fame" (The Giants)
const bestQuery = `q=stars:>10000&sort=stars&order=desc&per_page=10`;

const Home = () => {
  return (
    <>
      <div className="search-header">
        <h2>🔥 What's Hot</h2>
        <p>The pulse of open source right now.</p>
      </div>

      <RepoList query={viralQuery} title="🚀 Viral / Rising (Born this Week)" />
      <RepoList query={freshQuery} title="✨ Fresh & Trending (Born this Month)" />
      <RepoList query={bestQuery} title="🏆 Hall of Fame (All Time)" />
    </>
  );
};

export default Home;