import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <p className="error-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
};
