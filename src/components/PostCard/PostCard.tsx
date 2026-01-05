import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, Avatar, Button, Typography, Space, Image } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { usePostActions } from '@/hooks';
import type { Post } from '@/domain/post';
import styles from './PostCard.module.css';

const { Paragraph } = Typography;

interface PostCardProps {
  post: Post;
  onLike?: (postId: number, isLiked: boolean) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
}) => {
  const { likePost, sharePost, loading } = usePostActions();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [shareCount, setShareCount] = useState(post.shareCount);

  const handleLike = async () => {
    try {
      const newLikedState = await likePost(post.id, isLiked);
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      onLike?.(post.id, newLikedState);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleShare = async () => {
    try {
      await sharePost(post.id);
      setShareCount(prev => prev + 1);
      onShare?.(post.id);
    } catch (error) {
      console.error('Failed to share post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.postCardWrapper}
    >
      <Card
        bordered={false}
        className={styles.postCard}
      >
        {/* Post Header */}
        <div className={styles.postHeader}>
          <Space align="center">
            <Avatar
              src={post.authorAvatar}
              size={40}
              style={{ backgroundColor: '#1890FF' }}
            >
              {post.authorName.charAt(0)}
            </Avatar>
            <div>
              <div className={styles.authorName}>{post.authorName}</div>
              <div className={styles.postDate}>{formatDate(post.createdAt)}</div>
            </div>
          </Space>
        </div>

        {/* Post Content */}
        <div className={styles.postContent}>
          <Paragraph className={styles.postText}>
            {post.content}
          </Paragraph>

          {/* Post Media */}
          {post.media && post.media.length > 0 && (
            <div className={styles.postMedia}>
              {post.media.length === 1 ? (
                <Image
                  src={post.media[0].url}
                  alt="Post image"
                  className={styles.singleImage}
                  style={{ borderRadius: 12 }}
                />
              ) : (
                <div className={styles.mediaGrid}>
                  {post.media.map((media, index) => (
                    <Image
                      key={media.id}
                      src={media.url}
                      alt={`Post image ${index + 1}`}
                      className={styles.gridImage}
                      style={{ borderRadius: 8 }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className={styles.postActions}>
          <Space size="large">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={isLiked ?
                  <HeartFilled style={{ color: '#EB5757' }} /> :
                  <HeartOutlined />
                }
                onClick={handleLike}
                loading={loading[`like-${post.id}`]}
                className={styles.actionButton}
              >
                <span className={isLiked ? styles.likedText : styles.actionText}>
                  {likeCount}
                </span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={<CommentOutlined />}
                onClick={() => onComment?.(post.id)}
                className={styles.actionButton}
              >
                <span className={styles.actionText}>{post.commentCount}</span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                loading={loading[`share-${post.id}`]}
                className={styles.actionButton}
              >
                <span className={styles.actionText}>{shareCount}</span>
              </Button>
            </motion.div>
          </Space>
        </div>
      </Card>
    </motion.div>
  );
};
