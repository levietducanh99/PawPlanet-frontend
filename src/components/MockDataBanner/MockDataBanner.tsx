import React from 'react';
import { Alert } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';

interface MockDataBannerProps {
  show?: boolean;
}

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export const MockDataBanner: React.FC<MockDataBannerProps> = ({ show = isDevelopment }) => {
  if (!show) return null;

  return (
    <Alert
      message="Development Mode"
      description="Currently using mock data for UI development. Real API integration coming soon!"
      type="info"
      icon={<ExperimentOutlined />}
      showIcon
      closable
      style={{
        position: 'fixed',
        top: 80, // Below header
        left: 360, // After sidebar
        right: 20,
        zIndex: 1000,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    />
  );
};
