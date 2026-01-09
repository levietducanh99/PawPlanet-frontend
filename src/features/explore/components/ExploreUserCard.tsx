import React from 'react';
import { Card, Avatar, Typography, Button } from 'antd';
import { UserOutlined, HeartOutlined } from '@ant-design/icons';
import { ExploreUserItem } from '@/domain/explore';
import styles from './ExploreUserCard.module.css';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface ExploreUserCardProps {
  item: ExploreUserItem;
}

export const ExploreUserCard: React.FC<ExploreUserCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { data } = item;

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the follow button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/profile/${data.username}`);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement follow logic
    console.log('Follow user:', data.id);
  };

  return (
    <Card
      className={styles.userCard}
      bordered={false}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <Avatar
          size={64}
          src={data.avatarUrl}
          icon={<UserOutlined />}
          className={styles.avatar}
        />

        <div className={styles.info}>
          <Title level={5} className={styles.username} ellipsis>
            {data.username}
          </Title>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <UserOutlined />
              <Text>{data.petCount} pets</Text>
            </span>
            <span className={styles.stat}>
              <HeartOutlined />
              <Text>{data.followerCount} followers</Text>
            </span>
          </div>
        </div>

        {!data.isFollowing && (
          <Button
            type="primary"
            size="small"
            className={styles.followButton}
            onClick={handleFollow}
          >
            Follow
          </Button>
        )}
      </div>
    </Card>
  );
};

