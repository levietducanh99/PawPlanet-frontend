import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';

/**
 * Example usage of the LandingPage component
 *
 * This shows how to integrate the landing page into your application.
 * The landing page is designed with:
 * - 3D animated logo with floating effects
 * - Giant search bar with animated placeholders
 * - Feature cards with hover animations
 * - Pet encyclopedia quick view modal
 * - Responsive design without Tailwind CSS
 */
export const LandingPageExample: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to login page or main app
    navigate('/login');
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
};

