import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, BellOutlined } from '@ant-design/icons';
import { Badge, Input, Button } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks';
import { useUnreadCount } from '../../hooks/useNotifications';
import { UserDropdown } from '../UserDropdown';
import { CreatePostModal } from '../CreatePostModal';
import { NotificationPopover } from '../NotificationPopover';
import styles from './Header.module.css';

interface HeaderProps {
  onSearch?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user, loading } = useUserProfile();
  const { unreadCount } = useUnreadCount(30000); // Poll every 30 seconds
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };


  const handleLoginClick = () => {
    navigate('/login');
  };

  // Default values while loading or when no user
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';

  const onLogoKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLogoClick();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Left: Logo & Brand */}
        <div
          className={styles.logo}
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="PawPlanet home"
          onKeyDown={onLogoKeyDown}
        >
          <img
            src="/logo/pawplanet-horizontal-logo.svg"
            alt="PawPlanet"
            className={styles.logoImage}
          />
        </div>

        {/* Center: Search Bar - only show when authenticated */}
        {isAuthenticated && (
          <div className={styles.searchContainer}>
            <Input
              className={styles.searchInput}
              prefix={<span className={styles.searchIcon}>🔍</span>}
              placeholder="Search for pets, friends, or paw-some moments..."
              size="large"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}

        {/* Right: Actions */}
        <div className={styles.rightSection}>
          {isAuthenticated ? (
            <>
              {/* Create Post Button */}
              <button className={styles.createButton} onClick={handleCreatePost}>
                <PlusOutlined className={styles.plusIcon} />
              </button>

              {/* Actions */}
              <div className={styles.actions}>
                {/* Notifications */}
                <NotificationPopover>
                  <div className={styles.notificationButton}>
                    <Badge count={unreadCount} offset={[-5, 5]}>
                      <BellOutlined className={styles.bellIcon} />
                    </Badge>
                  </div>
                </NotificationPopover>

                {/* User Dropdown */}
                {user && !loading ? (
                  <UserDropdown user={user} />
                ) : (
                  <div className={styles.userAvatar}>
                    <div className={styles.avatarPlaceholder}>
                      {loading ? '...' : displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Login Button for non-authenticated users */
            <Button
              type="primary"
              onClick={handleLoginClick}
              className={styles.loginButton}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </header>
  );
};
