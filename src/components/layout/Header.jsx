import React from 'react';
import Logo from './Logo';

const Header = ({ title = "Lista de Tarefas", isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className={`app-header ${isMenuOpen ? '' : 'minimized'}`}>
      <div className="header-content">
        <div className="logo-trigger">
          <Logo size="small" />
        </div>
        <h1>{title}</h1>
      </div>
    </header>
  );
};

export default Header;
