import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button' }) => {
  return (
    <button 
      type={type}
      className={`btn btn-${variant} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};
