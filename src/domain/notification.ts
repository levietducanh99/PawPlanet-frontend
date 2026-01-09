/**
 * Frontend Domain Models for Notifications
 *
 * These types represent the frontend's view of notification data,
 * independent of backend API structure.
 */

export interface NotificationMetadata {
  // Post-related metadata
  postId?: number;
  postPreview?: string;

  // Comment-related metadata
  commentId?: number;
  commentContent?: string;

  // Actor-related metadata (can override actor info)
  actorUsername?: string;
  actorAvatar?: string;

  // Pet-related metadata
  petId?: number;
  petName?: string;

  // System notification metadata
  message?: string;

  // Additional fields
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor;
  target?: NotificationTarget;
  metadata?: NotificationMetadata;
}

export interface NotificationActor {
  id: number;
  username: string;
  avatarUrl?: string;
}

export interface NotificationTarget {
  type: string;
  id: number;
}

export type NotificationType =
  | 'LIKE_POST'     // Someone liked your post
  | 'COMMENT_POST'  // Someone commented on your post
  | 'FOLLOW_USER'   // Someone followed you
  | 'FOLLOW_PET'    // Someone followed your pet
  | 'MENTION'       // Someone mentioned you
  | 'SHARE_POST'    // Someone shared your post
  | 'SYSTEM'        // System notification
  // Legacy types for compatibility
  | 'LIKE'
  | 'COMMENT'
  | 'FOLLOW'
  | 'TREAT'
  | 'PET_FOLLOW';

export interface NotificationList {
  notifications: Notification[];
  totalElements: number;
  page: number;
  size: number;
  hasMore: boolean;
}

export interface NotificationStats {
  unreadCount: number;
}

// Helper to get notification message
export const getNotificationMessage = (notification: Notification): string => {
  const actorName = notification.metadata?.actorUsername || notification.actor.username;
  const postPreview = notification.metadata?.postPreview;
  const petName = notification.metadata?.petName;

  switch (notification.type) {
    case 'LIKE_POST':
    case 'LIKE':
      if (postPreview) {
        return `${actorName} liked your post: "${postPreview}"`;
      }
      return `${actorName} liked your post`;

    case 'COMMENT_POST':
    case 'COMMENT': {
      const commentContent = notification.metadata?.commentContent;
      if (commentContent) {
        return `${actorName} commented: "${commentContent}"`;
      }
      if (postPreview) {
        return `${actorName} commented on your post: "${postPreview}"`;
      }
      return `${actorName} commented on your post`;
    }

    case 'FOLLOW_USER':
    case 'FOLLOW':
      return `${actorName} started following you`;

    case 'FOLLOW_PET':
    case 'PET_FOLLOW':
      if (petName) {
        return `${actorName} followed your pet ${petName}`;
      }
      return `${actorName} followed your pet`;

    case 'MENTION':
      if (postPreview) {
        return `${actorName} mentioned you in: "${postPreview}"`;
      }
      return `${actorName} mentioned you in a comment`;

    case 'SHARE_POST':
      if (postPreview) {
        return `${actorName} shared your post: "${postPreview}"`;
      }
      return `${actorName} shared your post`;

    case 'TREAT':
      return `${actorName} gave a treat to your post`;

    case 'SYSTEM':
      return notification.metadata?.message as string || 'System notification';

    default:
      return 'New notification';
  }
};

// Helper to get notification icon
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'LIKE_POST':
    case 'LIKE':
      return '❤️';

    case 'COMMENT_POST':
    case 'COMMENT':
      return '💬';

    case 'FOLLOW_USER':
    case 'FOLLOW':
      return '👤';

    case 'FOLLOW_PET':
    case 'PET_FOLLOW':
      return '🐾';

    case 'MENTION':
      return '@';

    case 'SHARE_POST':
      return '🔄';

    case 'TREAT':
      return '🦴';

    case 'SYSTEM':
      return '🔔';

    default:
      return '📢';
  }
};

// Format time ago
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
};

