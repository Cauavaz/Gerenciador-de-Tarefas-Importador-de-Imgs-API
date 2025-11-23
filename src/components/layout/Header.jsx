import React from 'react';

const Header = ({ title = "Lista de Tarefas", isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className={`app-header ${isMenuOpen ? '' : 'minimized'}`}>
      <div className="header-content">
        <button className={`header-toggle-btn ${!isMenuOpen ? 'visible' : ''}`} onClick={() => setIsMenuOpen(true)}>
          <i className="fas fa-bars"></i>
        </button>
        <h1>{title}</h1>
      </div>
    </header>
  );
};

export default Header;
