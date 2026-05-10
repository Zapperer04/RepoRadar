import React, { useState, useEffect } from 'react';
import RepoList from './RepoList';

const topicTrees = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: '🎨',
    subtopics: [
      { id: 'react', name: 'React Ecosystem', query: 'topic:react' },
      { id: 'vue', name: 'Vue Ecosystem', query: 'topic:vue' },
      { id: 'state', name: 'State Management', query: 'topic:state-management' },
      { id: 'ui', name: 'UI Libraries', query: 'topic:ui-library' }
    ]
  },
  {
    id: 'backend',
    name: 'Backend & Infrastructure',
    icon: '⚙️',
    subtopics: [
      { id: 'node', name: 'Node.js / Bun', query: 'topic:nodejs+topic:runtime' },
      { id: 'rust', name: 'Rust Powerhouse', query: 'topic:rust+topic:backend' },
      { id: 'database', name: 'Databases / ORMs', query: 'topic:database+topic:orm' },
      { id: 'api', name: 'API Frameworks', query: 'topic:api+topic:framework' }
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    subtopics: [
      { id: 'agents', name: 'AI Agents', query: 'topic:ai+topic:agents' },
      { id: 'llm', name: 'LLM Orchestration', query: 'topic:llm+topic:orchestration' },
      { id: 'vision', name: 'Computer Vision', query: 'topic:computer-vision' },
      { id: 'inference', name: 'Edge Inference', query: 'topic:inference' }
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    icon: '📱',
    subtopics: [
      { id: 'cross', name: 'Cross-Platform', query: 'topic:react-native+topic:flutter' },
      { id: 'ios', name: 'iOS Development', query: 'topic:swift+topic:ios' },
      { id: 'android', name: 'Android Development', query: 'topic:kotlin+topic:android' }
    ]
  },
  {
    id: 'security',
    name: 'Cyber Security',
    icon: '🛡️',
    subtopics: [
      { id: 'pentest', name: 'Pentesting Tools', query: 'topic:pentesting' },
      { id: 'crypto', name: 'Cryptography', query: 'topic:cryptography' },
      { id: 'audit', name: 'Security Auditing', query: 'topic:security-audit' }
    ]
  }
];

const Categories = () => {
  const [activeTreeId, setActiveTreeId] = useState(topicTrees[0].id);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Advanced Filter State
  const [filters, setFilters] = useState({
    sort: 'stars',
    minStars: '0',
    recency: 'all',
    type: 'all'
  });

  useEffect(() => {
    if (!activeSubtopic) {
      setActiveSubtopic(topicTrees[0].subtopics[0]);
    }
  }, [activeSubtopic]);

  const filteredTrees = topicTrees.filter(tree => 
    tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.subtopics.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFullQuery = () => {
    if (!activeSubtopic) return '';
    let q = activeSubtopic.query;
    
    // Add Star Filter
    if (filters.minStars !== '0') q += `+stars:>${filters.minStars}`;
    
    // Add Recency Filter
    if (filters.recency !== 'all') {
      const date = new Date();
      if (filters.recency === 'day') date.setDate(date.getDate() - 1);
      if (filters.recency === 'week') date.setDate(date.getDate() - 7);
      if (filters.recency === 'month') date.setDate(date.getDate() - 30);
      q += `+pushed:>${date.toISOString().split('T')[0]}`;
    }

    // Add Type Filter
    if (filters.type !== 'all') q += `+topic:${filters.type}`;

    return `${q}&sort=${filters.sort}&order=desc`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="topic-explorer-page">
      <div className="explorer-dashboard-layout">
        <aside className="explorer-sidebar">
          <div className="sidebar-search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filter domains..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="domain-section-label">Domain Clusters</div>
          <div className="explorer-domain-list">
            {filteredTrees.map(tree => (
              <div key={tree.id} className="domain-cluster">
                <div 
                  className={`domain-row ${activeTreeId === tree.id ? 'active' : ''}`}
                  onClick={() => setActiveTreeId(tree.id)}
                >
                  <span className="domain-icon">{tree.icon}</span>
                  <span className="domain-name">{tree.name}</span>
                </div>
                
                {activeTreeId === tree.id && (
                  <div className="explorer-subtopic-list">
                    {tree.subtopics.map(sub => (
                      <div 
                        key={sub.id}
                        className={`subtopic-item ${activeSubtopic?.id === sub.id ? 'active' : ''}`}
                        onClick={() => setActiveSubtopic(sub)}
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="explorer-main">
          <header className="explorer-header">
            <div className="header-text">
              <h2 className="explorer-title">
                {activeSubtopic ? activeSubtopic.name : "Select a Domain"}
              </h2>
              <p className="explorer-subtitle">
                Auditing the {activeSubtopic?.name} technical landscape.
              </p>
            </div>
            
            <div className="filter-wrapper" style={{ position: 'relative' }}>
              <button 
                className="search-btn" 
                onClick={() => setShowFilters(!showFilters)}
                style={{ background: showFilters ? 'var(--bg-tertiary)' : 'var(--accent-gradient)' }}
              >
                🛠️ {showFilters ? 'Close Refinement' : 'Refine Intelligence'}
              </button>

              {showFilters && (
                <div className="refinement-panel" style={{ 
                  position: 'absolute', top: '120%', right: 0, width: '320px', 
                  background: 'var(--bg-secondary)', border: '2px solid var(--accent-primary)',
                  padding: '1.5rem', borderRadius: 'var(--radius-lg)', zIndex: 50,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}>
                  <div className="filter-group-alt" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>SORTING LOGIC</label>
                    <select className="search-select" style={{ width: '100%', marginTop: '0.5rem' }} value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                      <option value="stars">Most Stars</option>
                      <option value="updated">Recently Updated</option>
                      <option value="forks">Most Forks</option>
                    </select>
                  </div>

                  <div className="filter-group-alt" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>RECENCY PULSE</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {['all', 'day', 'week', 'month'].map(p => (
                        <button key={p} onClick={() => handleFilterChange('recency', p)} style={{ 
                          flex: 1, padding: '0.4rem', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)',
                          background: filters.recency === p ? 'var(--accent-primary)' : 'transparent',
                          color: filters.recency === p ? 'white' : 'var(--text-secondary)'
                        }}>
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group-alt">
                    <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>PROJECT DENSITY</label>
                    <select className="search-select" style={{ width: '100%', marginTop: '0.5rem' }} value={filters.minStars} onChange={(e) => handleFilterChange('minStars', e.target.value)}>
                      <option value="0">Any Density</option>
                      <option value="1000">Gems (>1k)</option>
                      <option value="10000">Leaders (>10k)</option>
                      <option value="50000">Giants (>50k)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="explorer-scroll-container">
            {activeSubtopic && (
              <RepoList 
                key={`${activeSubtopic.id}-${JSON.stringify(filters)}`}
                query={getFullQuery()} 
                title="" 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Categories;