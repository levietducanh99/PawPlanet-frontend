import React from 'react';
import { Card, Avatar, Button, Space, Typography, Tag, Divider } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { motion } from 'motion/react';
import type { Post } from '@/domain/post';
import styles from './PostCard.module.css';

const { Text, Paragraph } = Typography;

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onShare: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'adoption': return '#F2994A';
      case 'lost': return '#EB5757';
      case 'found': return '#27AE60';
      case 'story': return '#1890FF';
      default: return '#6B7280';
    }
  };

  const getPostTypeText = (type: string) => {
    switch (type) {
      case 'adoption': return 'For Adoption';
      case 'lost': return 'Lost Pet';
      case 'found': return 'Found Pet';
      case 'story': return 'Pet Story';
      default: return 'General';
    }
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    if (post.media.length === 1) {
      const media = post.media[0];
      return (
        <div className={styles.singleMedia}>
          {media.type === 'video' ? (
            <video
              src={media.url}
              poster={media.thumbnailUrl}
              controls
              className={styles.mediaItem}
            />
          ) : (
            <img
              src={media.url}
              alt="Post media"
              className={styles.mediaItem}
            />
          )}
        </div>
      );
    }

    // Multiple media - horizontal scroll gallery
    return (
      <div className={styles.mediaGallery}>
        {post.media.map((media) => (
          <div key={media.id} className={styles.galleryItem}>
            {media.type === 'video' ? (
              <video
                src={media.url}
                poster={media.thumbnailUrl}
                controls
                className={styles.galleryMedia}
              />
            ) : (
              <img
                src={media.url}
                alt="Post media"
                className={styles.galleryMedia}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={styles.cardWrapper}
    >
      <Card bordered={false} className={styles.postCard}>
        {/* Header */}
        <div className={styles.postHeader}>
          <Space size="middle">
            <Avatar
              src={post.authorAvatar}
              size={48}
              className={styles.avatar}
            />
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>
                <Text strong>{post.authorName}</Text>
                <Text type="secondary" className={styles.username}>
                  @{post.authorUsername}
                </Text>
              </div>
              <Space size="small" className={styles.metadata}>
                <Text type="secondary" className={styles.timestamp}>
                  {formatTimeAgo(post.createdAt)}
                </Text>
                {post.location && (
                  <>
                    <Text type="secondary">•</Text>
                    <Space size={4}>
                      <EnvironmentOutlined style={{ color: '#6B7280' }} />
                      <Text type="secondary" className={styles.location}>
                        {post.location}
                      </Text>
                    </Space>
                  </>
                )}
              </Space>
            </div>
          </Space>

          {/* Post type tag */}
          {post.type !== 'general' && (
            <Tag
              style={{
                backgroundColor: getPostTypeColor(post.type),
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                fontWeight: 500
              }}
            >
              {getPostTypeText(post.type)}
            </Tag>
          )}
        </div>

        {/* Content */}
        <div className={styles.postContent}>
          <Paragraph className={styles.contentText}>
            {post.content}
          </Paragraph>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {post.tags.map((tag) => (
                <Text key={tag} className={styles.hashtag}>
                  #{tag}
                </Text>
              ))}
            </div>
          )}

          {/* Contact info for lost/found/adoption posts */}
          {post.contactInfo && (
            <div className={styles.contactInfo}>
              <Space>
                <PhoneOutlined style={{ color: '#1890FF' }} />
                <Text strong style={{ color: '#1890FF' }}>
                  {post.contactInfo}
                </Text>
              </Space>
            </div>
          )}

          {/* Pet info */}
          {post.petName && (
            <div className={styles.petInfo}>
              <Text type="secondary">
                Featuring: <Text strong>{post.petName}</Text>
              </Text>
            </div>
          )}
        </div>

        {/* Media */}
        {renderMedia()}

        <Divider className={styles.divider} />

        {/* Actions */}
        <div className={styles.postActions}>
          <Space size="large" className={styles.actionButtons}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={post.isLiked ?
                  <HeartFilled style={{ color: '#EB5757' }} /> :
                  <HeartOutlined />
                }
                onClick={() => onLike(post.id)}
                className={styles.actionButton}
              >
                <span className={post.isLiked ? styles.likedText : styles.actionText}>
                  {post.likeCount}
                </span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={<CommentOutlined />}
                onClick={() => onComment(post.id)}
                className={styles.actionButton}
              >
                <span className={styles.actionText}>
                  {post.commentCount}
                </span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={() => onShare(post.id)}
                className={styles.actionButton}
              >
                <span className={styles.actionText}>
                  {post.shareCount}
                </span>
              </Button>
            </motion.div>
          </Space>
        </div>
      </Card>
    </motion.div>
  );
};

export default PostCard;
