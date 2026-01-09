import React, { useState } from 'react';
import { Row, Col, Button, message, Spin, Empty } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import PostCard from '@/components/PostCard/PostCard';
import { CreatePostModal } from '@/components/CreatePostModal/CreatePostModal';
import CommentModal from '@/components/CommentDrawer/CommentDrawer';
import LikesModal from '@/components/LikesModal/LikesModal';
import { pageVariants } from '@/animations/variants';
import { useNewsFeed, usePostActions } from '@/hooks';
import styles from './MainFeedPage.module.css';

const MainFeedPage: React.FC = () => {
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [activeLikesPostId, setActiveLikesPostId] = useState<number | null>(null);

  // Sử dụng hooks API thực thay vì mock
  const { posts, loading, error, refreshing, refresh } = useNewsFeed();
  const { likePost } = usePostActions();

  // Local state cho optimistic updates
  const [optimisticPosts, setOptimisticPosts] = useState(posts);

  // Sync posts với optimisticPosts
  React.useEffect(() => {
    setOptimisticPosts(posts);
  }, [posts]);

  const handlePostLike = async (postId: number) => {
    const post = optimisticPosts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update - cập nhật UI ngay lập tức
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
      // Gọi API để sync với server
      const result = await likePost(postId);

      // Cập nhật với data thực từ server
      const serverUpdatedPosts = optimisticPosts.map(p =>
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
      // Revert optimistic update nếu lỗi
      setOptimisticPosts(posts);
      message.error('Failed to update like. Please try again.');
    }
  };

  const handlePostComment = (postId: number) => {
    // Open comment drawer for the selected post
    setActivePostId(postId);
    setCommentDrawerOpen(true);
  };

  const handleViewLikes = (postId: number) => {
    setActiveLikesPostId(postId);
    setLikesModalOpen(true);
  };

  // Called when a new comment is added in the comment modal
  const handleCommentAdded = (newCount: number) => {
    if (!activePostId) return;
    setOptimisticPosts(prev => prev.map(p => p.id === activePostId ? { ...p, commentCount: newCount } : p));
  };

  const handlePostShare = (postId: number) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', postId);
    message.success('Post shared! (Mock action)');
  };


  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={styles.feedContainer}
    >
      {/* Header với nút Refresh */}
      <div className={styles.feedHeader}>
        <h1 className={styles.feedTitle}>News Feed</h1>
        <div className={styles.feedActions}>
          <Button
            icon={<ReloadOutlined />}
            onClick={refresh}
            loading={refreshing}
            className={styles.refreshButton}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreatePostModalVisible(true)}
          >
            Create Post
          </Button>
        </div>
      </div>

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
          <p className={styles.loadingText}>Loading your timeline...</p>
        </div>
      ) : (
        <>
          <div className={styles.feedContent}>
            <Row justify="center">
              {/* Make the feed column wider for more horizontal space */}
              <Col xs={24} md={22} lg={20} xl={18} xxl={16}>
                {optimisticPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.emptyState}
                  >
                    <Empty
                      description="No posts yet. Follow some pets to see their updates!"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreatePostModalVisible(true)}
                        className={styles.createFirstPostButton}
                      >
                        Create Your First Post
                      </Button>
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
                      >
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
        </>
      )}

      {/* Comment Drawer */}
      <CommentModal
        postId={activePostId}
        open={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        title={activePostId ? `${(optimisticPosts.find(p => p.id === activePostId)?.authorName) || 'Post'}'s Post` : 'Comments'}
        onCommentAdded={handleCommentAdded}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        open={createPostModalVisible}
        onClose={() => setCreatePostModalVisible(false)}
      />

      {/* Likes Modal */}
      <LikesModal open={likesModalOpen} postId={activeLikesPostId} onClose={() => setLikesModalOpen(false)} />
    </motion.div>
  );
};

export default MainFeedPage;
