/**
 * Hook for handling user logout functionality
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuthContext } from '@/context/AuthContext';

interface UseLogoutReturn {
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useLogout = (): UseLogoutReturn => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout: contextLogout, loading } = useAuthContext();

  const logout = async (): Promise<void> => {
    setError(null);

    try {
      // Use AuthContext logout which handles state updates
      await contextLogout();

      // Show success message
      message.success('Logged out successfully!');

      // Redirect to home page
      navigate('/');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
      console.error('Logout error:', err);
      message.warning('Logged out locally (server error)');
      navigate('/');
    }
  };

  return {
    logout,
    loading,
    error
  };
};
