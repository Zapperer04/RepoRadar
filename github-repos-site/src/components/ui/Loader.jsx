import React from 'react';

const Loader = ({ className = '', ...props }) => {
  return (
    <div className={`rr-loader ${className}`.trim()} {...props} />
  );
};

export default Loader;
