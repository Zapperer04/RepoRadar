import React, { useState, useEffect, useRef } from 'react';
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
  const [activeSubtopic, setActiveSubtopic] = useState(topicTrees[0].subtopics[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const modalRef = useRef();

  const [appliedFilters, setAppliedFilters] = useState({
    sort: 'stars',
    minStars: '0',
    recency: 'all'
  });

  const [stagedFilters, setStagedFilters] = useState({ ...appliedFilters });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsFilterModalOpen(false);
      }
    };
    if (isFilterModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterModalOpen]);

  const handleTreeClick = (tree) => {
    setActiveTreeId(tree.id);
    if (tree.subtopics && tree.subtopics.length > 0) {
      setActiveSubtopic(tree.subtopics[0]);
    }
  };

  const getCleanSearchQuery = () => {
    if (!activeSubtopic) return '';
    let q = activeSubtopic.query;
    if (appliedFilters.minStars !== '0') q += `+stars:>${appliedFilters.minStars}`;
    if (appliedFilters.recency !== 'all') {
      const date = new Date();
      if (appliedFilters.recency === 'day') date.setDate(date.getDate() - 1);
      if (appliedFilters.recency === 'week') date.setDate(date.getDate() - 7);
      if (appliedFilters.recency === 'month') date.setDate(date.getDate() - 30);
      q += `+pushed:>${date.toISOString().split('T')[0]}`;
    }
    return q;
  };

  const applyFilters = () => {
    setAppliedFilters({ ...stagedFilters });
    setIsFilterModalOpen(false);
  };

  const filteredTrees = topicTrees.filter(tree => 
    tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.subtopics.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="topic-explorer-page">
      <div className="explorer-dashboard-layout">
        <aside className="explorer-sidebar">
          <div className="sidebar-search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search domains..." 
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
                  onClick={() => handleTreeClick(tree)}
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
          <header className="explorer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem' }}>
            <div className="header-text">
              <h2 className="explorer-title" style={{ margin: 0 }}>
                {activeSubtopic ? activeSubtopic.name : "Discovery Hub"}
              </h2>
              <p className="explorer-subtitle" style={{ margin: 0, opacity: 0.6 }}>
                Landscape Audit | {appliedFilters.sort.toUpperCase()}
              </p>
            </div>
            
            <button 
              className="search-btn" 
              onClick={() => {
                setStagedFilters({ ...appliedFilters });
                setIsFilterModalOpen(true);
              }}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '50px' }}
            >
              ⚙️ Filters
            </button>
          </header>

          {isFilterModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content" ref={modalRef} style={{ maxWidth: '500px', height: 'auto' }}>
                <div className="modal-header">
                  <h3 style={{ margin: 0 }}>Refine Results</h3>
                  <button onClick={() => setIsFilterModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>
                
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="console-section">
                    <h4 className="console-label">Sort By</h4>
                    <div className="button-group-tabs">
                      {['stars', 'updated', 'forks'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => setStagedFilters(p => ({ ...p, sort: s }))} 
                          className={stagedFilters.sort === s ? 'active' : ''}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="console-section">
                    <h4 className="console-label">Timeline Pulse</h4>
                    <div className="button-group-tabs">
                      {['all', 'day', 'week', 'month'].map(r => (
                        <button 
                          key={r} 
                          onClick={() => setStagedFilters(p => ({ ...p, recency: r }))} 
                          className={stagedFilters.recency === r ? 'active' : ''}
                        >
                          {r.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="console-section">
                    <h4 className="console-label">Project Density</h4>
                    <select 
                      className="search-select console-select" 
                      value={stagedFilters.minStars} 
                      onChange={(e) => setStagedFilters(p => ({ ...p, minStars: e.target.value }))}
                    >
                      <option value="0">Any Star Count</option>
                      <option value="1000">Gems (>1k)</option>
                      <option value="10000">Leaders (>10k)</option>
                      <option value="50000">Giants (>50k)</option>
                    </select>
                  </div>

                  <button className="search-btn" onClick={applyFilters} style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="explorer-scroll-container">
            {activeSubtopic && (
              <RepoList 
                key={`${activeSubtopic.id}-${JSON.stringify(appliedFilters)}`}
                query={getCleanSearchQuery()} 
                sort={appliedFilters.sort}
                order="desc"
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