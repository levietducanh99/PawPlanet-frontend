import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Button,
  Typography,
  Switch,
  Image,
  Empty,
  Divider
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Loading } from '../../components';
import PostCard from '../../components/PostCard';
import {
  usePetProfile,
  usePetTimeline,
  useUserPets
} from '../../hooks';
import styles from './MyPetsPage.module.css';
import { pageVariants } from '../../animations/variants';

const { Title, Text } = Typography;

export const MyPetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pets: userPets, loading: userPetsLoading } = useUserPets();

  // For demo, we'll use the first pet or default to pet ID 1
  const currentPetId = userPets && userPets.length > 0 ? userPets[0].id : 1;
  const { profile, loading: profileLoading } = usePetProfile(currentPetId ?? null);
  const { timeline, loading: timelineLoading } = usePetTimeline(currentPetId ?? null);

  const [profileVisibility, setProfileVisibility] = useState(profile?.status === 'Public');
  const [lookingForAdoption, setLookingForAdoption] = useState(profile?.status === 'For Adoption');

  const loading = userPetsLoading || profileLoading || timelineLoading;

  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div
      className={styles.pageContainer}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className={styles.contentWrapper}>
            <Row gutter={[24, 24]}>
              {/* Left Column - Pet Profile & Settings */}
              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={styles.leftColumn}
                >
                  {/* Pet Header Card */}
                  <Card bordered={false} className={styles.profileCard}>
                    <div className={styles.petHeader}>
                      <Avatar
                        size={64}
                        src={profile?.avatarUrl}
                        icon={<UserOutlined />}
                        className={styles.petAvatar}
                      />
                      <div className={styles.petBasicInfo}>
                        <Title level={4} className={styles.petName}>
                          {profile?.name} 🐕
                        </Title>
                        <Text className={styles.petBreed}>
                          {profile?.breedName || profile?.speciesName}
                        </Text>
                      </div>
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        className={styles.editButton}
                      />
                    </div>
                  </Card>

                  {/* Photo Library */}
                  <Card
                    bordered={false}
                    className={styles.photoLibraryCard}
                    title="Pet Photo Library"
                    extra={
                      <Button type="link" size="small">
                        View all photos
                      </Button>
                    }
                  >
                    <div className={styles.photoGrid}>
                      {profile?.media?.slice(0, 4).map((photo, index) => (
                        <div key={photo.id} className={styles.photoItem}>
                          <Image
                            src={photo.url}
                            alt={`${profile.name} photo ${index + 1}`}
                            className={styles.photoThumbnail}
                          />
                          {index === 3 && (profile?.media?.length || 0) > 4 && (
                            <div className={styles.photoOverlay}>
                              +{(profile?.media?.length || 4) - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Profile Settings */}
                  <Card bordered={false} className={styles.settingsCard}>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <Text strong>Profile Visibility</Text>
                        <Text type="secondary" className={styles.settingDescription}>
                          Make everyone can view
                        </Text>
                      </div>
                      <Switch
                        checked={profileVisibility}
                        onChange={setProfileVisibility}
                        size="small"
                      />
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <Text strong>Looking for Adoption</Text>
                        <Text type="secondary" className={styles.settingDescription}>
                          Yes. Post adoption list
                        </Text>
                      </div>
                      <Switch
                        checked={lookingForAdoption}
                        onChange={setLookingForAdoption}
                        size="small"
                      />
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <Text strong>Appearance and distinctive signs</Text>
                      </div>
                    </div>
                  </Card>

                  {/* Pet Details */}
                  <Card bordered={false} className={styles.detailsCard}>
                    <div className={styles.petDetailsGrid}>
                      <div className={styles.detailRow}>
                        <Text className={styles.detailLabel}>Color</Text>
                        <Text className={styles.detailValue}>Male</Text>
                      </div>
                      <div className={styles.detailRow}>
                        <Text className={styles.detailLabel}>Size</Text>
                        <Text className={styles.detailValue}>Medium</Text>
                      </div>
                      <div className={styles.detailRow}>
                        <Text className={styles.detailLabel}>Weight</Text>
                        <Text className={styles.detailValue}>27.1 kg</Text>
                      </div>
                    </div>

                    <Divider />

                    {/* Important Dates */}
                    <div className={styles.datesSection}>
                      <Text strong className={styles.sectionTitle}>Important Dates</Text>
                      <div className={styles.datesList}>
                        <div className={styles.dateItem}>
                          <CalendarOutlined className={styles.dateIcon} />
                          <div className={styles.dateInfo}>
                            <Text strong>Birthday</Text>
                            <Text className={styles.dateText}>6 January 2023</Text>
                          </div>
                        </div>
                        <div className={styles.dateItem}>
                          <CalendarOutlined className={styles.dateIcon} />
                          <div className={styles.dateInfo}>
                            <Text strong>Microchip Day</Text>
                            <Text className={styles.dateText}>6 January 2023</Text>
                          </div>
                        </div>
                        <div className={styles.dateItem}>
                          <CalendarOutlined className={styles.dateIcon} />
                          <div className={styles.dateInfo}>
                            <Text strong>Adoption Day</Text>
                            <Text className={styles.dateText}>1 January 2023</Text>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    {/* Caretakers */}
                    <div className={styles.careSection}>
                      <Text strong className={styles.sectionTitle}>Caretakers</Text>
                      <div className={styles.caretakersList}>
                        <div className={styles.caretakerItem}>
                          <Text>Esther Howard</Text>
                        </div>
                        <div className={styles.caretakerItem}>
                          <Text>Guy Hawkins</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              {/* Right Column - Timeline */}
              <Col xs={24} lg={16}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={styles.rightColumn}
                >
                  <div className={styles.timelineHeader}>
                    <Title level={3} className={styles.timelineTitle}>
                      {profile?.name}'s Timeline
                    </Title>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      className={styles.addPostButton}
                      onClick={() => navigate('/create-post')}
                    >
                      Add Post
                    </Button>
                  </div>

                  <div className={styles.timelineContent}>
                    {timelineLoading ? (
                      <div className={styles.timelineLoading}>
                        <Loading />
                      </div>
                    ) : timeline && timeline.posts.length > 0 ? (
                      <div className={styles.postsContainer}>
                        {timeline.posts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onLike={(postId: number) => console.log('Liked:', postId)}
                            onComment={(postId: number) => console.log('Comment:', postId)}
                            onShare={(postId: number) => console.log('Share:', postId)}
                          />
                        ))}

                        {timeline.hasMore && (
                          <div className={styles.loadMore}>
                            <Button type="default" size="large">
                              Load More Posts
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Card bordered={false} className={styles.emptyTimelineCard}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No posts yet. Start sharing your pet's moments!"
                        >
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/create-post')}
                          >
                            Create Your First Post
                          </Button>
                        </Empty>
                      </Card>
                    )}
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
    </motion.div>
  );
};
