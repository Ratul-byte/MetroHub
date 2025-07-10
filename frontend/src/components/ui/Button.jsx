import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full p-2 text-white rounded-md ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
