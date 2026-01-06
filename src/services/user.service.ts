import { UserControllerApi, UserProfileDTO, Configuration } from './api';
import apiClient from './apiConfig';
import type { User } from '@/domain/auth';

// Create API configuration
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Initialize API client
const userApi = new UserControllerApi(apiConfiguration, undefined, apiClient);

export interface UserService {
  getMyProfile(): Promise<User>;
  getUserProfile(id: number): Promise<User>;
}

// Mapper function to convert UserProfileDTO to User domain model
const mapUserProfileToUser = (dto: UserProfileDTO): User => {
  return {
    id: dto.id || 0,
    email: dto.email || '',
    username: dto.username,
    avatarUrl: dto.avatarUrl,
    bio: dto.bio
  };
};

export const userService: UserService = {
  // Get current user profile
  async getMyProfile(): Promise<User> {
    try {
      const response = await userApi.getMyProfile();
      return mapUserProfileToUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to load user profile. Please try again.');
    }
  },

  // Get user profile by ID
  async getUserProfile(id: number): Promise<User> {
    try {
      const response = await userApi.getUserProfile({ id });
      return mapUserProfileToUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to load user profile.');
    }
  }
};
