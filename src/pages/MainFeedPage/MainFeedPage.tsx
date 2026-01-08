import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, message, Spin, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import PostCard from '@/components/PostCard/PostCard';
import { CreatePostModal } from '@/components/CreatePostModal/CreatePostModal';
import { pageVariants } from '@/animations/variants';
import {
  getTimelineFeed,
  toggleTimelinePostLike
} from '@/services/post.service.mock';
import type { TimelineFeed } from '@/domain/post';
import styles from './MainFeedPage.module.css';

const MainFeedPage: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineFeed>({ posts: [], hasMore: true });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const loadTimeline = useCallback(async (isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      const result = await getTimelineFeed(10, isInitial ? undefined : timeline.lastPostId);

      setTimeline(prev => ({
        posts: isInitial ? result.posts : [...prev.posts, ...result.posts],
        hasMore: result.hasMore,
        lastPostId: result.lastPostId
      }));
    } catch (error) {
      console.error('Failed to load timeline:', error);
      message.error('Failed to load posts. Please try again.');
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, [timeline.lastPostId]);

  // Load initial timeline
  useEffect(() => {
    loadTimeline(true);
  }, [loadTimeline]);

  const handlePostLike = async (postId: number) => {
    try {
      const result = await toggleTimelinePostLike(postId);

      setTimeline(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? { ...post, isLiked: result.isLiked, likeCount: result.likeCount }
            : post
        )
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
      message.error('Failed to update like. Please try again.');
    }
  };

  const handlePostComment = (postId: number) => {
    // TODO: Open comment modal/drawer
    message.info(`Comment on post ${postId} - Coming soon!`);
  };

  const handlePostShare = (postId: number) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', postId);
    message.success('Post shared! (Mock action)');
  };
  const loadMorePosts = () => {
    if (!loading && timeline.hasMore) {
      loadTimeline(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={styles.feedContainer}
    >
        {initialLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p className={styles.loadingText}>Loading your timeline...</p>
          </div>
        ) : (
          <>
            <div className={styles.feedContent}>
              <Row justify="center">
                <Col xs={24} md={20} lg={16} xl={14} xxl={12}>
                  {timeline.posts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className={styles.emptyState}
                    >
                      <Empty
                        description="No posts yet"
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
                    <>
                      <div className={styles.postsContainer}>
                        {timeline.posts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <PostCard
                              post={post}
                              onLike={handlePostLike}
                              onComment={handlePostComment}
                              onShare={handlePostShare}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {timeline.hasMore && (
                        <div className={styles.loadMoreContainer}>
                          <Button
                            type="default"
                            size="large"
                            onClick={loadMorePosts}
                            loading={loading}
                            className={styles.loadMoreButton}
                          >
                            {loading ? 'Loading...' : 'Load More Posts'}
                          </Button>
                        </div>
                      )}

                      {!timeline.hasMore && timeline.posts.length > 0 && (
                        <div className={styles.endMessage}>
                          <p>You've reached the end of your timeline! 🎉</p>
                        </div>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </div>
          </>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          open={createPostModalVisible}
          onClose={() => setCreatePostModalVisible(false)}
        />
      </motion.div>
  );
};

export default MainFeedPage;
