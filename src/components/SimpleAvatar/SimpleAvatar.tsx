import React from 'react';
import './SimpleAvatar.css';
import placeholderAvatar from '../../assets/placeholder-avatar.svg';

interface SimpleAvatarProps {
  size?: number;
}

export const SimpleAvatar: React.FC<SimpleAvatarProps> = ({ size = 72 }) => {
  return (
    <div className="simple-avatar" style={{ width: size, height: size }}>
      <img src={placeholderAvatar} alt="Avatar" />
    </div>
  );
};

