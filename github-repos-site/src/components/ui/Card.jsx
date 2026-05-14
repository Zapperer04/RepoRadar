import React from 'react';

export const CardHeader = ({ children, className = '' }) => (
  <div className={`rr-card-header ${className}`.trim()}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`rr-card-title ${className}`.trim()}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`rr-card-description ${className}`.trim()}>
    {children}
  </p>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`rr-card-footer ${className}`.trim()}>
    {children}
  </div>
);

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`rr-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default Card;
