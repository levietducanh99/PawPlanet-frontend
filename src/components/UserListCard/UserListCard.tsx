/**
 * UserListCard Component
 * Displays a user card in followers/following lists
 */

import React from 'react';
import { Card, Avatar, Typography, Button, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FollowerUser } from '@/services/follow.service';
import styles from './UserListCard.module.css';

const { Text } = Typography;

interface UserListCardProps {
  user: FollowerUser;
  showFollowButton?: boolean;
}

export const UserListCard: React.FC<UserListCardProps> = ({
  user,
  showFollowButton = false
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/${user.id}`);
  };

  return (
    <Card
      className={styles.userCard}
      hoverable
      onClick={handleCardClick}
    >
      <Space direction="horizontal" style={{ width: '100%', alignItems: 'center' }}>
        <Avatar
          size={48}
          src={user.avatarUrl}
          icon={!user.avatarUrl && <UserOutlined />}
        />
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block' }}>
            {user.fullName || user.username}
          </Text>
          {user.username && user.fullName && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              @{user.username}
            </Text>
          )}
          {user.bio && (
            <Text
              type="secondary"
              style={{
                display: 'block',
                fontSize: '12px',
                marginTop: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.bio}
            </Text>
          )}
        </div>
        {showFollowButton && (
          <Button
            type={user.isFollowing ? 'default' : 'primary'}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement follow/unfollow
            }}
          >
            {user.isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </Space>
    </Card>
  );
};

