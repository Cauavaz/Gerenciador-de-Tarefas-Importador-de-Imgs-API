import React from 'react';

const PageTitle = ({ title, isMenuOpen }) => {
  return (
    <div className={`page-title-container ${isMenuOpen ? '' : 'minimized'}`}>
      <h1 className="page-title">{title}</h1>
    </div>
  );
};

export default PageTitle;
