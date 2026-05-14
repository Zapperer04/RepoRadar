import React from 'react';

const Skeleton = ({ className = '', style = {}, ...props }) => {
  return (
    <div 
      className={`rr-skeleton ${className}`.trim()} 
      style={style}
      {...props} 
    />
  );
};

export default Skeleton;
