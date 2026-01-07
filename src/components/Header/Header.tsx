import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, BellOutlined } from '@ant-design/icons';
import { Badge, Input } from 'antd';
import { useUserProfile } from '../../hooks';
import styles from './Header.module.css';

interface HeaderProps {
  onSearch?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
}) => {
  const navigate = useNavigate();
  const { user, loading } = useUserProfile();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Default values while loading or when no user
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.avatarUrl;
  const notificationCount = 1; // This could come from a separate notifications API

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Left: Logo & Brand */}
        <div className={styles.logo} onClick={handleLogoClick}>
          <div className={styles.logoIcon}>🌍</div>
          <span className={styles.brandName}>PawPlanet</span>
        </div>

        {/* Center: Search Bar */}
        <div className={styles.searchContainer}>
          <Input
            className={styles.searchInput}
            prefix={<span className={styles.searchIcon}>🔍</span>}
            placeholder="Search for pets, friends, or paw-some moments..."
            size="large"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* Right: Create Button + Actions */}
        <div className={styles.rightSection}>
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

            {/* User Avatar */}
            <div className={styles.userAvatar} onClick={handleProfileClick}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {loading && (
                <div className={styles.loadingOverlay}>...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

