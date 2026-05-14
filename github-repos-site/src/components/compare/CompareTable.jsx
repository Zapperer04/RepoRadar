import React from 'react';
import PropTypes from 'prop-types';

const CompareTable = ({ repos, onClose }) => {
  if (repos.length < 2) return null;

  const repoA = repos[0];
  const repoB = repos[1];

  const metrics = [
    {
      label: 'Maturity Risk',
      calc: (r) => {
        const years = (new Date() - new Date(r.created_at)) / (1000 * 60 * 60 * 24 * 365);
        if (years > 3) return { val: 'Low Risk', desc: 'Mature & Stable', class: 'health-high' };
        if (years > 1) return { val: 'Moderate', desc: 'Established ecosystem', class: 'health-mid' };
        return { val: 'Experimental', desc: 'New - potential breaking changes', class: 'health-low' };
      }
    },
    {
      label: 'Maintenance Pulse',
      calc: (r) => {
        const days = (new Date() - new Date(r.pushed_at)) / (1000 * 60 * 60 * 24);
        if (days < 7) return { val: 'High Velocity', desc: 'Daily/Weekly updates', class: 'health-high' };
        if (days < 30) return { val: 'Active', desc: 'Monthly maintenance', class: 'health-mid' };
        return { val: 'Dormant', desc: 'No recent activity', class: 'health-low' };
      }
    },
    {
      label: 'Community Density',
      calc: (r) => {
        const density = r.stargazers_count / 1000;
        if (density > 10) return { val: 'Massive', desc: 'Large ecosystem support', class: 'health-high' };
        if (density > 1) return { val: 'Solid', desc: 'Reliable community', class: 'health-mid' };
        return { val: 'Emerging', desc: 'Niche / Early adopters', class: 'health-low' };
      }
    }
  ];

  return (
    <div className="comparison-audit-overlay">
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>📊 Strategic Audit</h2>
          <p className="page-subtitle" style={{ margin: 0 }}>Side-by-side decision logic for tool adoption.</p>
        </div>
        <button onClick={onClose} className="search-btn" style={{ background: 'transparent' }}>✕ Close Audit</button>
      </div>

      <div className="audit-grid">
        <div className="audit-label" style={{ border: 'none' }}></div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>{repoA.name}</h3>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>{repoB.name}</h3>
        </div>

        {metrics.map((m, i) => {
          const resA = m.calc(repoA);
          const resB = m.calc(repoB);
          
          return (
            <div key={i} className="audit-row">
              <div className="audit-label">{m.label}</div>
              <div className="audit-value">
                <span className={`health-badge ${resA.class}`} style={{ width: 'fit-content' }}>{resA.val}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{resA.desc}</p>
              </div>
              <div className="audit-value">
                <span className={`health-badge ${resB.class}`} style={{ width: 'fit-content' }}>{resB.val}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{resB.desc}</p>
              </div>
            </div>
          );
        })}

        <div className="audit-row">
          <div className="audit-label">Radar Verdict</div>
          <div className={`audit-value ${repoA.stargazers_count > repoB.stargazers_count ? 'winner' : ''}`}>
            <strong style={{ color: 'var(--accent-primary)' }}>
              {repoA.stargazers_count > repoB.stargazers_count ? '🏆 Ecosystem Leader' : '🔍 Strategic Challenger'}
            </strong>
          </div>
          <div className={`audit-value ${repoB.stargazers_count > repoA.stargazers_count ? 'winner' : ''}`}>
            <strong style={{ color: 'var(--accent-primary)' }}>
              {repoB.stargazers_count > repoA.stargazers_count ? '🏆 Ecosystem Leader' : '🔍 Strategic Challenger'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

CompareTable.propTypes = {
  repos: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CompareTable;
