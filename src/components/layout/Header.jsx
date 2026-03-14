import React from 'react';
import Logo from './Logo';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className={`app-header ${isMenuOpen ? '' : 'minimized'}`}>
      <div className="header-content">
        <div className="logo-trigger">
          <Logo size="small" />
        </div>
      </div>
    </header>
  );
};

export default Header;
