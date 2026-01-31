import React from 'react';
import RepoList from './RepoList';

const HiddenGems = () => {
  

  const gems = [
    {
      title: "🛠️ Underrated CLI Tools",
      description: "Powerful terminal utilities that automate your workflow.",
      query: "q=topic:cli+topic:terminal+stars:100..5000+pushed:>2024-01-01&sort=stars&order=desc"
    },
    {
      title: "🧠 Knowledge Vaults",
      description: "Cheatsheets, roadmaps, and deep-dive guides hidden in plain sight.",
      query: "q=topic:cheatsheet+topic:guide+stars:200..4000&sort=stars&order=desc"
    },
    {
      title: "🚀 Production Starters",
      description: "Complete boilerplates to launch SaaS/Apps instantly. Skip the setup.",
      query: "q=topic:boilerplate+topic:starter+stars:100..3000+pushed:>2024-01-01&sort=updated&order=desc"
    },
    {
      title: "💎 'Awesome' Collections",
      description: "Curated lists of resources for specific niche technologies.",
      query: "q=topic:awesome-list+stars:500..5000&sort=stars&order=desc"
    }
  ];

  return (
    <div className="page-container">
      <div className="gems-header">
        <h1 className="section-title" style={{ fontSize: '2rem', border: 'none', textAlign: 'center' }}>
          💎 Hidden Gems
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Digging deep into GitHub. These repositories have high utility, active maintainers, 
          but haven't hit mainstream fame yet.
        </p>
      </div>

      {gems.map((section, index) => (
        <div key={index} className="gem-section">
          <div className="gem-description">
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{section.title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{section.description}</p>
          </div>
          <RepoList query={section.query} title="" />
        </div>
      ))}
    </div>
  );
};

export default HiddenGems;