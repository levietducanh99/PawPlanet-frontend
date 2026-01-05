/**
 * Authentication service - adapter boundary between UI and backend API
 * Uses generated API clients and maps to frontend domain models
 */

import { AuthenticationApi } from '@/services/api/api';
import { apiClient } from '@/services/apiConfig';
import type { LoginCredentials, RegisterCredentials, LoginResult, RegisterResult, AuthError } from '@/domain/auth';
import { mapToLoginRequest, mapToRegisterRequest, mapLoginResult, mapRegisterResult } from '@/mappers/auth.mapper';

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

      const authResponse = await this.authApi.login({
        loginRequest
      });

      // Optional: Get user profile after successful login
      // This would require the token to be set in the config first
      // For now, we'll just return the auth token

      return mapLoginResult(authResponse.data);

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
   * Register new user account
   * @param credentials - Register credentials
   * @returns Promise with register result or throws AuthError
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResult> {
    try {
      const registerRequest = mapToRegisterRequest(credentials);

      const registerResponse = await this.authApi.register({
        registerRequest
      });

      return mapRegisterResult(registerResponse.data);

    } catch (error: any) {
      console.error('Registration failed:', error);

      const authError: AuthError = {
        message: error.response?.data?.message || 'Registration failed. Please try again.',
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
}

// Export singleton instance
export const authService = new AuthService();
