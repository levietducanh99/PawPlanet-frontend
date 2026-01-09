import { ExploreItemDTO } from '@/services/api/api';
import { ExploreItemUnion, ExplorePostItem, ExplorePetItem, ExploreUserItem } from '@/domain/explore';

/**
 * Map ExploreItemDTO from API to frontend domain models
 */
export function mapExploreItem(dto: ExploreItemDTO): ExploreItemUnion | null {
  if (!dto.type || !dto.data) {
    console.warn('⚠️ Invalid explore item - missing type or data:', dto);
    return null;
  }

  try {
    switch (dto.type) {
      case 'post':
        return mapExplorePost(dto);
      case 'pet':
        return mapExplorePet(dto);
      case 'user':
        return mapExploreUser(dto);
      default:
        console.warn('⚠️ Unknown explore item type:', dto.type, dto);
        return null;
    }
  } catch (error) {
    console.error('❌ Error mapping explore item:', error);
    console.error('Failed item data:', dto);
    return null;
  }
}

function mapExplorePost(dto: ExploreItemDTO): ExplorePostItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = dto.data as any;

  // Backend returns authorId and authorUsername directly in data
  const authorId = data.authorId?.toString() || '';
  const authorUsername = data.authorUsername || 'Unknown User';
  const authorAvatar = data.authorAvatar || data.authorAvatarUrl;

  return {
    type: 'post',
    data: {
      id: data.id?.toString() || '',
      content: data.content || '',
      mediaUrls: data.media || data.mediaUrls || [],
      author: {
        id: authorId,
        username: authorUsername,
        avatarUrl: authorAvatar,
      },
      likeCount: data.likeCount || 0,
      commentCount: data.commentCount || 0,
      createdAt: data.createdAt || new Date().toISOString(),
    },
  };
}

function mapExplorePet(dto: ExploreItemDTO): ExplorePetItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = dto.data as any;

  return {
    type: 'pet',
    data: {
      id: data.id?.toString() || '',
      name: data.name || 'Unknown Pet',
      avatarUrl: data.avatarUrl || data.avatar,
      species: data.species || data.speciesName,
      breed: data.breed || data.breedName,
      owner: {
        id: data.owner?.id?.toString() || data.ownerId?.toString() || '',
        username: data.owner?.username || data.ownerUsername || 'Unknown',
      },
      followerCount: data.followerCount || data.followers || 0,
    },
  };
}

function mapExploreUser(dto: ExploreItemDTO): ExploreUserItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = dto.data as any;

  return {
    type: 'user',
    data: {
      id: data.id?.toString() || '',
      username: data.username || 'Unknown',
      avatarUrl: data.avatarUrl || data.avatar,
      petCount: data.petCount || data.pets || 0,
      followerCount: data.followerCount || data.followers || 0,
      isFollowing: data.isFollowing || false,
    },
  };
}

/**
 * Map array of ExploreItemDTOs, filtering out any null results
 */
export function mapExploreItems(dtos: ExploreItemDTO[]): ExploreItemUnion[] {
  return dtos
    .map(mapExploreItem)
    .filter((item): item is ExploreItemUnion => item !== null);
}

