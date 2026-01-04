import React from 'react';
import { HomeOutlined, BookOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import styles from './Sidebar.module.css';

interface SidebarProps {
  userName?: string;
  userGreeting?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userName = 'Esther',
  userGreeting = 'Hello,'
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/paw-buddy-logo.svg" alt="Paw Buddy" className={styles.logoImage} />
      </div>

      <div className={styles.yourPetsSection}>
        <h2 className={styles.sectionTitle}>Your Pets</h2>
      </div>

      <div className={styles.quickActions}>
        <div className={styles.sectionTitle}>Quick Actions</div>
        <div className={styles.actionItem}>
          <HomeOutlined className={styles.actionIcon} />
          <span>Home</span>
        </div>
        <div className={styles.actionItem}>
          <BookOutlined className={styles.actionIcon} />
          <span>Encyclopedia</span>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <div className={styles.actionItem}>
          <SettingOutlined className={styles.actionIcon} />
          <span>Settings</span>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <UserOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userGreeting}>{userGreeting}</div>
            <div className={styles.userName}>{userName}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

