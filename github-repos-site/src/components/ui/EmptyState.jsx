import React from 'react';

const EmptyState = ({ 
  title = 'No Data Found', 
  message = 'There is nothing to display here.', 
  icon = '📦', 
  className = '', 
  children 
}) => {
  return (
    <div className={`rr-empty-state ${className}`.trim()}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{message}</p>
      {children && <div>{children}</div>}
    </div>
  );
};

export default EmptyState;
