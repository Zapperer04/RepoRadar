import React from 'react';

const Input = ({ className = '', type = 'text', ...props }) => {
  return (
    <input 
      type={type} 
      className={`rr-input ${className}`.trim()} 
      {...props} 
    />
  );
};

export default Input;
