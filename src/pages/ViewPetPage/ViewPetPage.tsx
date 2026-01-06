import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Button,
  Typography,
  Image,
  Empty,
  Spin
} from 'antd';
import {
  HeartOutlined,
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Loading, ErrorMessage } from '../../components';
import PostCard from '../../components/PostCard';
import {
  usePetProfile,
  usePetTimeline
} from '../../hooks';
import styles from './ViewPetPage.module.css';
import { pageVariants } from '../../animations/variants';

const { Title, Text, Paragraph } = Typography;

// Mock user profiles với different privacy states
const mockUserProfiles = {
  'sarah-johnson': {
    id: 1,
    username: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    pets: [
      { id: 1, name: 'Charlie', type: 'dog', isPrivate: false },
      { id: 2, name: 'Max', type: 'cat', isPrivate: false }
    ]
  },
  'michael-chen': {
    id: 2,
    username: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    pets: [
      { id: 3, name: 'Buddy', type: 'dog', isPrivate: true }
    ]
  },
  'empty-user': {
    id: 3,
    username: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=3',
    pets: []
  }
};

export const ViewPetPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // Get user profile from mock data
  const userProfile = username ? mockUserProfiles[username as keyof typeof mockUserProfiles] : null;

  // Determine the state
  const hasNoPets = userProfile?.pets.length === 0;
  const hasPrivatePets = userProfile?.pets.some(pet => pet.isPrivate) && userProfile?.pets.every(pet => pet.isPrivate);

  if (!userProfile) {
    return <ErrorMessage message="User not found" />;
  }

  // State 3: No Pets to Show
  if (hasNoPets) {
    return (
      <motion.div
        className={styles.pageContainer}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className={styles.backButton}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate(-1)}
            className={styles.backBtn}
          >
            Back
          </Button>
        </div>

        <div className={styles.emptyState}>
          <Card className={styles.emptyCard} bordered={false}>
            <div className={styles.emptyContent}>
              <div className={styles.userHeader}>
                <Avatar
                  size={64}
                  src={userProfile.avatar}
                  className={styles.userAvatar}
                />
                <Title level={3} className={styles.userName}>
                  {userProfile.username}'s Pets
                </Title>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.emptyIcon}
              >
                <div className={styles.iconContainer}>
                  ✨
                </div>
              </motion.div>

              <Title level={2} className={styles.emptyTitle}>
                No Pets to Show
              </Title>

              <Paragraph className={styles.emptyDescription}>
                Michael Chen hasn't added any pets yet. Check back later, or
                explore other amazing pets in the PawPlanet community 🐾
              </Paragraph>

              <div className={styles.emptyActions}>
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  size="large"
                  className={styles.exploreButton}
                >
                  Explore Other Pets
                </Button>

                <Button
                  type="default"
                  icon={<UserOutlined />}
                  size="large"
                  className={styles.homeButton}
                  onClick={() => navigate('/my-pets')}
                >
                  Go to Home
                </Button>
              </div>

              <div className={styles.helpSection}>
                <Text type="secondary" className={styles.helpText}>
                  Did you know?
                </Text>
                <Paragraph className={styles.helpDescription}>
                  Every pet on PawPlanet has a unique story. Start exploring pets right here and meet new furry friends to
                  follow!
                </Paragraph>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  }

  // State 2: Private Profile
  if (hasPrivatePets) {
    return (
      <motion.div
        className={styles.pageContainer}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className={styles.backButton}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate(-1)}
            className={styles.backBtn}
          >
            Back
          </Button>
        </div>

        <div className={styles.privateState}>
          <Card className={styles.privateCard} bordered={false}>
            <div className={styles.privateContent}>
              <div className={styles.userHeader}>
                <Avatar
                  size={64}
                  src={userProfile.avatar}
                  className={styles.userAvatar}
                />
                <Title level={3} className={styles.userName}>
                  {userProfile.username}'s Pets
                </Title>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={styles.lockIcon}
              >
                <div className={styles.lockContainer}>
                  <LockOutlined />
                </div>
              </motion.div>

              <Title level={2} className={styles.privateTitle}>
                This Profile is Private
              </Title>

              <Paragraph className={styles.privateDescription}>
                Sarah Johnson has set this pet profile to private. Only they
                can view this adorable friend's profile. 😊
              </Paragraph>

              <div className={styles.privacyNote}>
                <div className={styles.privacyIcon}>
                  🔒
                </div>
                <div className={styles.privacyContent}>
                  <Text strong>Privacy Protected</Text>
                  <br />
                  <Text type="secondary" className={styles.privacyText}>
                    Respecting privacy by keeping this pet profile. We want to
                    keep fluffy's information private and anonymous.
                  </Text>
                </div>
              </div>

              <div className={styles.privateActions}>
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  size="large"
                  className={styles.exploreButton}
                >
                  Explore Other Pets
                </Button>

                <Button
                  type="default"
                  icon={<UserOutlined />}
                  size="large"
                  className={styles.homeButton}
                  onClick={() => navigate('/my-pets')}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  }

  // State 1: Public Pet Profile (existing functionality)
  const currentPet = userProfile.pets.find(pet => !pet.isPrivate);
  const { profile, loading: profileLoading } = usePetProfile(currentPet?.id || 1);
  const { timeline, loading: timelineLoading } = usePetTimeline(currentPet?.id || 1);

  if (profileLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      className={styles.pageContainer}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
          <div className={styles.backButton}>
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={() => navigate(-1)}
              className={styles.backBtn}
            >
              Back
            </Button>
          </div>

          <div className={styles.contentWrapper}>
            <Row gutter={[24, 24]}>
              {/* Left Column - Pet Profile */}
              <Col xs={24} lg={8} className={styles.leftColumn}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Pet Header */}
                  <Card bordered={false} className={styles.profileCard}>
                    <div className={styles.ownerHeader}>
                      <Avatar
                        size={40}
                        src={userProfile.avatar}
                        className={styles.ownerAvatar}
                      />
                      <div className={styles.ownerInfo}>
                        <Text strong className={styles.ownerName}>{userProfile.username}</Text>
                        <Text type="secondary" className={styles.ownerLabel}>Pet Owner</Text>
                      </div>
                    </div>

                    <div className={styles.petHeader}>
                      <Avatar
                        size={80}
                        src={profile?.avatarUrl}
                        icon={<UserOutlined />}
                        className={styles.petAvatar}
                      />
                      <div className={styles.petBasicInfo}>
                        <Title level={3} className={styles.petName}>
                          {profile?.name} 🐕
                        </Title>
                        <Text className={styles.petSubtitle}>
                          {profile?.breed}
                        </Text>
                        <div className={styles.petActions}>
                          <Button
                            type="primary"
                            icon={<HeartOutlined />}
                            size="small"
                            className={styles.followButton}
                          >
                            Follow
                          </Button>
                          <Button
                            icon={<ShareAltOutlined />}
                            size="small"
                            className={styles.shareButton}
                          >
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Paragraph className={styles.petDescription}>
                      {profile?.about}
                    </Paragraph>
                  </Card>

                  {/* Pet Photo Library */}
                  {profile?.photoLibrary && profile.photoLibrary.length > 0 && (
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
                        {profile.photoLibrary.slice(0, 4).map((photo, index) => (
                          <div key={index} className={styles.photoItem}>
                            <Image
                              src={photo}
                              alt={`${profile.name} photo ${index + 1}`}
                              className={styles.photoThumbnail}
                            />
                            {index === 3 && profile.photoLibrary.length > 4 && (
                              <div className={styles.photoOverlay}>
                                +{profile.photoLibrary.length - 4}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Pet Details - Read Only */}
                  <Card
                    bordered={false}
                    className={styles.detailsCard}
                    title={profile?.name}
                  >
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <Text className={styles.detailLabel}>Age</Text>
                        <Text className={styles.detailValue}>{profile?.age}</Text>
                      </div>
                      <div className={styles.detailItem}>
                        <Text className={styles.detailLabel}>Gender</Text>
                        <Text className={styles.detailValue}>{profile?.gender}</Text>
                      </div>
                      <div className={styles.detailItem}>
                        <Text className={styles.detailLabel}>Size</Text>
                        <Text className={styles.detailValue}>{profile?.size}</Text>
                      </div>
                      <div className={styles.detailItem}>
                        <Text className={styles.detailLabel}>Weight</Text>
                        <Text className={styles.detailValue}>{profile?.weight}</Text>
                      </div>
                    </div>

                    <div className={styles.colorSection}>
                      <Text className={styles.detailLabel}>Color</Text>
                      <Paragraph className={styles.colorDescription}>
                        {profile?.color}
                      </Paragraph>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              {/* Right Column - Timeline */}
              <Col xs={24} lg={16} className={styles.rightColumn}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={styles.timelineHeader}>
                    <Title level={3} className={styles.timelineTitle}>
                      {profile?.name}'s Timeline
                    </Title>
                  </div>

                  <div className={styles.timelineContent}>
                    {timelineLoading ? (
                      <div className={styles.timelineLoading}>
                        <Spin size="large" />
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
                          description="No posts yet"
                        />
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
