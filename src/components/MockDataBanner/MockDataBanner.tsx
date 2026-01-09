import React from 'react';

interface MockDataBannerProps {
  show?: boolean;
}

export const MockDataBanner: React.FC<MockDataBannerProps> = () => {
  // Mock data is not allowed in this project.
  // This component is intentionally a no-op.
  return null;
};
