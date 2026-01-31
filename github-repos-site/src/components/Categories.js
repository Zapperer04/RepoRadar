import React from 'react';
import RepoList from './RepoList';
const categories = [
  { name: 'Web Development', query: 'q=language:javascript+stars:>1000&sort=stars&order=desc&per_page=5' },
  { name: 'Machine Learning', query: 'q=topic:machine-learning+stars:>1000&sort=stars&order=desc&per_page=5' },
  { name: 'AI', query: 'q=topic:ai+stars:>1000&sort=stars&order=desc&per_page=5' },
  { name: 'Python Tools', query: 'q=language:python+stars:>1000&sort=stars&order=desc&per_page=5' },
  { name: 'DevOps', query: 'q=topic:devops+stars:>1000&sort=stars&order=desc&per_page=5' },
  
];

const Categories = () => {
  return (
    <div>
      <h1>Categories</h1>
      {categories.map(cat => (
        <RepoList key={cat.name} query={cat.query} title={cat.name} />
      ))}
    </div>
  );
};

export default Categories;