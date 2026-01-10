import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Result, message, Modal, Input, Avatar } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import {usePostDetail, usePostComments, usePostActions, useUserProfile} from '@/hooks';
import { togglePostLike } from '@/services/like.service';
import { PostCard } from '@/components';
import { EditPostModal } from '@/components/EditPostModal';
import { pageVariants } from '@/animations/variants';
import { formatDateTime } from '@/utils/dateUtils';
import type { Post } from '@/domain/post';
import type { UpdatePostRequest } from '@/services/api';
import styles from './PostDetailPage.module.css';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const postIdNum = postId ? parseInt(postId, 10) : null;

  const { post, loading, error } = usePostDetail(postIdNum);
  const {
    comments,
    loading: commentsLoading,
    creating: commentCreating,
    addComment,
    refetch: refetchComments,
  } = usePostComments(postIdNum);
  const { deletePost, updatePost, loading: actionLoading } = usePostActions();
  const { user } = useUserProfile();

  // Local state for post to handle real-time updates
  const [localPost, setLocalPost] = useState<Post | null>(null);

  // Comment input state
  const [commentInput, setCommentInput] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Reset state when postId changes (fix 404 not found bug)
  useEffect(() => {
    // Clear local state when navigating to a new post
    setLocalPost(null);
    setCommentInput('');
    setEditModalOpen(false);
    window.scrollTo(0, 0);
  }, [postId]);

  // Update local post when fetched post changes
  useEffect(() => {
    if (post) {
      setLocalPost(post);
    }
  }, [post]);


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

  const handleDelete = async (postId: number) => {
    Modal.confirm({
      title: 'Delete Post',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this post? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePost(postId);
          message.success('Post deleted successfully');
          // Navigate back after successful deletion
          navigate(-1);
        } catch (err) {
          message.error('Failed to delete post');
          console.error('Delete error:', err);
        }
      },
    });
  };

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await addComment(commentInput.trim());
      setCommentInput('');
      message.success('Comment added successfully');

      // Update local post comment count
      if (localPost) {
        setLocalPost({
          ...localPost,
          commentCount: localPost.commentCount + 1,
        });
      }

      // Refresh comments to show the new one
      refetchComments();
    } catch (err) {
      message.error('Failed to add comment');
      console.error('Comment error:', err);
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleUpdatePost = async (postId: number, data: UpdatePostRequest) => {
    try {
      const updatedPost = await updatePost(postId, data);
      if (updatedPost) {
        setLocalPost(updatedPost);
        message.success('Post updated successfully');
      }
      setEditModalOpen(false);
    } catch (err) {
      message.error('Failed to update post');
      console.error('Update error:', err);
      throw err; // Re-throw to let modal handle it
    }
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
          onDelete={handleDelete}
          onEdit={handleEdit}

        />
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h2 className={styles.commentsTitle}>
            Comments ({comments.length})
          </h2>
        </div>

        {/* Comment Input Form */}
        <div className={styles.commentInputContainer}>
          <Avatar
            src={user?.avatarUrl || '/placeholder-avatar.svg'}
            size={40}
            className={styles.commentInputAvatar}
          />
          <Input.TextArea
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onPressEnter={(e) => {
              if (e.shiftKey) return; // Allow shift+enter for new line
              e.preventDefault();
              handleSubmitComment();
            }}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className={styles.commentInput}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmitComment}
            loading={commentCreating}
            disabled={!commentInput.trim()}
            className={styles.commentSubmitButton}
          >
            Send
          </Button>
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
                <div className={styles.commentAvatar}
                     onClick={() => navigate(`/user/${comment?.userId}`)}
                     style={{cursor: 'pointer'}}>
                  <img
                    src={comment.userAvatar || '/placeholder-avatar.svg'}
                    alt={comment.userName}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.commentContent} >
                  <div className={styles.commentAuthor}
                       onClick={() => navigate(`/user/${comment?.userId}`)}
                       style={{cursor: 'pointer'}}>
                    {comment.userName}
                  </div>
                  <div className={styles.commentText}>{comment.content}</div>
                  <div className={styles.commentTime}>
                    {formatDateTime(comment.createdAt)}
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

      {/* Edit Post Modal */}
      <EditPostModal
        open={editModalOpen}
        post={localPost}
        loading={actionLoading[`update-${localPost?.id}`]}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdatePost}
      />
    </motion.div>
  );
};

