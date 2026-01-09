/**
 * View User Page
 * Displays another user's public profile with their pets and posts
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Tabs, Flex, Button, Card, Spin, Alert, message } from 'antd';
import { UserOutlined, HeartOutlined, PictureOutlined, ArrowLeftOutlined, TeamOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useUserById, useUserPosts, useUserPets, useUserFollowersList, useUserFollowingList, usePostActions } from '@/hooks';
import PostCard from '@/components/PostCard';
import { CommentModal } from '@/components/CommentDrawer/CommentDrawer';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loading } from '@/components/Loading';
import { FollowButton } from '@/components/FollowButton';
import { UserListCard } from '@/components/UserListCard';
import { pageVariants } from '@/animations/variants';
import type { Post } from '@/domain/post';
import styles from './ViewUserPage.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const ViewUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const parsedUserId = userId ? parseInt(userId, 10) : null;

  const { user, loading: userLoading, error: userError, fetchUser } = useUserById();
  const { posts, loading: postsLoading } = useUserPosts(parsedUserId);
  const { pets, loading: petsLoading } = useUserPets(parsedUserId);
  const { followers, loading: followersLoading } = useUserFollowersList(parsedUserId);
  const { following, loading: followingLoading } = useUserFollowingList(parsedUserId);
  const { likePost } = usePostActions();

  // State for comment modal
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);

  // Optimistic posts state for immediate UI updates
  const [optimisticPosts, setOptimisticPosts] = React.useState<Post[]>(posts);

  // Sync optimistic posts with fetched posts
  React.useEffect(() => {
    setOptimisticPosts(posts);
  }, [posts]);

  // Fetch user when userId changes
  React.useEffect(() => {
    if (parsedUserId) {
      fetchUser(parsedUserId);
    }
  }, [parsedUserId, fetchUser]);

  // Post action handlers
  const handleLike = async (postId: number) => {
    try {
      // Optimistic update
      setOptimisticPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p
        )
      );

      // Call API
      const result = await likePost(postId);

      // Update with actual result from server
      if (result) {
        setOptimisticPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: result.liked,
                  likeCount: result.likeCount,
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setOptimisticPosts(posts);
      message.error('Failed to update like. Please try again.');
    }
  };

  const handleComment = (postId: number) => {
    setActivePostId(postId);
    setCommentDrawerOpen(true);
  };

  const handleCommentClose = (updatedCommentCount?: number) => {
    if (updatedCommentCount !== undefined && activePostId) {
      // Update comment count in optimistic posts
      setOptimisticPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === activePostId
            ? { ...p, commentCount: updatedCommentCount }
            : p
        )
      );
    }
    setCommentDrawerOpen(false);
    setActivePostId(null);
  };

  const handleShare = (postId: number) => {
    console.log('Share post:', postId);
    message.success('Post shared! (Feature coming soon)');
  };

  if (userLoading) {
    return <Loading />;
  }

  if (userError || !user) {
    return (
      <ErrorMessage
        message={userError || 'User not found'}
      />
    );
  }

  // Ensure we're displaying the correct user (prevent showing stale data)
  if (user.id !== parsedUserId) {
    return <Loading />;
  }

  // If viewing own profile, redirect to /profile
  if (user.isMe) {
    navigate('/profile', { replace: true });
    return null;
  }

  return (
    <motion.div
      className={styles.viewUserPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header with Back Button */}
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          Back
        </Button>
      </div>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <Row gutter={[24, 24]} align="middle">
          <Col>
            <div className={styles.avatar}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                <UserOutlined style={{ fontSize: 48 }} />
              )}
            </div>
          </Col>
          <Col flex="auto">
            <Title level={2} className={styles.username}>
              {user.fullName || user.username}
            </Title>
            {user.username && user.fullName && (
              <Text type="secondary">@{user.username}</Text>
            )}
            {user.bio && (
              <div className={styles.bio}>
                <Text>{user.bio}</Text>
              </div>
            )}
          </Col>
          <Col>
            <FollowButton
              userId={user.id}
              initialFollowing={user.isFollowing}
            />
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={[32, 16]} className={styles.stats}>
          <Col>
            <div className={styles.statItem}>
              <Title level={4}>{user.petsCount || 0}</Title>
              <Text type="secondary">Pets</Text>
            </div>
          </Col>
          <Col>
            <div className={styles.statItem}>
              <Title level={4}>{user.followersCount || 0}</Title>
              <Text type="secondary">Followers</Text>
            </div>
          </Col>
          <Col>
            <div className={styles.statItem}>
              <Title level={4}>{user.followingCount || 0}</Title>
              <Text type="secondary">Following</Text>
            </div>
          </Col>
          <Col>
            <div className={styles.statItem}>
              <Title level={4}>{posts.length || 0}</Title>
              <Text type="secondary">Posts</Text>
            </div>
          </Col>
        </Row>
      </div>

      {/* Content Tabs */}
      <Tabs defaultActiveKey="posts" className={styles.tabs}>
        <TabPane
          tab={
            <span>
              <PictureOutlined />
              Posts
            </span>
          }
          key="posts"
        >
          {postsLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Spin size="large" />
            </div>
          ) : optimisticPosts.length === 0 ? (
            <Alert
              type="info"
              description={`${user.username} hasn't posted anything yet.`}
              showIcon
            />
          ) : (
            <Flex vertical gap="large" style={{ width: '100%' }}>
              {optimisticPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
            </Flex>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <HeartOutlined />
              Pets ({user.petsCount || 0})
            </span>
          }
          key="pets"
        >
          {petsLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Spin size="large" />
            </div>
          ) : pets.length === 0 ? (
            <Alert
              type="info"
              description={`${user.username} doesn't have any pets yet.`}
              showIcon
            />
          ) : (
            <Row gutter={[24, 24]}>
              {pets.map((pet) => (
                <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
                  <Card
                    hoverable
                    cover={
                      pet.avatar ? (
                        <img src={pet.avatar} alt={pet.name} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <HeartOutlined style={{ fontSize: 48 }} />
                        </div>
                      )
                    }
                    onClick={() => navigate(`/pet/${pet.id}`)}
                  >
                    <Card.Meta
                      title={pet.name}
                      description={pet.speciesName || 'Pet'}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Followers ({user.followersCount || 0})
            </span>
          }
          key="followers"
        >
          {followersLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Spin size="large" />
            </div>
          ) : followers.length === 0 ? (
            <Alert
              type="info"
              description={`${user.username} doesn't have any followers yet.`}
              showIcon
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {followers.map((follower) => (
                <UserListCard key={follower.id} user={follower} />
              ))}
            </div>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Following ({user.followingCount || 0})
            </span>
          }
          key="following"
        >
          {followingLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Spin size="large" />
            </div>
          ) : following.length === 0 ? (
            <Alert
              type="info"
              description={`${user.username} isn't following anyone yet.`}
              showIcon
            />
          ) : (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {following.map((user) => (
                <UserListCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabPane>
      </Tabs>

      {/* Comment Modal */}
      <CommentModal
        postId={activePostId}
        open={commentDrawerOpen}
        onClose={handleCommentClose}
        title={activePostId ? `${user.username}'s Post` : 'Comments'}
      />
    </motion.div>
  );
};

