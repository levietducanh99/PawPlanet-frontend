/**
 * User Service
 * Handles user profile operations
 * Service layer that wraps OpenAPI generated code
 */

import { UserControllerApi, Configuration } from './api';
import apiClient from './apiConfig';
import type { User, UpdateProfileRequest } from '@/domain/auth';
import { mapUserProfileDTOToUser } from '@/mappers/user.mapper';

// Create API configuration
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Initialize API client
const userApi = new UserControllerApi(apiConfiguration, undefined, apiClient);

export interface UserService {
  getMyProfile(): Promise<User>;
  getUserProfile(userId: number): Promise<User>;
}

export const userService: UserService = {
  /**
   * Get current user's profile
   */
  async getMyProfile(): Promise<User> {
    try {
      const response = await userApi.getMyProfile();
      return mapUserProfileDTOToUser(response.data);
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  },

  /**
   * Get another user's profile by ID
   */
  async getUserProfile(userId: number): Promise<User> {
    try {
      const response = await userApi.getUserProfile({ id: userId });
      return mapUserProfileDTOToUser(response.data);
    } catch (error) {
      console.error(`Error fetching user profile (${userId}):`, error);
      throw error;
    }
  },
};

