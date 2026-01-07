/**
 * Post & Timeline Service Mock Implementation
 *
 * Mock service for timeline and post features without real API calls.
 */

import type { Post, PetTimeline, CreatePostRequest, Comment, PetProfile } from '@/domain/post';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock pet profiles
const mockPetProfiles: PetProfile[] = [
  {
    id: 1,
    name: 'Maxi',
    breed: 'Border Collie',
    age: '3 years',
    gender: 'Male',
    size: 'Medium',
    weight: '27.1 kg',
    color: 'Brown/Dark White mix, with light markings about pet\'s chest and nose.',
    about: 'All pets featuring Maxi, your beloved Border Collie.',
    avatarUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop&crop=face',
    photoLibrary: [
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
    ],
    isVisible: true,
    lookingForAdoption: false,
    specialTraits: ['Appearance and distinctive signs'],
    importantDates: {
      birthday: '6 January 2023',
      adoptionDay: '1 January 2023',
      microchipDay: '6 January 2023'
    },
    caretakers: ['Esther Howard', 'Guy Hawkins']
  }
];

// Mock posts data
const mockPosts: Post[] = [
  {
    id: 1,
    content: 'Morning fun with Maxi! He absolutely loves the outdoors and never runs out of energy! Best starting day ✨',
    authorName: 'Guy Hawkins',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    petId: 1,
    petName: 'Maxi',
    createdAt: '2024-01-05T08:30:00Z',
    likeCount: 164,
    commentCount: 12,
    shareCount: 5,
    isLiked: false,
    media: [
      {
        id: 1,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600&h=400&fit=crop',
        displayOrder: 1
      }
    ],
    tags: ['morning', 'outdoor', 'energy']
  },
  {
    id: 2,
    content: 'Training session went amazing today! Maxi learned new tricks in only one day, even though I was skeptical. He is absolutely loves the outdoors and never runs out of energy! Best getting closer 🐕',
    authorName: 'Esther Howard',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    petId: 1,
    petName: 'Maxi',
    createdAt: '2024-01-04T15:45:00Z',
    likeCount: 203,
    commentCount: 8,
    shareCount: 12,
    isLiked: true,
    media: [
      {
        id: 2,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop',
        displayOrder: 1
      }
    ],
    tags: ['training', 'tricks', 'smart']
  },
  {
    id: 3,
    content: 'Celebrating Maxi\'s birthday today! Can\'t believe how big little Alex has grown into such a heavy and well-loved companion 🎂',
    authorName: 'Guy Hawkins',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    petId: 1,
    petName: 'Maxi',
    createdAt: '2024-01-03T12:20:00Z',
    likeCount: 342,
    commentCount: 24,
    shareCount: 18,
    isLiked: false,
    media: [
      {
        id: 3,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',
        displayOrder: 1
      }
    ],
    tags: ['birthday', 'celebration', 'growth']
  }
];

// Mock user pets (empty for demo)
const mockUserPets: any[] = [];

/**
 * Mock: Get pet profile by ID
 */
export const getPetProfile = async (petId: number): Promise<PetProfile | null> => {
  await mockDelay(600);

  const profile = mockPetProfiles.find(p => p.id === petId);
  return profile ? { ...profile } : null;
};

/**
 * Mock: Get pet timeline
 */
export const getPetTimeline = async (petId: number, page: number = 1, limit: number = 10): Promise<PetTimeline> => {
  await mockDelay(800);

  const petPosts = mockPosts.filter(post => post.petId === petId);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = petPosts.slice(startIndex, endIndex);

  return {
    petId,
    posts: paginatedPosts.map(post => ({ ...post })),
    totalCount: petPosts.length,
    hasMore: endIndex < petPosts.length
  };
};

/**
 * Mock: Get user's pets
 */
export const getUserPets = async (): Promise<any[]> => {
  await mockDelay(500);

  return [...mockUserPets];
};

/**
 * Mock: Create new post
 */
export const createPost = async (request: CreatePostRequest): Promise<Post> => {
  await mockDelay(1000);

  const newId = Math.max(...mockPosts.map(p => p.id)) + 1;
  const newPost: Post = {
    id: newId,
    content: request.content,
    authorName: 'Current User',
    authorAvatar: 'https://i.pravatar.cc/150?img=10',
    petId: request.petId,
    petName: 'User Pet',
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isLiked: false,
    media: request.mediaUrls?.map((url, index) => ({
      id: Date.now() + index,
      type: 'image' as const,
      url,
      displayOrder: index + 1
    })) || [],
    tags: request.tags || []
  };

  mockPosts.unshift(newPost);
  return { ...newPost };
};

/**
 * Mock: Like/unlike post
 */
export const togglePostLike = async (postId: number, isLiked: boolean): Promise<void> => {
  await mockDelay(300);

  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.isLiked = !isLiked;
    post.likeCount += isLiked ? -1 : 1;
  }
};

/**
 * Mock: Get post comments
 */
export const getPostComments = async (postId: number): Promise<Comment[]> => {
  await mockDelay(600);

  console.log(`Mock: Fetching comments for post ${postId}`);

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: 1,
      content: 'Such a beautiful pet! 😍',
      authorName: 'Alice Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?img=2',
      createdAt: '2024-01-05T09:15:00Z',
      likeCount: 5,
      isLiked: false
    },
    {
      id: 2,
      content: 'Amazing training progress!',
      authorName: 'Bob Wilson',
      authorAvatar: 'https://i.pravatar.cc/150?img=3',
      createdAt: '2024-01-05T10:30:00Z',
      likeCount: 3,
      isLiked: true
    }
  ];

  return mockComments;
};

/**
 * Mock: Add pet to favorites
 */
export const addToFavorites = async (petId: number): Promise<void> => {
  await mockDelay(400);
  console.log(`Added pet ${petId} to favorites`);
};

/**
 * Mock: Share post
 */
export const sharePost = async (postId: number): Promise<void> => {
  await mockDelay(500);

  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.shareCount += 1;
  }
};
