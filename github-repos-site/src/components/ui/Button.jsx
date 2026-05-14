import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClass = 'rr-btn';
  const variantClass = variant ? `rr-btn-${variant}` : '';
  const sizeClass = size !== 'md' ? `rr-btn-${size}` : '';
  
  const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
