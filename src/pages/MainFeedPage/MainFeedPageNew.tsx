/**
 * Main Feed Page - Sử dụng API thực từ backend
 *
 * Hiển thị news feed với PostCard component
 */

import React from 'react';
import { motion } from 'motion/react';
import { Spin, Empty, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useNewsFeed, usePostActions } from '@/hooks';
import PostCard from '@/components/PostCard/PostCard';
import { pageVariants } from '@/animations/variants';
import styles from './MainFeedPage.module.css';

const MainFeedPage: React.FC = () => {
  const { posts, loading, error, refreshing, refresh } = useNewsFeed();
  const { likePost, sharePost: sharePostAction } = usePostActions();

  const handleLike = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      await likePost(postId);
      // Refresh để lấy dữ liệu mới
      refresh();
    } catch (err) {
      message.error('Failed to like post');
    }
  };

  const handleComment = (postId: number) => {
    // TODO: Mở modal comment
    console.log('Comment on post:', postId);
    message.info('Comment feature coming soon!');
  };

  const handleShare = async (postId: number) => {
    try {
      await sharePostAction(postId);
      message.success('Post shared successfully!');
    } catch (err) {
      message.error('Failed to share post');
    }
  };

  if (loading && !refreshing) {
    return (
      <motion.div
        className={styles.loadingContainer}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Spin size="large" tip="Loading news feed..." />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={styles.errorContainer}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Empty
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={refresh}>
            Try Again
          </Button>
        </Empty>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.feedContainer}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className={styles.feedHeader}>
        <h1 className={styles.feedTitle}>News Feed</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>

      {posts.length === 0 ? (
        <Empty
          className={styles.emptyState}
          description="No posts yet. Start following pets to see their updates!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className={styles.postsContainer}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MainFeedPage;

