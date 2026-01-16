import React, { ReactNode } from 'react';
import { AVAILABLE_BACKGROUNDS, type BackgroundId } from '@/constants/backgrounds';
import styles from './BackgroundWrapper.module.css';

interface BackgroundWrapperProps {
  backgroundId: BackgroundId;
  children: ReactNode;
  className?: string;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  backgroundId,
  children,
  className = '',
}) => {
  const background = AVAILABLE_BACKGROUNDS.find(bg => bg.id === backgroundId);
  const backgroundPath = background?.path;

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      style={{
        backgroundImage: backgroundPath ? `url(${backgroundPath})` : undefined,
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

