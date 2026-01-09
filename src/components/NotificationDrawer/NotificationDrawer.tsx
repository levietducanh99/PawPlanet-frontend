import React from 'react';
import { Drawer, Button, Empty, Spin } from 'antd';
import { motion, AnimatePresence } from 'motion/react';
import { CloseOutlined } from '@ant-design/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/NotificationItem';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/domain/notification';
import styles from './NotificationDrawer.module.css';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(1, 20);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type and metadata
    const { type, target, metadata } = notification;

    // Use metadata for more accurate navigation
    if (type === 'COMMENT_POST' || type === 'COMMENT') {
      // For comment notifications, navigate to the post (using metadata.postId)
      const postId = metadata?.postId || target?.id;
      if (postId) {
        navigate(`/post/${postId}`);
      }
    } else if (type === 'LIKE_POST' || type === 'LIKE') {
      // For like notifications, navigate to the post
      const postId = metadata?.postId || target?.id;
      if (postId) {
        navigate(`/post/${postId}`);
      }
    } else if (type === 'FOLLOW_USER' || type === 'FOLLOW') {
      // For follow notifications, navigate to the actor's profile
      navigate(`/user/${notification.actor.id}`);
    } else if (type === 'FOLLOW_PET' || type === 'PET_FOLLOW') {
      // For pet follow notifications, navigate to the pet profile
      const petId = metadata?.petId || target?.id;
      if (petId) {
        navigate(`/pet/${petId}`);
      }
    } else if (type === 'MENTION') {
      // For mentions, navigate to the post
      const postId = metadata?.postId || target?.id;
      if (postId) {
        navigate(`/post/${postId}`);
      }
    } else if (type === 'SHARE_POST') {
      // For share notifications, navigate to the post
      const postId = metadata?.postId || target?.id;
      if (postId) {
        navigate(`/post/${postId}`);
      }
    } else if (target) {
      // Fallback to target-based navigation
      switch (target.type) {
        case 'POST':
          navigate(`/post/${target.id}`);
          break;
        case 'USER':
          navigate(`/user/${target.id}`);
          break;
        case 'PET':
          navigate(`/pet/${target.id}`);
          break;
        default:
          break;
      }
    }

    onClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId: number) => {
    await deleteNotification(notificationId);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Drawer
      title={null}
      placement="right"
      onClose={onClose}
      open={open}
      width={420}
      closeIcon={false}
      className={styles.drawer}
      styles={{
        body: { padding: 0 }
      }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.icon}>🔔</div>
          <div>
            <h2 className={styles.title}>Notifications</h2>
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount} unread</span>
            )}
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <CloseOutlined />
        </button>
      </div>

      {/* Actions */}
      {notifications.length > 0 && unreadCount > 0 && (
        <div className={styles.actions}>
          <Button
            type="link"
            onClick={handleMarkAllAsRead}
            className={styles.markAllBtn}
          >
            Mark all as read
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div className={styles.content}>
        {loading && notifications.length === 0 ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications yet"
            className={styles.empty}
          />
        ) : (
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <NotificationItem
                  notification={notification}
                  onClick={handleNotificationClick}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className={styles.loadMoreContainer}>
            <Button
              type="default"
              onClick={loadMore}
              loading={loading}
              className={styles.loadMoreBtn}
            >
              Load more
            </Button>
          </div>
        )}

        {/* Loading indicator for load more */}
        {loading && notifications.length > 0 && (
          <div className={styles.loadingMore}>
            <Spin />
          </div>
        )}
      </div>
    </Drawer>
  );
};
