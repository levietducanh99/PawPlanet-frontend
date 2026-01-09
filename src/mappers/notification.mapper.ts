// src/mappers/notification.mapper.ts
import type { NotificationResponse, ActorInfo, TargetInfo } from '@/services/api';
import type {
  Notification,
  NotificationActor,
  NotificationTarget,
  NotificationType
} from '@/domain/notification';

export const mapNotificationActor = (dto?: ActorInfo): NotificationActor => {
  return {
    id: dto?.id || 0,
    username: dto?.username || 'Unknown',
    avatarUrl: dto?.avatarUrl,
  };
};

export const mapNotificationTarget = (dto?: TargetInfo): NotificationTarget | undefined => {
  if (!dto) return undefined;

  return {
    type: dto.type || 'unknown',
    id: dto.id || 0,
  };
};

export const mapNotification = (dto: NotificationResponse): Notification => {
  return {
    id: dto.id!,
    type: (dto.type as NotificationType) || 'SYSTEM',
    isRead: dto.isRead ?? false,
    createdAt: dto.createdAt!,
    actor: mapNotificationActor(dto.actor),
    target: mapNotificationTarget(dto.target),
    metadata: dto.metadata,
  };
};

export const mapNotifications = (dtos: NotificationResponse[]): Notification[] => {
  return dtos.map(mapNotification);
};

