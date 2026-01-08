/**
 * Post & Timeline Service Mock Implementation
 *
 * Mock service for timeline and post features without real API calls.
 */

import type { Post, PetTimeline, CreatePostRequest, Comment, PetProfile, TimelineFeed } from '@/domain/post';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock timeline feed posts
const mockTimelinePosts: Post[] = [
  {
    id: 101,
    content: "Just had the best walk with Maxi at Central Park! 🐕 The weather was perfect and he made so many new friends. Nothing beats these morning adventures! #PuppyLife #CentralPark",
    authorId: 1,
    authorName: "Sarah Chen",
    authorUsername: "sarah_chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
    petId: 1,
    petName: "Maxi",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likeCount: 24,
    commentCount: 8,
    shareCount: 3,
    isLiked: true,
    type: 'general',
    location: "Central Park, NYC",
    media: [
      {
        id: 201,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=500&h=400&fit=crop',
        displayOrder: 1
      },
      {
        id: 202,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&h=400&fit=crop',
        displayOrder: 2
      }
    ],
    tags: ['PuppyLife', 'CentralPark']
  },
  {
    id: 102,
    content: "🚨 LOST CAT ALERT 🚨\n\nOur beloved Luna went missing yesterday evening near Sunset Boulevard. She's a 2-year-old orange tabby with white paws and a pink collar. Please contact us if you see her! We miss her so much 💔",
    authorId: 2,
    authorName: "Mike Rodriguez",
    authorUsername: "mike_rod",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    petId: 2,
    petName: "Luna",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    likeCount: 47,
    commentCount: 23,
    shareCount: 31,
    isLiked: false,
    type: 'lost',
    location: "Sunset Boulevard, LA",
    contactInfo: "Call (555) 123-4567",
    media: [
      {
        id: 203,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop',
        displayOrder: 1
      }
    ],
    tags: ['LostCat', 'Help', 'SunsetBoulevard']
  },
  {
    id: 103,
    content: "Teaching Bella some new tricks today! She's getting so good at 'roll over' and 'play dead'. Smart cookies deserve treats 🍪✨ Who else is working on training with their pups?",
    authorId: 3,
    authorName: "Emily Watson",
    authorUsername: "emily_w",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    petId: 3,
    petName: "Bella",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    likeCount: 19,
    commentCount: 12,
    shareCount: 2,
    isLiked: true,
    type: 'story',
    media: [
      {
        id: 204,
        type: 'video',
        url: 'https://videos.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&h=400&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&h=400&fit=crop',
        displayOrder: 1
      }
    ],
    tags: ['DogTraining', 'SmartPup']
  },
  {
    id: 104,
    content: "💕 ADOPTION SUCCESS STORY! 💕\n\nAfter 6 months in our care, Charlie finally found his forever home! Look how happy he is with his new family. Thank you to everyone who shared his story. This is why we do what we do! 🏡❤️",
    authorId: 4,
    authorName: "Paws & Hearts Rescue",
    authorUsername: "pawshearts_rescue",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    petId: 4,
    petName: "Charlie",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    likeCount: 156,
    commentCount: 34,
    shareCount: 28,
    isLiked: true,
    type: 'adoption',
    media: [
      {
        id: 205,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=400&fit=crop',
        displayOrder: 1
      },
      {
        id: 206,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=400&fit=crop',
        displayOrder: 2
      }
    ],
    tags: ['AdoptionSuccess', 'ForeverHome', 'Rescue']
  },
  {
    id: 105,
    content: "Milo discovered snow for the first time today! ❄️ His reactions were absolutely priceless. From confused sniffing to full-on snow zoomies in 30 seconds flat 😂",
    authorId: 5,
    authorName: "David Kim",
    authorUsername: "david_k",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    petId: 5,
    petName: "Milo",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    likeCount: 89,
    commentCount: 16,
    shareCount: 7,
    isLiked: false,
    type: 'story',
    media: [
      {
        id: 207,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=400&fit=crop',
        displayOrder: 1
      }
    ],
    tags: ['FirstSnow', 'PuppyReactions']
  },
  {
    id: 106,
    content: "🐱 FOUND CAT UPDATE 🐱\n\nThe beautiful calico we found yesterday has been reunited with her family! Thank you to everyone who helped share the post. Social media really does work miracles! 💫",
    authorId: 6,
    authorName: "Jennifer Adams",
    authorUsername: "jen_adams",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likeCount: 73,
    commentCount: 11,
    shareCount: 4,
    isLiked: true,
    type: 'found',
    media: [],
    tags: ['FoundCat', 'HappyEnding']
  }
];

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
    authorId: 1,
    authorName: 'Guy Hawkins',
    authorUsername: 'guy_hawkins',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    petId: 1,
    petName: 'Maxi',
    createdAt: '2024-01-05T08:30:00Z',
    likeCount: 164,
    commentCount: 12,
    shareCount: 5,
    isLiked: false,
    type: 'story',
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
    authorId: 2,
    authorName: 'Esther Howard',
    authorUsername: 'esther_h',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    petId: 1,
    petName: 'Maxi',
    createdAt: '2024-01-04T15:45:00Z',
    likeCount: 203,
    commentCount: 8,
    shareCount: 12,
    isLiked: true,
    type: 'story',
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
    authorId: 1,
    authorName: 'Guy Hawkins',
    authorUsername: 'guy_hawkins',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    petId: 1,
    petName: 'Maxi',
    createdAt: '2024-01-03T12:20:00Z',
    likeCount: 342,
    commentCount: 24,
    shareCount: 18,
    isLiked: false,
    type: 'story',
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
    authorId: 1,
    authorName: 'Current User',
    authorUsername: 'current_user',
    authorAvatar: 'https://i.pravatar.cc/150?img=10',
    petId: request.petId,
    petName: 'User Pet',
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isLiked: false,
    type: 'general',
    media: request.mediaUrls?.map((url, index) => {
      const entry: any = url;
      // If entry is a string (legacy), treat as direct URL
      if (typeof entry === 'string') {
        return {
          id: Date.now() + index,
          type: 'image' as const,
          url: entry,
          displayOrder: index + 1
        };
      }
      // Otherwise expect object with publicId and type
      const publicId = entry.publicId ?? String(entry);
      const mediaType = entry.type ?? 'image';
      return {
        id: Date.now() + index,
        type: mediaType as 'image' | 'video',
        url: `https://res.cloudinary.com/demo/${mediaType}/upload/${publicId}`,
        displayOrder: index + 1
      };
    }) || [],
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

/**
 * Mock: Get timeline feed
 */
export const getTimelineFeed = async (limit: number = 10, lastPostId?: number): Promise<TimelineFeed> => {
  await mockDelay(600);

  let posts = [...mockTimelinePosts];

  // If lastPostId is provided, get posts after that point (pagination)
  if (lastPostId) {
    const lastIndex = posts.findIndex(p => p.id === lastPostId);
    if (lastIndex >= 0) {
      posts = posts.slice(lastIndex + 1);
    }
  }

  const paginatedPosts = posts.slice(0, limit);

  return {
    posts: paginatedPosts,
    hasMore: posts.length > limit,
    lastPostId: paginatedPosts.length > 0 ? paginatedPosts[paginatedPosts.length - 1].id : undefined
  };
};

/**
 * Mock: Toggle like on timeline post
 */
export const toggleTimelinePostLike = async (postId: number): Promise<{ isLiked: boolean; likeCount: number }> => {
  await mockDelay(300);

  const post = mockTimelinePosts.find(p => p.id === postId);
  if (!post) {
    throw new Error('Post not found');
  }

  post.isLiked = !post.isLiked;
  post.likeCount += post.isLiked ? 1 : -1;

  return {
    isLiked: post.isLiked,
    likeCount: post.likeCount
  };
};

/**
 * Mock: Create new timeline post
 */
export const createTimelinePost = async (postData: {
  content: string;
  type: 'general' | 'adoption' | 'lost' | 'found' | 'story';
  petIds?: number[];
  mediaUrls?: string[];
  location?: string;
  contactInfo?: string;
  tags?: string[];
}): Promise<Post> => {
  await mockDelay(1000);

  const newId = Math.max(...mockTimelinePosts.map(p => p.id)) + 1;
  const newPost: Post = {
    id: newId,
    content: postData.content,
    authorId: 1, // Current user
    authorName: "You",
    authorUsername: "current_user",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face",
    petId: postData.petIds?.[0],
    petName: postData.petIds?.[0] ? "Your Pet" : undefined,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isLiked: false,
    media: postData.mediaUrls?.map((url, index) => ({
      id: Date.now() + index,
      type: 'image' as const,
      url,
      displayOrder: index + 1
    })) || [],
    tags: postData.tags || [],
    type: postData.type,
    location: postData.location,
    contactInfo: postData.contactInfo
  };

  // Add to beginning of timeline
  mockTimelinePosts.unshift(newPost);
  return { ...newPost };
};

