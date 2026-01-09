import React from 'react';
import { Avatar, Badge } from 'antd';
import { motion } from 'motion/react';
import type { Notification } from '@/domain/notification';
import { getNotificationMessage, formatTimeAgo, getNotificationIcon } from '@/domain/notification';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onDelete?: (notificationId: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onDelete,
}) => {
  const timeAgo = formatTimeAgo(notification.createdAt);
  const icon = getNotificationIcon(notification.type);

  // Get actor name for bold styling
  const actorName = notification.metadata?.actorUsername || notification.actor.username;
  const postPreview = notification.metadata?.postPreview;

  const handleClick = () => {
    onClick?.(notification);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  // Generate full message
  const fullMessage = getNotificationMessage(notification);

  // Parse message to render with proper styling
  const renderMessage = () => {
    // Extract the action part after actor name
    const actionText = fullMessage.replace(actorName, '').trim();

    return (
      <>
        <span className={styles.actorName}>{actorName}</span>
        {' '}
        {postPreview ? (
          // If there's a preview, split on the quoted text
          <>
            {actionText.split(`"${postPreview}"`)[0]}
            <span className={styles.postPreview}>"{postPreview}"</span>
            {actionText.split(`"${postPreview}"`)[1] || ''}
          </>
        ) : (
          <span className={styles.messageText}>{actionText}</span>
        )}
      </>
    );
  };

  return (
    <motion.div
      className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
      onClick={handleClick}
      whileHover={{ backgroundColor: '#F9FAFB' }}
      transition={{ duration: 0.2 }}
    >
      {/* Unread indicator */}
      {!notification.isRead && <div className={styles.unreadDot} />}

      {/* Actor Avatar with Icon Badge */}
      <div className={styles.avatarWrapper}>
        <Avatar
          src={notification.actor.avatarUrl}
          size={48}
          className={styles.avatar}
          style={{ backgroundColor: notification.actor.avatarUrl ? undefined : '#1890FF' }}
        >
          {!notification.actor.avatarUrl && notification.actor.username.charAt(0).toUpperCase()}
        </Avatar>
        <Badge
          count={icon}
          className={styles.iconBadge}
        />
      </div>

      {/* Notification Content */}
      <div className={styles.content}>
        <div className={styles.message}>{renderMessage()}</div>
        <div className={styles.time}>{timeAgo}</div>
      </div>

      {/* Delete Button (shows on hover) */}
      <button
        className={styles.deleteBtn}
        onClick={handleDelete}
        aria-label="Delete notification"
      >
        ×
      </button>
    </motion.div>
  );
};

