import React from 'react';
import './SocialButton.css';

interface SocialButtonProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ label, onClick, children }) => {
  return (
    <button type="button" className="social-button" onClick={onClick}>
      <span className="social-button__icon">{children}</span>
      <span className="social-button__label">{label}</span>
    </button>
  );
};

