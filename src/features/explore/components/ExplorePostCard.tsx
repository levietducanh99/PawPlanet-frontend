import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import { HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { ExplorePostItem } from '@/domain/explore';
import styles from './ExplorePostCard.module.css';
import { useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

interface ExplorePostCardProps {
  item: ExplorePostItem;
}

export const ExplorePostCard: React.FC<ExplorePostCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { data } = item;

  const handleClick = () => {
    navigate(`/post/${data.id}`);
  };

  const hasMedia = data.mediaUrls && data.mediaUrls.length > 0;

  return (
    <Card
      className={styles.postCard}
      onClick={handleClick}
      cover={
        hasMedia ? (
          <div className={styles.mediaContainer}>
            <img
              src={data.mediaUrls![0]}
              alt="Post media"
              className={styles.media}
              onError={(e) => {
                e.currentTarget.src = '/image/default-pet-avatar.jpg';
              }}
            />
          </div>
        ) : null
      }
    >
      <div className={styles.content}>
        {data.content && (
          <Paragraph
            className={`${styles.text} ${hasMedia ? styles.hasMedia : styles.noMedia}`}
          >
            {data.content}
          </Paragraph>
        )}

        <div className={styles.meta}>
          <div className={styles.author}>
            <Avatar
              size={32}
              src={data.author.avatarUrl}
              style={{ backgroundColor: '#1890FF' }}
            >
              {data.author.username[0]?.toUpperCase()}
            </Avatar>
            <Text className={styles.username}>
              {data.author.username}
            </Text>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <HeartOutlined />
              <Text>{data.likeCount}</Text>
            </span>
            <span className={styles.stat}>
              <MessageOutlined />
              <Text>{data.commentCount}</Text>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

