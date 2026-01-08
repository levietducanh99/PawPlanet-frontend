/**
 * Frontend Domain Models for Posts & Timeline
 *
 * These types represent the frontend's view of post data,
 * independent of backend API structure.
 */

export interface Post {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  authorUsername: string;
  petId?: number;
  petName?: string;
  petAvatar?: string; // optional pet avatar for UI
  badge?: string; // optional badge text for author/pet
  petOwnerName?: string; // optional owner display name
  petDisplay?: string; // optional pet display (e.g., "Dog · Golden Retriever")
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  media: PostMedia[];
  tags?: string[];
  type: 'general' | 'adoption' | 'lost' | 'found' | 'story';
  location?: string;
  contactInfo?: string;
}

export interface TimelineFeed {
  posts: Post[];
  hasMore: boolean;
  lastPostId?: number;
}

export interface PostMedia {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  displayOrder: number;
}

/**
 * Media request format for creating posts
 * Backend expects publicId instead of full URL
 */
export interface PostMediaRequest {
  publicId: string;
  type: 'image' | 'video';
}

export interface PetTimeline {
  petId: number;
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
}

export interface CreatePostRequest {
  content: string;
  // Allow single petId (legacy) or multiple petIds (UI supports tagging multiple pets)
  petId?: number;
  petIds?: number[];
  // Frontend uses PostMediaRequest (publicId + type) when sending to backend
  mediaUrls?: PostMediaRequest[];
  tags?: string[];
  // Post type (general | rescue | lost ...)
  type?: 'general' | 'rescue' | 'lost' | 'found' | 'story';
  hashtags?: string;
}

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface PetProfile {
  id: number;
  name: string;
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  weight: string;
  color: string;
  about: string;
  avatarUrl?: string;
  photoLibrary: string[];
  isVisible: boolean;
  lookingForAdoption: boolean;
  specialTraits: string[];
  importantDates: {
    birthday?: string;
    adoptionDay?: string;
    microchipDay?: string;
  };
  caretakers: string[];
}
