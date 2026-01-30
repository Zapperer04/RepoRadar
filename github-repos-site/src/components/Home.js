import React from 'react';
import RepoList from './RepoList';

// Trending: Repos created in last 30 days, sorted by stars
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
const trendingQuery = `q=created:>${formattedDate}&sort=stars&order=desc&per_page=10`;

// Best: High-star repos overall, sorted by stars
const bestQuery = `q=stars:>10000&sort=stars&order=desc&per_page=10`;

const Home = () => {
  return (
    <>
      <RepoList query={trendingQuery} title="Trending Repos" />
      <RepoList query={bestQuery} title="Best Repos (High Stars)" />
    </>
  );
};

export default Home;