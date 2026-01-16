import React, { useState } from 'react';
import { Row, Col, Button, message, Spin, Empty, Alert } from 'antd';
import { ReloadOutlined, AlertOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import PostCard from '@/components/PostCard/PostCard';
import CommentModal from '@/components/CommentDrawer/CommentDrawer';
import LikesModal from '@/components/LikesModal/LikesModal';
import { pageVariants } from '@/animations/variants';
import { useUrgentPosts, usePostActions } from '@/hooks';
import styles from './CareSupportPage.module.css';

const CareSupportPage: React.FC = () => {
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [activeLikesPostId, setActiveLikesPostId] = useState<number | null>(null);

  // Fetch urgent posts
  const { posts, loading, error, refreshing, refresh } = useUrgentPosts();
  const { likePost } = usePostActions();

  // Local state for optimistic updates
  const [optimisticPosts, setOptimisticPosts] = useState(posts);

  // Sync posts with optimisticPosts
  React.useEffect(() => {
    setOptimisticPosts(posts);
  }, [posts]);

  const handlePostLike = async (postId: number) => {
    const post = optimisticPosts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    const optimisticUpdatedPosts = optimisticPosts.map(p =>
      p.id === postId
        ? {
            ...p,
            isLiked: !p.isLiked,
            likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
          }
        : p
    );
    setOptimisticPosts(optimisticUpdatedPosts);

    try {
      // Call API to sync with server
      const result = await likePost(postId);

      // Update with real data from server using functional update
      setOptimisticPosts(prev => prev.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: result.liked,
              likeCount: result.likeCount,
            }
          : p
      ));
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setOptimisticPosts(posts);
      message.error('Failed to update like. Please try again.');
    }
  };

  const handlePostComment = (postId: number) => {
    setActivePostId(postId);
    setCommentDrawerOpen(true);
  };

  const handleViewLikes = (postId: number) => {
    setActiveLikesPostId(postId);
    setLikesModalOpen(true);
  };

  const handleCommentAdded = (newCount: number) => {
    if (!activePostId) return;
    setOptimisticPosts(prev => prev.map(p => p.id === activePostId ? { ...p, commentCount: newCount } : p));
  };

  const handlePostShare = (postId: number) => {
    console.log('Sharing post:', postId);
    message.success('Post shared! (Mock action)');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={styles.pageContainer}
    >
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <img
            src="/image/care.png"
            alt="Care & Support"
            className={styles.careImage}
          />
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={refreshing}
          className={styles.refreshButton}
        >
          Refresh
        </Button>
      </div>

      {/* Info Banner */}
      <Alert
        message="These posts require urgent care and support"
        description="Help fellow pet owners by responding to urgent requests for help, advice, or emergency support."
        type="warning"
        showIcon
        icon={<AlertOutlined />}
        className={styles.infoBanner}
      />

      {/* Error State */}
      {error && (
        <div className={styles.errorContainer}>
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={refresh}>
              Try Again
            </Button>
          </Empty>
        </div>
      )}

      {/* Loading State */}
      {loading && optimisticPosts.length === 0 ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p className={styles.loadingText}>Loading urgent posts...</p>
        </div>
      ) : (
        <div className={styles.feedContent}>
          <Row justify="center">
            <Col xs={24} md={22} lg={20} xl={18} xxl={16}>
              {optimisticPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={styles.emptyState}
                >
                  <Empty
                    description="No urgent posts at the moment"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <p className={styles.emptySubtext}>
                      Check back later for posts that need urgent care and support.
                    </p>
                  </Empty>
                </motion.div>
              ) : (
                <div className={styles.postsContainer}>
                  {optimisticPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={styles.urgentPostWrapper}
                    >
                      <div className={styles.urgentBadge}>
                        <AlertOutlined /> URGENT
                      </div>
                      <PostCard
                        post={post}
                        onLike={handlePostLike}
                        onComment={handlePostComment}
                        onShare={handlePostShare}
                        onViewLikes={handleViewLikes}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </div>
      )}

      {/* Comment Drawer */}
      <CommentModal
        postId={activePostId}
        open={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        title={activePostId ? `${(optimisticPosts.find(p => p.id === activePostId)?.authorName) || 'Post'}'s Post` : 'Comments'}
        onCommentAdded={handleCommentAdded}
      />

      {/* Likes Modal */}
      <LikesModal open={likesModalOpen} postId={activeLikesPostId} onClose={() => setLikesModalOpen(false)} />
    </motion.div>
  );
};

export default CareSupportPage;
