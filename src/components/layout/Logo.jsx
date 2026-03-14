import React from 'react';

const Logo = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10", 
    large: "w-12 h-12"
  };

  return (
    <div className={`logo-container ${sizeClasses[size]}`}>
   
    </div>
  );
};

export default Logo;
