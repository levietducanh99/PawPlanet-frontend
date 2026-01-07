/**
 * Authentication service - adapter boundary between UI and backend API
 * Uses generated API clients and maps to frontend domain models
 */

import { AuthenticationApi } from '@/services/api/api';
import { apiClient } from '@/services/apiConfig';
import type { LoginCredentials, LoginResult, AuthError, RegisterCredentials } from '@/domain/auth';
import { mapToLoginRequest, mapLoginResult } from '@/mappers/auth.mapper';

class AuthService {
  private authApi: AuthenticationApi;

  constructor() {
    this.authApi = new AuthenticationApi(undefined, undefined, apiClient);
  }

  /**
   * Login user with email and password
   * @param credentials - Login credentials
   * @returns Promise with login result or throws AuthError
   */
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const loginRequest = mapToLoginRequest(credentials);
      console.log('Sending login request:', { email: loginRequest.email });

      const authResponse = await this.authApi.login({
        loginRequest
      });

      console.log('Auth API response received:', authResponse.data);

      // Optional: Get user profile after successful login
      // This would require the token to be set in the config first
      // For now, we'll just return the auth token

      const loginResult = mapLoginResult(authResponse.data);
      console.log('Login result mapped:', {
        success: loginResult.success,
        hasToken: !!loginResult.token?.token,
        authenticated: loginResult.token?.authenticated
      });

      return loginResult;

    } catch (error: any) {
      console.error('Login failed:', error);

      const authError: AuthError = {
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        code: error.response?.status?.toString()
      };

      throw authError;
    }
  }

  /**
   * Logout current user
   * @param token - JWT token to logout
   */
  async logout(token: string): Promise<void> {
    try {
      await this.authApi.logout({
        logoutRequest: { token }
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      // Don't throw error for logout - it's not critical
    }
  }

  /**
   * Verify if token is still valid
   * @param token - JWT token to verify
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.authApi.introspect({
        introspectRequest: { token }
      });

      return response.data.result?.valid || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh authentication token
   * @param token - Current JWT token
   */
  async refreshToken(token: string): Promise<LoginResult> {
    try {
      const response = await this.authApi.refreshToken({
        introspectRequest: { token }
      });

      return mapLoginResult(response.data);
    } catch (error: any) {
      const authError: AuthError = {
        message: 'Token refresh failed. Please login again.',
        code: error.response?.status?.toString()
      };

      throw authError;
    }
  }

  /**
   * Register new user
   * @param credentials - Registration credentials
   * @returns Promise with registration result
   */
  async register(credentials: RegisterCredentials): Promise<LoginResult> {
    try {
      // For now, return mock response since register API might not be implemented
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay

      return {
        success: true,
        token: {
          token: 'mock_token_' + Date.now(),
          authenticated: true
        },
        user: {
          id: Date.now(),
          username: credentials.username,
          email: credentials.email,
          avatarUrl: undefined,
          bio: undefined
        }
      };
    } catch (error: any) {
      const authError: AuthError = {
        message: error.response?.data?.message || 'Registration failed',
        code: error.response?.status?.toString() || 'REGISTER_FAILED'
      };

      throw authError;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
