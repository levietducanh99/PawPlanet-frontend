import React, { useState } from 'react';
import { Card, Avatar, Button, Space, Typography, Tag, Divider, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import type { Post } from '@/domain/post';
import { PetTag } from '@/components/PetTag';
import { formatTimeAgoShort } from '@/utils/dateUtils';
import styles from './PostCard.module.css';
import {useNavigate} from "react-router-dom";
import LikesPopover from '@/components/LikesPopover/LikesPopover';

const { Text, Paragraph } = Typography;


interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onShare: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  onViewLikes?: (postId: number) => void;
}



const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare, onDelete, onEdit, onViewLikes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();


  // uiPost extends Post with optional UI-only fields used by the component
  const uiPost = post as Post & {
    petAvatar?: string;
    badge?: string;
    petOwnerName?: string;
    petDisplay?: string;
  };


  const prev = () => {
    setCurrentIndex((i) => (i - 1 + (post.media?.length || 1)) % (post.media?.length || 1));
  };
  const next = () => {
    setCurrentIndex((i) => (i + 1) % (post.media?.length || 1));
  };

  // Render tagged pets using PetTag component
  const renderPetTags = () => {
    if (!post.taggedPets || post.taggedPets.length === 0) return null;


    return (
      <div className={styles.petTagsContainer}>
        {post.taggedPets.map((pet) => (
          <PetTag
            key={pet.id}
            id={pet.id}
            name={pet.name}
            species={pet.species}
            breed={pet.breed}
            avatarUrl={pet.avatarUrl}
            onClick={() => navigate(`/pet/${pet?.id}`)}
          />
        ))}
      </div>
    );
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    // Carousel view (works for single or multiple)
    const items = post.media;
    const active = items[currentIndex];

    return (
      <div className={styles.mediaCarousel}>
        <div className={styles.carouselViewport}>
          {active.type === 'video' ? (
            <video
              src={active.url}
              poster={active.thumbnailUrl}
              controls
              className={styles.mediaItem}
            />
          ) : (
            <img
              src={active.url}
              alt={`Post media ${currentIndex + 1}`}
              className={styles.mediaItem}
            />
          )}

          {/* Left / Right arrows (show only if >1) */}
          {items.length > 1 && (
            <>
              <button aria-label="Previous" onClick={prev} className={styles.carouselPrev}>
                <LeftOutlined />
              </button>
              <button aria-label="Next" onClick={next} className={styles.carouselNext}>
                <RightOutlined />
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {items.length > 1 && (
          <div className={styles.carouselIndicators}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`${styles.indicator} ${i === currentIndex ? styles.indicatorActive : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const menuItems: MenuProps['items'] = [
    { key: '1', label: 'Edit' },
    { key: '2', label: 'Delete' },
    { key: '3', label: 'Report' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '1': // Edit
        if (onEdit) {
          onEdit(post.id);
        }
        break;
      case '2': // Delete
        if (onDelete) {
          onDelete(post.id);
        }
        break;
      case '3': // Report
        console.log('Report post:', post.id);
        break;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={styles.cardWrapper}
    >
      <Card variant="borderless" className={styles.postCard}>
        {/* Header */}
        <div className={styles.postHeaderNew}>
          <Space size="middle" align="start">
            <div className={styles.avatarWrapper} 
                 onClick={() => navigate(`/user/${post?.authorId}`)}
                 style={{cursor: 'pointer'}}>
              <Avatar src={uiPost.authorAvatar} size={56} className={styles.avatarRing} />
              {uiPost.petAvatar && (
                <Avatar src={uiPost.petAvatar} size={28} className={styles.petAvatar} />
              )}
            </div>

            <div className={styles.authorInfoNew}>
              <div className={styles.nameRow}>
                <Text className={styles.displayName} strong>{uiPost.authorName}</Text>
                {uiPost.badge && (
                  <Tag className={styles.badgeTag} color="#EAE6FF">{uiPost.badge}</Tag>
                )}
              </div>

              <div className={styles.subline}>
                <Text type="secondary">{formatTimeAgoShort(post.createdAt)}</Text>

              </div>
            </div>
          </Space>

          <div className={styles.headerActions}>
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>

        {/* Content */}
        <div className={styles.postContent}>
          <Paragraph className={styles.contentText}>
            {post.content}
          </Paragraph>

          {/* Pet Tags Pills */}
          {renderPetTags()}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {post.tags.map((tag) => (
                <Text key={tag} className={styles.hashtag}>#{tag}</Text>
              ))}
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
              <LikesPopover postId={uiPost.id} onViewAll={(id) => onViewLikes && onViewLikes(id)}>
                <Button
                  type="text"
                  icon={uiPost.isLiked ?
                    <HeartFilled style={{ color: '#EB5757' }} /> :
                    <HeartOutlined />
                  }
                  onClick={() => onLike(uiPost.id)}
                  className={styles.actionButton}
                >
                  <span className={uiPost.isLiked ? styles.likedText : styles.actionText}>{uiPost.likeCount}</span>
                </Button>
              </LikesPopover>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={<CommentOutlined />}
                onClick={() => onComment(post.id)}
                className={styles.actionButton}
              >
                <span className={styles.actionText}>{post.commentCount}</span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={() => onShare(post.id)}
                className={styles.actionButton}
              >
                <span className={styles.actionText}>{post.shareCount}</span>
              </Button>
            </motion.div>
          </Space>
        </div>
      </Card>
    </motion.div>
  );
};

export default PostCard;
