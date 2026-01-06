// filepath: /Users/apple/Downloads/GitHub/hoanganh-th/PawPlanet-frontend/src/pages/ProfilePage/ProfilePage.tsx
import { useState } from 'react';
import { motion } from 'motion/react';
import { Avatar } from 'antd';
import {
  MailOutlined,
  CheckCircleFilled,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { useMyProfile } from '@/hooks/useUser';
import { ErrorMessage } from '@/components/ErrorMessage';
import { pageVariants } from '@/animations/variants';
import styles from './ProfilePage.module.css';

type TabKey = 'posts' | 'photos' | 'likes' | 'followers';

// Mock data for photo gallery
const mockPhotos = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    petName: 'Charlie',
    petAvatar: 'C',
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop',
    petName: 'Luna',
    petAvatar: 'L',
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=400&fit=crop',
    petName: 'Max',
    petAvatar: 'M',
    likes: 312,
    comments: 67,
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=400&fit=crop',
    petName: 'Bella',
    petAvatar: 'B',
    likes: 156,
    comments: 28,
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=400&fit=crop',
    petName: 'Rocky',
    petAvatar: 'R',
    likes: 278,
    comments: 41,
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=400&fit=crop',
    petName: 'Daisy',
    petAvatar: 'D',
    likes: 198,
    comments: 35,
  },
];

export const ProfilePage = () => {
  const { profile, loading, error } = useMyProfile();
  const [activeTab, setActiveTab] = useState<TabKey>('photos');

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage message={error || 'Failed to load profile'} />
      </div>
    );
  }

  // Stats data
  const stats = {
    followers: '13.5k',
    posts: 345,
    following: 389,
    likes: '11.2k',
  };

  const tabCounts = {
    posts: 345,
    photos: 124,
    likes: 11200,
    followers: 13500,
  };

  return (
    <motion.div
      className={styles.profilePage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section - Cover Image */}
      <div className={styles.heroSection}>
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1400&h=350&fit=crop"
          alt="Cover"
          className={styles.coverImage}
        />
      </div>

      {/* Main Content Container */}
      <div className={styles.contentWrapper}>
        {/* Two Column Layout */}
        <div className={styles.twoColumnLayout}>
          {/* Left Sidebar - Profile Info */}
          <aside className={styles.leftSidebar}>
            {/* Avatar overlapping hero */}
            <div className={styles.avatarWrapper}>
              <Avatar
                size={130}
                src={profile.avatarUrl || 'https://i.pravatar.cc/150?img=5'}
                className={styles.profileAvatar}
              />
              <button className={styles.cameraButton}>
                <CameraOutlined />
              </button>
            </div>

            {/* Name & Username */}
            <div className={styles.nameSection}>
              <h1 className={styles.displayName}>
                {profile.fullName || 'Sarah Johnson'}
                <CheckCircleFilled className={styles.verifiedBadge} />
              </h1>
              <p className={styles.username}>@{profile.username || 'sarah_pawlover'}</p>
            </div>

            {/* Bio */}
            <p className={styles.bio}>
              Look again at that dot. That's here. That's home. That's us. On it everyone you love,
              everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.
            </p>

            {/* Stats Grid 2x2 */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.followers}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.posts}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.following}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.likes}</span>
                <span className={styles.statLabel}>Likes</span>
              </div>
            </div>

            {/* Email Contact */}
            <div className={styles.emailContact}>
              <MailOutlined className={styles.emailIcon} />
              <span>{profile.email || 'sarah.j@pawbuddy.com'}</span>
            </div>
          </aside>

          {/* Right Column - Tabs & Content */}
          <main className={styles.rightColumn}>
            {/* Navigation Tabs */}
            <nav className={styles.tabsNav}>
              <button
                className={`${styles.tabItem} ${activeTab === 'posts' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Posts
                <span className={activeTab === 'posts' ? styles.tabBadgeActive : styles.tabBadge}>
                  {tabCounts.posts}
                </span>
              </button>
              <button
                className={`${styles.tabItem} ${activeTab === 'photos' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                Photos
                <span className={activeTab === 'photos' ? styles.tabBadgeActive : styles.tabBadge}>
                  {tabCounts.photos}
                </span>
              </button>
              <button
                className={`${styles.tabItem} ${activeTab === 'likes' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('likes')}
              >
                Likes
                <span className={activeTab === 'likes' ? styles.tabBadgeActive : styles.tabBadge}>
                  {tabCounts.likes}
                </span>
              </button>
              <button
                className={`${styles.tabItem} ${activeTab === 'followers' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('followers')}
              >
                Followers
                <span className={activeTab === 'followers' ? styles.tabBadgeActive : styles.tabBadge}>
                  {tabCounts.followers}
                </span>
              </button>
            </nav>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {/* Photos Grid - Active by default */}
              {activeTab === 'photos' && (
                <div className={styles.photoGrid}>
                  {mockPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      className={styles.photoCard}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Photo Image */}
                      <div className={styles.photoImageWrapper}>
                        <img
                          src={photo.imageUrl}
                          alt={photo.petName}
                          className={styles.photoImage}
                        />
                      </div>

                      {/* Card Footer */}
                      <div className={styles.photoCardFooter}>
                        {/* Left: Pet info */}
                        <div className={styles.petInfo}>
                          <Avatar size={32} className={styles.petAvatar}>
                            {photo.petAvatar}
                          </Avatar>
                          <span className={styles.petName}>{photo.petName}</span>
                        </div>

                        {/* Right: Like & Comment counts */}
                        <div className={styles.photoStats}>
                          <span className={styles.photoStat}>
                            <HeartOutlined /> {photo.likes}
                          </span>
                          <span className={styles.photoStat}>
                            <MessageOutlined /> {photo.comments}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className={styles.emptyState}>
                  <HeartFilled className={styles.emptyIcon} />
                  <h3>Posts</h3>
                  <p>345 posts will appear here</p>
                </div>
              )}

              {/* Likes Tab */}
              {activeTab === 'likes' && (
                <div className={styles.emptyState}>
                  <HeartFilled className={styles.emptyIcon} />
                  <h3>Liked Posts</h3>
                  <p>11,200 liked posts will appear here</p>
                </div>
              )}

              {/* Followers Tab */}
              {activeTab === 'followers' && (
                <div className={styles.emptyState}>
                  <HeartFilled className={styles.emptyIcon} />
                  <h3>Followers</h3>
                  <p>13,500 followers will appear here</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

