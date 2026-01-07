/**
 * User Profile Page
 * Displays user profile information and allows editing
 */

import React, { useEffect } from 'react';
import { Card, Typography, Avatar, Spin, Button, Space, Divider } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProfileData } from '@/hooks';
import styles from './ProfilePage.module.css';

const { Title, Text, Paragraph } = Typography;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, error, refreshProfile } = useProfileData();

  useEffect(() => {
    refreshProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading profile...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Card>
          <Text type="danger">{error}</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={refreshProfile}>
              Retry
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <Card>
          <Text>No user data found</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.profilePage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        {/* Header */}
        <Card className={styles.headerCard}>
          <div className={styles.profileHeader}>
            <Avatar
              size={120}
              src={user.avatarUrl}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <Title level={2} className={styles.username}>
                {user.username}
              </Title>
              <Space direction="vertical" size={4}>
                <Space>
                  <MailOutlined />
                  <Text type="secondary">{user.email}</Text>
                </Space>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">Joined PawPlanet</Text>
                </Space>
              </Space>
              {user.bio && (
                <>
                  <Divider />
                  <Paragraph className={styles.bio}>
                    {user.bio}
                  </Paragraph>
                </>
              )}
            </div>
            <div className={styles.actions}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Pets</div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Posts</div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Followers</div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Following</div>
          </Card>
        </div>

        {/* Content Sections */}
        <div className={styles.contentGrid}>
          <Card title="My Pets" className={styles.contentCard}>
            <Text type="secondary">No pets added yet</Text>
          </Card>
          <Card title="Recent Posts" className={styles.contentCard}>
            <Text type="secondary">No posts yet</Text>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
