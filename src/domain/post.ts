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

export interface PetTimeline {
  petId: number;
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
}

export interface CreatePostRequest {
  content: string;
  petId: number;
  mediaUrls?: string[];
  tags?: string[];
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
