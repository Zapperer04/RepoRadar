import React from 'react';
import RepoList from './RepoList.jsx';

const HiddenGemSection = () => {
  const gems = [
    {
      id: 'cli-tools',
      icon: '⌨️',
      title: "Underrated CLI Utilities",
      description: "Terminal tools with 200-2k stars. Active, useful, and unknown to the masses.",
      query: "q=topic:cli+stars:200..2000+pushed:>2024-06-01&sort=updated"
    },
    {
      id: 'tiny-libs',
      icon: '📦',
      title: "Micro-Libraries",
      description: "Zero-dependency libraries that solve one problem perfectly. Lightweight & fast.",
      query: "q=topic:library+size:<500+stars:100..3000&sort=stars"
    },
    {
      id: 'knowledge-deep',
      icon: '📚',
      title: "Deep Learning Resources",
      description: "Not just tutorials—deep technical specifications and roadmap repositories.",
      query: "q=topic:roadmap+topic:internals+stars:500..5000&sort=stars"
    },
    {
      id: 'new-starters',
      icon: '🌱',
      title: "Modern SaaS Boilerplates",
      description: "Next.js 15, Hono, Bun, and Biome starters for your next big idea.",
      query: "q=topic:boilerplate+topic:nextjs+pushed:>2025-01-01&sort=updated"
    }
  ];

  return (
    <div className="gems-page">
      <header className="page-header">
        <div className="feature-badge">Alpha Discovery</div>
        <h1 className="page-title">💎 Hidden Gems</h1>
        <p className="page-subtitle">
          Top-tier engineering without the mainstream hype.
        </p>
      </header>

      <div className="offering-grid">
        {gems.map((section) => (
          <div key={section.id} className="offering-section" style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '2rem' }}>
            <header className="offering-header">
              <div className="offering-title" style={{ fontSize: '1.5rem' }}>
                <span>{section.icon}</span>
                {section.title}
              </div>
              <p className="offering-subtitle">{section.description}</p>
            </header>
            <RepoList query={section.query} title="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiddenGemSection;
