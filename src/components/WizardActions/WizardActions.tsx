import React from 'react';
import styles from './WizardActions.module.css';

interface WizardActionsProps {
  onSkip: () => void;
  onConfirm: () => void;
  skipLabel?: string;
  confirmLabel?: string;
  isLastStep?: boolean;
}

export const WizardActions: React.FC<WizardActionsProps> = ({
  onSkip,
  onConfirm,
  skipLabel,
  confirmLabel = 'Confirm',
  isLastStep = false,
}) => {
  const defaultSkipLabel = isLastStep ? 'Go to the next step' : 'Skip for now';

  return (
    <div className={styles.wizardActions}>
      <button className={styles.secondaryButton} onClick={onSkip}>
        {skipLabel || defaultSkipLabel}
      </button>
      <button className={styles.primaryButton} onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  );
};

