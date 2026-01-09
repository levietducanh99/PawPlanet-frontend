// src/services/notification.service.ts
import { NotificationsApi, Configuration } from './api';
import apiClient from './apiConfig';
import { mapNotification, mapNotifications } from '@/mappers/notification.mapper';
import type { Notification, NotificationList, NotificationStats } from '@/domain/notification';

// Create API configuration with auth
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'https://pawplanet-ae61a47d7179.herokuapp.com',
});

const api = new NotificationsApi(apiConfiguration, undefined, apiClient);

/**
 * Get all notifications with pagination
 */
export const getMyNotifications = async (
  page = 1,
  size = 20
): Promise<NotificationList> => {
  // Ensure page starts from 1 (backend requirement)
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, size);

  const response = await api.getMyNotifications({ page: safePage, size: safeSize });
  const data = response.data.result;
  
  return {
    notifications: mapNotifications(data?.items || []),
    totalElements: data?.totalElements || 0,
    page: data?.page || 1,
    size: data?.size || size,
    hasMore: (data?.page || 1) < Math.ceil((data?.totalElements || 0) / size),
  };
};

/**
 * Get unread notifications only
 */
export const getUnreadNotifications = async (
  page = 1,
  size = 20
): Promise<NotificationList> => {
  // Ensure page starts from 1 (backend requirement)
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, size);

  const response = await api.getMyUnreadNotifications({ page: safePage, size: safeSize });
  const data = response.data.result;
  
  return {
    notifications: mapNotifications(data?.items || []),
    totalElements: data?.totalElements || 0,
    page: data?.page || 1,
    size: data?.size || size,
    hasMore: (data?.page || 1) < Math.ceil((data?.totalElements || 0) / size),
  };
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<NotificationStats> => {
  const response = await api.getUnreadCount();
  const count = response.data.result || 0;
  
  return {
    unreadCount: count,
  };
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId: number): Promise<Notification> => {
  const response = await api.markAsRead({ notificationId });
  return mapNotification(response.data.result!);
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
  await api.markAllAsRead();
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: number): Promise<void> => {
  await api.deleteNotification({ notificationId });
};

export const notificationService = {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

