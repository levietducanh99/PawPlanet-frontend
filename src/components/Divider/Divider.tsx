import React from 'react';
import './Divider.css';

interface DividerProps {
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ label = 'or continue with' }) => {
  return (
    <div className="divider">
      <span className="divider__line" />
      <span className="divider__label">{label}</span>
    </div>
  );
};

