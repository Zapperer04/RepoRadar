import React from 'react';

const Badge = ({ children, variant = 'muted', className = '', ...props }) => {
  const baseClass = 'rr-badge';
  const variantClass = variant ? `rr-badge-${variant}` : '';
  
  const combinedClassName = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClassName} {...props}>
      {children}
    </span>
  );
};

export default Badge;
