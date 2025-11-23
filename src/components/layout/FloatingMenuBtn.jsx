import React from 'react';

const FloatingMenuBtn = ({ setIsMenuOpen }) => {
  return (
    <button className="floating-menu-btn" onClick={() => setIsMenuOpen(true)}>
    </button>
  );
};

export default FloatingMenuBtn;
