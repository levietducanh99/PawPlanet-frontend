import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, BellOutlined } from '@ant-design/icons';
import { Badge, Input, Button } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks';
import { UserDropdown } from '../UserDropdown';
import { CreatePostModal } from '../CreatePostModal';
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
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Default values while loading or when no user
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const notificationCount = 1; // This could come from a separate notifications API

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Left: Logo & Brand */}
        <div className={styles.logo} onClick={handleLogoClick}>
          <div className={styles.logoIcon}>🌍</div>
          <span className={styles.brandName}>PawPlanet</span>
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
                <div className={styles.notificationButton} onClick={handleNotificationClick}>
                  <Badge count={notificationCount} offset={[-5, 5]}>
                    <BellOutlined className={styles.bellIcon} />
                  </Badge>
                </div>

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

