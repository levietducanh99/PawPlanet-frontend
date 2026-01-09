import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Result, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { usePostDetail, usePostComments } from '@/hooks';
import { togglePostLike } from '@/services/like.service';
import { PostCard } from '@/components';
import { pageVariants } from '@/animations/variants';
import type { Post } from '@/domain/post';
import styles from './PostDetailPage.module.css';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const postIdNum = postId ? parseInt(postId, 10) : null;

  const { post, loading, error, refetch } = usePostDetail(postIdNum);
  const {
    comments,
    loading: commentsLoading,
  } = usePostComments(postIdNum);

  // Local state for post to handle real-time updates
  const [localPost, setLocalPost] = useState<Post | null>(null);

  // Update local post when fetched post changes
  useEffect(() => {
    if (post) {
      setLocalPost(post);
    }
  }, [post]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
    if (!localPost) return;

    try {
      // Optimistic update
      setLocalPost({
        ...localPost,
        isLiked: !localPost.isLiked,
        likeCount: localPost.isLiked ? localPost.likeCount - 1 : localPost.likeCount + 1,
      });

      // Call API
      const result = await togglePostLike(localPost.id);

      // Update with actual result from API
      setLocalPost({
        ...localPost,
        isLiked: result.liked,
        likeCount: result.likeCount,
      });
    } catch (err) {
      // Revert on error
      message.error('Failed to update like');
      setLocalPost(post);
    }
  };

  const handleComment = () => {
    // Scroll to comments section
    const commentsSection = document.querySelector(`.${styles.commentsSection}`);
    commentsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = () => {
    // Share functionality - can be implemented later
    console.log('Share clicked');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#6B7280' }}>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <motion.div
        className={styles.errorContainer}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Result
          status="404"
          title="Post Not Found"
          subTitle={error || "The post you're looking for doesn't exist or has been deleted."}
          extra={
            <Button type="primary" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </motion.div>
    );
  }

  // Use localPost for rendering to show real-time updates
  const displayPost = localPost || post;

  return (
    <motion.div
      className={styles.container}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header with Back Button */}
      <div className={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          type="text"
          className={styles.backButton}
        >
          Back
        </Button>
        <h1 className={styles.title}>Post Details</h1>
      </div>

      {/* Post Card */}
      <div className={styles.postContainer}>
        <PostCard
          post={displayPost}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h2 className={styles.commentsTitle}>
            Comments ({comments.length})
          </h2>
        </div>

        {commentsLoading ? (
          <div className={styles.commentsLoading}>
            <Spin />
          </div>
        ) : comments.length > 0 ? (
          <div className={styles.commentsList}>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className={styles.commentItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.commentAvatar}>
                  <img
                    src={comment.userAvatar || '/placeholder-avatar.svg'}
                    alt={comment.userName}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentAuthor}>
                    {comment.userName}
                  </div>
                  <div className={styles.commentText}>{comment.content}</div>
                  <div className={styles.commentTime}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.noComments}>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

