import React from 'react';
import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className={styles.stepIndicator}>
      <div className={styles.stepLabel}>Step</div>
      <div className={styles.stepNumber}>
        {currentStep}
        <span className={styles.stepTotal}>/{totalSteps}</span>
      </div>
    </div>
  );
};

