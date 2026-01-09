/**
 * Follow Service
 * Handles user follow/unfollow operations
 */

import { FollowControllerApi, Configuration } from './api';
import apiClient from './apiConfig';

// Create API configuration
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Initialize API client
const followApi = new FollowControllerApi(apiConfiguration, undefined, apiClient);

export interface FollowerUser {
  id: number;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  isFollowing?: boolean;
}

export interface FollowService {
  getFollowers(userId: number): Promise<FollowerUser[]>;
  getFollowing(userId: number): Promise<FollowerUser[]>;
  follow(userId: number): Promise<void>;
  unfollow(userId: number): Promise<void>;
  isFollowing(userId: number): Promise<boolean>;
}

// Mapper function to convert backend DTO to frontend model
const mapToFollowerUser = (dto: any): FollowerUser => {
  return {
    id: dto.id || 0,
    username: dto.username || '',
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl,
    bio: dto.bio,
    isFollowing: dto.isFollowing,
  };
};

export const followService: FollowService = {
  // Get followers list for a user
  async getFollowers(userId: number): Promise<FollowerUser[]> {
    try {
      const response = await followApi.getFollowers({ id: userId });
      const data: any = response.data;
      // Handle both wrapped (result property) and direct array responses
      const followers = (data?.result || data || []) as any[];
      return followers.map(mapToFollowerUser);
    } catch (error) {
      console.error('Error fetching followers:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  // Get following list for a user
  async getFollowing(userId: number): Promise<FollowerUser[]> {
    try {
      const response = await followApi.getFollowing({ id: userId });
      const data: any = response.data;
      // Handle both wrapped (result property) and direct array responses
      const following = (data?.result || data || []) as any[];
      return following.map(mapToFollowerUser);
    } catch (error) {
      console.error('Error fetching following:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  // Follow a user
  async follow(userId: number): Promise<void> {
    try {
      await followApi.follow({ id: userId });
    } catch (error) {
      console.error('Error following user:', error);
      throw new Error('Failed to follow user. Please try again.');
    }
  },

  // Unfollow a user
  async unfollow(userId: number): Promise<void> {
    try {
      await followApi.unfollow({ id: userId });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw new Error('Failed to unfollow user. Please try again.');
    }
  },

  // Check if following a user
  async isFollowing(userId: number): Promise<boolean> {
    try {
      const response = await followApi.isFollowing({ id: userId });
      const data: any = response.data;
      // Handle both wrapped (result property) and direct boolean responses
      return (data?.result !== undefined ? data.result : data) as boolean;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }
};

