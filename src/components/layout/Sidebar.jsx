import React from 'react';

const Sidebar = ({ isMenuOpen, setIsMenuOpen, activeView, setActiveView }) => {
  return (
    <aside 
      className={`sidebar ${isMenuOpen ? 'open' : 'minimized'}`}
      onMouseEnter={() => !isMenuOpen && setIsMenuOpen(true)}
      onMouseLeave={() => isMenuOpen && setIsMenuOpen(false)}
    >
      <div className="sidebar-header">
        <div className="header-content">
          <img 
            src="/img/logo.png" 
            alt="Logo" 
            className="sidebar-logo"
          />
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a 
              href="#" 
              onClick={(e) => {e.preventDefault(); setActiveView('tarefas');}} 
              className={activeView === 'tarefas' ? 'active' : ''}
              title={isMenuOpen ? '' : 'Tarefas'}
            >
              <span className="nav-icon"><i class="fas fa-tasks"></i></span>
              {isMenuOpen && <span className="nav-text">Tarefas</span>}
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => {e.preventDefault(); setActiveView('estatisticas');}} 
              className={activeView === 'estatisticas' ? 'active' : ''}
              title={isMenuOpen ? '' : 'Galeria de Imagens'}
            >
              <span className="nav-icon"><i class="fas fa-images"></i></span>
              {isMenuOpen && <span className="nav-text">Galeria de Imagens</span>}
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => {e.preventDefault(); setActiveView('configuracoes');}} 
              className={activeView === 'configuracoes' ? 'active' : ''}
              title={isMenuOpen ? '' : 'Configurações'}
            >
              <span className="nav-icon"><i class="fas fa-chart-line"></i></span>
              {isMenuOpen && <span className="nav-text">Dashboard</span>}
            </a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        {isMenuOpen && <p>CoteFácil v1.0</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
