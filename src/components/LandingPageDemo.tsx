import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { LandingPage } from '../pages/LandingPage';
import { theme } from '../theme/antdConfig';

/**
 * Standalone demo component for testing the Landing Page
 *
 * This component can be rendered directly to test the landing page
 * without needing the full app routing setup.
 *
 * Usage:
 * import { LandingPageDemo } from './components/LandingPageDemo';
 *
 * function App() {
 *   return <LandingPageDemo />;
 * }
 */
export const LandingPageDemo: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGetStarted = () => {
    console.log('Get Started clicked!');
    setShowSuccess(true);

    // Simulate navigation after 2 seconds
    setTimeout(() => {
      console.log('Would navigate to /login or /register here');
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <ConfigProvider theme={theme}>
      <div style={{ position: 'relative' }}>
        {/* Success notification overlay */}
        {showSuccess && (
          <div
            style={{
              position: 'fixed',
              top: 80,
              right: 24,
              zIndex: 9999,
              background: '#27AE60',
              color: '#FFFFFF',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(39, 174, 96, 0.3)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            ✅ Great! This would navigate to login/register
          </div>
        )}

        {/* Landing Page */}
        <LandingPage onGetStarted={handleGetStarted} />
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ConfigProvider>
  );
};

