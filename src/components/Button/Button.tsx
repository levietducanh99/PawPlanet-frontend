import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...rest }) => {
  const cls = `btn btn--${variant} ${className}`.trim();
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
};

