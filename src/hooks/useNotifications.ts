// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notification.service';
import type { Notification } from '@/domain/notification';

export const useNotifications = (initialPage = 1, pageSize = 20) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure page starts from 1 (backend requirement)
      const safePage = Math.max(1, pageNum);

      const data = await notificationService.getMyNotifications(safePage, pageSize);

      if (safePage === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }

      setHasMore(data.hasMore);
      setTotalElements(data.totalElements);
      setPage(safePage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notifications';
      console.error('Error fetching notifications:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  }, [loading, hasMore, page, fetchNotifications]);

  const refresh = useCallback(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);

      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotalElements(prev => prev - 1);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  return {
    notifications,
    loading,
    error,
    hasMore,
    totalElements,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

export const useUnreadCount = (pollingInterval = 30000) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unreadCount);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();

    // Poll for updates
    const interval = setInterval(fetchUnreadCount, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchUnreadCount, pollingInterval]);

  return { unreadCount, loading, refresh: fetchUnreadCount };
};

