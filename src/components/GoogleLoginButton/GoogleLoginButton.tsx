import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { message } from 'antd';
import { authService } from '@/services/auth.service';
import { useAuthContext } from '@/context/AuthContext';
import styles from './GoogleLoginButton.module.css';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError
}) => {
  const { loginWithToken } = useAuthContext();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      // credentialResponse.credential is the ID token (JWT)
      const idToken = credentialResponse.credential;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      console.log('Google ID Token received (first 50 chars):', idToken.substring(0, 50) + '...');

      // Call backend API with Google ID token
      const backendResponse = await authService.loginWithGoogle(idToken);

      console.log('Backend response:', backendResponse);

      if (backendResponse.success && backendResponse.token?.token) {
        // Update AuthContext with backend JWT token
        loginWithToken(backendResponse.token.token, backendResponse.user);

        message.success('Successfully logged in with Google!');
        onSuccess?.();
      } else {
        throw new Error('Login failed - no token received from backend');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      message.error(errorMessage);
      onError?.(errorMessage);
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    const errorMessage = 'Google login was cancelled or failed';
    message.error(errorMessage);
    onError?.(errorMessage);
  };

  return (
    <div className={styles.googleLoginWrapper}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        size="large"
        theme="outline"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
};

