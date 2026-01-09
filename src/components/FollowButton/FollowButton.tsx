/**
 * FollowButton Component
 * Reusable button for following/unfollowing users
 */

import React from 'react';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useFollowActions } from '@/hooks';
import styles from './FollowButton.module.css';

interface FollowButtonProps {
  userId: number;
  initialFollowing?: boolean;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'text';
  showIcon?: boolean;
  onFollowChange?: (following: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing = false,
  size = 'large',
  type,
  showIcon = true,
  onFollowChange,
}) => {
  const { following, loading, toggleFollow } = useFollowActions(userId, initialFollowing);

  const handleClick = async () => {
    await toggleFollow();
    onFollowChange?.(following);
  };

  // Determine button type based on following state if not explicitly set
  const buttonType = type || (following ? 'default' : 'primary');

  return (
    <Button
      type={buttonType}
      size={size}
      icon={showIcon ? (following ? <HeartFilled /> : <HeartOutlined />) : undefined}
      loading={loading}
      onClick={handleClick}
      className={`${styles.followButton} ${following ? styles.following : ''}`}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
};

