import React, {useEffect, useState} from 'react';
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
  Spin,
  message,
  Popconfirm,
  Space
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Sidebar, Header, Loading, ErrorMessage } from '../../components';
import PostCard from '../../components/PostCard';
import { PhotoGalleryModal } from '../../components/PhotoGalleryModal';
import { UploadMediaModal } from '../../components/UploadMediaModal';
import { PetFollowersModal } from '../../components/PetFollowersModal';
import CommentModal from '../../components/CommentDrawer/CommentDrawer';
import {
  useViewPet,
  usePetPosts,
  useDeletePet,
  usePostActions
} from '../../hooks';
import styles from './ViewPetPage.module.css';
import { pageVariants } from '../../animations/variants';

const { Title, Text, Paragraph } = Typography;

export const ViewPetPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  // Convert petId to number
  const petIdNumber = petId ? parseInt(petId, 10) : null;

  console.log('🐕 ViewPetPage: URL petId param:', petId);
  console.log('🐕 ViewPetPage: Parsed petIdNumber:', petIdNumber);

  // State for unfollow button hover effect
  const [isUnfollowHovered, setIsUnfollowHovered] = useState(false);

  // State for photo gallery modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // State for upload media modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // State for followers modal
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  // State for comment modal
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);

  // Use the integrated hook
  const {
    pet,
    pageLoading,     // Only for initial page load
    error,
    canFollow,
    isFollowing,
    handleFollowToggle,
    followLoading,   // Only for follow/unfollow button
    isOwner,
    isPrivate,
    refetch,
    isOptimistic, // Track if using optimistic state
    followerCount, // Accurate follower count from fetched data
  } = useViewPet(petIdNumber);

  useEffect(() => {
    console.log('🔥 ViewPetPage MOUNT');
    return () => {
      console.log('💀 ViewPetPage UNMOUNT');
    };
  }, []);

  // Get pet posts
  const { posts, loading: postsLoading } = usePetPosts(petIdNumber);

  // Post actions hook (like, share)
  const { likePost } = usePostActions();

  // Optimistic posts state for immediate UI feedback
  const [optimisticPosts, setOptimisticPosts] = useState(posts);

  // Sync optimistic posts with fetched posts
  useEffect(() => {
    if (posts) {
      setOptimisticPosts(posts);
    }
  }, [posts]);

  // Delete pet hook
  const { deletePet, loading: deleteLoading } = useDeletePet();

  // Handle follow button click
  const handleFollowClick = async () => {
    const success = await handleFollowToggle();
    if (success) {
      if (isFollowing) {
        message.success(`Unfollowed ${pet?.name} successfully`);
      } else {
        message.success(`Now following ${pet?.name}! 🎉`);
      }
    } else {
      message.error('Failed to update follow status. Please try again.');
    }
  };

  // Handle delete pet
  const handleDeletePet = async () => {
    if (!petIdNumber) return;

    const petName = pet?.name;

    // Show loading message
    const hideLoading = message.loading(`Deleting ${petName}...`, 0);

    try {
      const success = await deletePet(petIdNumber);
      hideLoading();

      if (success) {
        message.success(`${petName} has been deleted successfully`);

        // Wait a moment for user to see the success message, then navigate
        setTimeout(() => {
          navigate('/profile', { replace: true });
        }, 1000);
      } else {
        message.error('Failed to delete pet. Please try again.');
      }
    } catch (error) {
      hideLoading();
      message.error('Failed to delete pet. Please try again.');
    }
  };

  // Handle upload success - refetch pet data to show new media
  const handleUploadSuccess = () => {
    console.log('🔄 Media uploaded, refetching pet data...');
    if (refetch) {
      refetch();
    }
  };

  // Handle post comment
  const handlePostComment = (postId: number) => {
    setActivePostId(postId);
    setShowCommentModal(true);
  };

  // Handle post like with optimistic update
  const handlePostLike = async (postId: number) => {
    try {
      // Find the post being liked
      const post = optimisticPosts.find(p => p.id === postId);
      if (!post) return;

      // Optimistic update - immediately update UI
      const updatedPosts = optimisticPosts.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      );
      setOptimisticPosts(updatedPosts);

      // Call API
      const result = await likePost(postId);

      // Update with actual server response
      const serverUpdatedPosts = updatedPosts.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: result.liked,
              likeCount: result.likeCount,
            }
          : p
      );
      setOptimisticPosts(serverUpdatedPosts);

    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setOptimisticPosts(posts);
      message.error('Failed to update like. Please try again.');
    }
  };

  // Handle post share
  const handlePostShare = (postId: number) => {
    console.log('Share post:', postId);
    message.info('Share feature coming soon!');
  };

  // Loading state - ONLY for initial page load
  if (pageLoading) {
    return <Loading />;
  }

  // Error state
  if (error || !pet) {
    return (
      <>
        <Header />
        <div className={styles.pageContainer}>
          <Sidebar />
          <motion.main
            className={styles.mainContent}
            variants={pageVariants}
            initial="initial"
            animate="animate"
          >
            <ErrorMessage message={error || 'Pet not found'} />
          </motion.main>
        </div>
      </>
    );
  }

  // State: Private Profile (status = hidden)
  if (isPrivate && !isOwner) {
    return (
      <>
        <Header />
        <div className={styles.pageContainer}>
          <Sidebar />

          <motion.main
            className={styles.mainContent}
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
                      icon={<UserOutlined />}
                      className={styles.userAvatar}
                    />
                    <Title level={3} className={styles.userName}>
                      {pet.ownerUsername}'s Pet
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
                    {pet.ownerUsername} has set this pet profile to private. Only they
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
                        keep {pet.name}'s information private and secure.
                      </Text>
                    </div>
                  </div>

                  <div className={styles.privateActions}>
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      size="large"
                      className={styles.exploreButton}
                      onClick={() => navigate('/encyclopedia')}
                    >
                      Explore Other Pets
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.main>
        </div>
      </>
    );
  }

  // State: Public Pet Profile (existing functionality with real API data)
  return (
    <>
      <Header />

      <div className={styles.pageContainer}>
        <Sidebar />

        <motion.main
          className={styles.mainContent}
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
                        icon={<UserOutlined />}
                        className={styles.ownerAvatar}
                      />
                      <div className={styles.ownerInfo}>
                        <Text strong className={styles.ownerName}>{pet.ownerUsername}</Text>
                        <Text type="secondary" className={styles.ownerLabel}>Pet Owner</Text>
                      </div>
                    </div>

                    <div className={styles.petHeader}>
                      <div className={styles.petAvatarSection}>
                        <Avatar
                          size={80}
                          src={pet.avatarUrl}
                          icon={<UserOutlined />}
                          className={styles.petAvatar}
                        />
                      </div>

                      <div className={styles.petBasicInfo}>
                        <Title level={3} className={styles.petName}>
                          {pet.name} {pet.speciesName === 'Dog' ? '🐕' : pet.speciesName === 'Cat' ? '🐱' : '🐾'}
                        </Title>
                        <Text className={styles.petSubtitle}>
                          {pet.breedName || pet.speciesName}
                        </Text>
                      </div>
                    </div>

                    {/* Action Buttons - Below Avatar */}
                    <div className={styles.petActions}>
                      {canFollow && (
                        <>
                          {isFollowing ? (
                            <Popconfirm
                              title={`Unfollow ${pet.name}?`}
                              description={`You will no longer see ${pet.name}'s updates in your feed.`}
                              onConfirm={handleFollowClick}
                              okText="Unfollow"
                              cancelText="Cancel"
                              okButtonProps={{ danger: true, loading: followLoading }}
                            >
                              <Button
                                type="default"
                                icon={<HeartFilled />}
                                size="small"
                                className={styles.followButton}
                                loading={followLoading}
                                onMouseEnter={() => setIsUnfollowHovered(true)}
                                onMouseLeave={() => setIsUnfollowHovered(false)}
                                danger={isUnfollowHovered}
                                style={{
                                  opacity: isOptimistic ? 0.7 : 1,
                                  transition: 'opacity 0.2s ease'
                                }}
                              >
                                {isUnfollowHovered ? 'Unfollow' : 'Following'}
                              </Button>
                            </Popconfirm>
                          ) : (
                            <Button
                              type="primary"
                              icon={<HeartOutlined />}
                              size="small"
                              className={styles.followButton}
                              onClick={handleFollowClick}
                              loading={followLoading}
                              style={{
                                opacity: isOptimistic ? 0.7 : 1,
                                transition: 'opacity 0.2s ease'
                              }}
                            >
                              Follow
                            </Button>
                          )}
                        </>
                      )}

                      {/* Edit button - only for owner */}
                      {isOwner && (
                        <>
                          <Button
                            icon={<EditOutlined />}
                            size="small"
                            type="default"
                            onClick={() => navigate(`/edit-pet/${pet.id}`)}
                            style={{
                              borderRadius: '8px',
                              height: '32px'
                            }}
                          >
                            Edit
                          </Button>

                          <Popconfirm
                            title={`Delete ${pet.name}?`}
                            description="This action cannot be undone. All posts and media will be permanently deleted."
                            onConfirm={handleDeletePet}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true, loading: deleteLoading }}
                          >
                            <Button
                              icon={<DeleteOutlined />}
                              size="small"
                              danger
                              loading={deleteLoading}
                              style={{
                                borderRadius: '8px',
                                height: '32px'
                              }}
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        </>
                      )}

                      <Button
                        icon={<ShareAltOutlined />}
                        size="small"
                        className={styles.shareButton}
                      >
                        Share
                      </Button>
                    </div>

                    {pet.description && (
                      <Paragraph className={styles.petDescription}>
                        {pet.description}
                      </Paragraph>
                    )}

                    {/* Pet Stats - Followers */}
                    <div className={styles.petStats}>
                      <Button
                        type="text"
                        className={styles.statButton}
                        onClick={() => setShowFollowersModal(true)}
                      >
                        <Text strong className={styles.statNumber}>
                          {followerCount || 0}
                        </Text>
                        <Text className={styles.statLabel}>
                          {followerCount === 1 ? 'Follower' : 'Followers'}
                        </Text>
                      </Button>
                    </div>
                  </Card>

                  {/* Pet Photo Library */}
                  {(pet.media && pet.media.length > 0) || isOwner ? (
                    <Card
                      bordered={false}
                      className={styles.photoLibraryCard}
                      title="Pet Library"
                      extra={
                        <Space size="small">
                          {pet.media && pet.media.length > 0 && (
                            <Button
                              type="link"
                              size="small"
                              onClick={() => setShowGalleryModal(true)}
                            >
                              View all ({pet.media.length})
                            </Button>
                          )}
                          {isOwner && (
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => setShowUploadModal(true)}
                            >
                              Upload
                            </Button>
                          )}
                        </Space>
                      }
                    >
                      {pet.media && pet.media.length > 0 ? (
                        <div className={styles.photoGrid}>
                          {pet.media.slice(0, 4).map((media, index) => {
                            const isVideo = media.type?.toLowerCase() === 'video' ||
                                          media.url?.includes('.mp4') ||
                                          media.url?.includes('.mov') ||
                                          media.url?.includes('.avi');

                            return (
                              <div key={media.id} className={styles.photoItem}>
                                {isVideo ? (
                                  <div style={{ position: 'relative' }}>
                                    <video
                                      src={media.url}
                                      className={styles.photoThumbnail}
                                      style={{ objectFit: 'cover', backgroundColor: '#000' }}
                                      onClick={() => setShowGalleryModal(true)}
                                    />
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '40px',
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        pointerEvents: 'none'
                                      }}
                                    >
                                      <PlayCircleOutlined />
                                    </div>
                                  </div>
                                ) : (
                                  <Image
                                    src={media.url}
                                    alt={`${pet.name} photo ${index + 1}`}
                                    className={styles.photoThumbnail}
                                  />
                                )}
                                {index === 3 && pet.media.length > 4 && (
                                  <div className={styles.photoOverlay}>
                                    +{pet.media.length - 4}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Empty
                          description="No photos or videos yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                          {isOwner && (
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => setShowUploadModal(true)}
                            >
                              Add First Photo/Video
                            </Button>
                          )}
                        </Empty>
                      )}
                    </Card>
                  ) : null}

                  {/* Pet Details - Read Only */}
                  <Card
                    bordered={false}
                    className={styles.detailsCard}
                    title={pet.name}
                  >
                    <div className={styles.detailsGrid}>
                      {pet.birthDate && (
                        <div className={styles.detailItem}>
                          <Text className={styles.detailLabel}>Birth Date</Text>
                          <Text className={styles.detailValue}>{new Date(pet.birthDate).toLocaleDateString()}</Text>
                        </div>
                      )}
                      {pet.gender && (
                        <div className={styles.detailItem}>
                          <Text className={styles.detailLabel}>Gender</Text>
                          <Text className={styles.detailValue}>{pet.gender}</Text>
                        </div>
                      )}
                      {pet.weight && (
                        <div className={styles.detailItem}>
                          <Text className={styles.detailLabel}>Weight</Text>
                          <Text className={styles.detailValue}>{pet.weight} kg</Text>
                        </div>
                      )}
                      {pet.height && (
                        <div className={styles.detailItem}>
                          <Text className={styles.detailLabel}>Height</Text>
                          <Text className={styles.detailValue}>{pet.height} cm</Text>
                        </div>
                      )}
                    </div>

                    <div className={styles.colorSection}>
                      <Text className={styles.detailLabel}>Species</Text>
                      <Paragraph className={styles.colorDescription}>
                        {pet.speciesName}
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
                      {pet.name}'s Timeline
                    </Title>
                  </div>

                  <div className={styles.timelineContent}>
                    {postsLoading ? (
                      <div className={styles.timelineLoading}>
                        <Spin size="large" />
                      </div>
                    ) : optimisticPosts && optimisticPosts.length > 0 ? (
                      <div className={styles.postsContainer}>
                        {optimisticPosts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onLike={handlePostLike}
                            onComment={handlePostComment}
                            onShare={handlePostShare}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card bordered={false} className={styles.emptyTimelineCard}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={`${pet.name} hasn't posted anything yet`}
                        />
                      </Card>
                    )}
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </motion.main>
      </div>

      {/* Photo Gallery Modal */}
      {pet && (
        <PhotoGalleryModal
          visible={showGalleryModal}
          onClose={() => setShowGalleryModal(false)}
          petName={pet.name}
          media={pet.media || []}
        />
      )}

      {/* Upload Media Modal */}
      {pet && isOwner && (
        <UploadMediaModal
          visible={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          petId={pet.id}
          petName={pet.name}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Followers Modal */}
      {pet && petIdNumber && (
        <PetFollowersModal
          visible={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          petId={petIdNumber}
          petName={pet.name}
        />
      )}

      {/* Comment Modal */}
      <CommentModal
        postId={activePostId}
        open={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setActivePostId(null);
        }}
        title={activePostId && optimisticPosts ? `${optimisticPosts.find(p => p.id === activePostId)?.authorName || pet?.name || 'Post'}'s Post` : 'Comments'}
      />
    </>
  );
};
