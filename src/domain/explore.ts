// Domain models for Explore page

export type ExploreItemType = 'post' | 'pet' | 'user';

export interface ExploreItem {
  type: ExploreItemType;
  data: any; // Will be typed based on type field
}

export interface ExploreResponse {
  seed: string;
  items: ExploreItem[];
}

export interface ExplorePostItem extends ExploreItem {
  type: 'post';
  data: {
    id: string;
    content: string;
    mediaUrls?: string[];
    author: {
      id: string;
      username: string;
      avatarUrl?: string;
    };
    likeCount: number;
    commentCount: number;
    createdAt: string;
  };
}

export interface ExplorePetItem extends ExploreItem {
  type: 'pet';
  data: {
    id: string;
    name: string;
    avatarUrl?: string;
    species?: string;
    breed?: string;
    owner: {
      id: string;
      username: string;
    };
    followerCount: number;
  };
}

export interface ExploreUserItem extends ExploreItem {
  type: 'user';
  data: {
    id: string;
    username: string;
    avatarUrl?: string;
    petCount: number;
    followerCount: number;
    isFollowing?: boolean;
  };
}

export type ExploreItemUnion = ExplorePostItem | ExplorePetItem | ExploreUserItem;

export interface ExploreParams {
  limit?: number;
  seed?: string;
  include?: string; // 'post,pet,user'
}

