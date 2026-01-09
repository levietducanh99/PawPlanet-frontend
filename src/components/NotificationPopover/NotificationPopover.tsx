import React, { useState } from 'react';
import { Popover, Button, Empty, Spin, Divider } from 'antd';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/NotificationItem';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/domain/notification';
import styles from './NotificationPopover.module.css';

interface NotificationPopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  children,
  open: controlledOpen,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(1, 10); // Show 10 initially, page starts from 1

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.target) {
      switch (notification.target.type) {
        case 'POST':
          navigate(`/post/${notification.target.id}`);
          break;
        case 'USER':
          navigate(`/profile/${notification.target.id}`);
          break;
        case 'PET':
          navigate(`/pet/${notification.target.id}`);
          break;
        case 'COMMENT':
          navigate(`/post/${notification.target.id}`);
          break;
        default:
          break;
      }
    }

    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent notification click
    await deleteNotification(notificationId);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const content = (
    <div className={styles.popoverContent}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Notifications</h3>
        {unreadCount > 0 && (
          <Button
            type="link"
            onClick={handleMarkAllAsRead}
            className={styles.markAllBtn}
            size="small"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Notifications List */}
      <div className={styles.notificationsList}>
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
          <>
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <NotificationItem
                    notification={notification}
                    onClick={handleNotificationClick}
                    onDelete={(id) => handleDelete(id, {} as React.MouseEvent)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <Button
                  type="text"
                  onClick={loadMore}
                  loading={loading}
                  block
                  className={styles.loadMoreBtn}
                >
                  See more notifications
                </Button>
              </div>
            )}

            {/* Loading indicator for load more */}
            {loading && notifications.length > 0 && (
              <div className={styles.loadingMore}>
                <Spin size="small" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      rootClassName={styles.popoverOverlay}
      arrow={false}
      fresh={false}
    >
      {children}
    </Popover>
  );
};

