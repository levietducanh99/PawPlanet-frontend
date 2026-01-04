import React from 'react';
import { motion } from 'motion/react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = '#FFA940' }) => {
  return (
    <div className={styles.progressBar}>
      <motion.div
        className={styles.progressFill}
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

