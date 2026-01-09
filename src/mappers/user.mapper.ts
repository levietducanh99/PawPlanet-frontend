/**
 * User Mapper
 * Maps backend UserProfileDTO to frontend User domain model
 */

import type { UserProfileDTO } from '@/services/api';
import type { User } from '@/domain/auth';

/**
 * Map UserProfileDTO to User domain model
 */
export const mapUserProfileDTOToUser = (dto: UserProfileDTO): User => {
  return {
    id: dto.id || 0,
    username: dto.username || '',
    email: dto.email || '',
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl,
    coverImageUrl: dto.coverImageUrl,
    bio: dto.bio,
    role: dto.role,
    isVerified: dto.isVerified,
    createdAt: dto.createdAt,
    followersCount: dto.followersCount || 0,
    followingCount: dto.followingCount || 0,
    petsCount: dto.petsCount || 0,
    isMe: dto.isMe || false,
    isFollowing: dto.isFollowing || false,
    isFollowedBy: dto.isFollowedBy || false,
  };
};

