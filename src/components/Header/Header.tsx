import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, BellOutlined } from '@ant-design/icons';
import { Badge, Input } from 'antd';
import styles from './Header.module.css';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onSearch?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'User',
  userAvatar,
  notificationCount = 1,
  onSearch,
}) => {
  const navigate = useNavigate();

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

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Left: Logo & Brand */}
        <div className={styles.logo} onClick={handleLogoClick}>
          <div className={styles.logoIcon}>🌍</div>
          <span className={styles.brandName}>PawPlanet</span>
        </div>

        {/* Center: Create Post Button */}
        <div className={styles.createButtonCenter}>
          <button className={styles.createButton} onClick={handleCreatePost}>
            <PlusOutlined className={styles.plusIcon} />
          </button>
        </div>

        {/* Right: Search + Actions */}
        <div className={styles.rightSection}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <Input
              className={styles.searchInput}
              prefix={<span className={styles.searchIcon}>🔍</span>}
              placeholder="Search for pets, friends, or paw-some moments..."
              size="large"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>

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
              {userAvatar ? (
                <img src={userAvatar} alt={userName} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

