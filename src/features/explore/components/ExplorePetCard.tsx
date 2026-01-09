import React from 'react';
import { Card, Avatar, Typography, Tag } from 'antd';
import { UserOutlined, HeartOutlined } from '@ant-design/icons';
import { ExplorePetItem } from '@/domain/explore';
import styles from './ExplorePetCard.module.css';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface ExplorePetCardProps {
  item: ExplorePetItem;
}

// Gradient backgrounds for variety
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

export const ExplorePetCard: React.FC<ExplorePetCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { data } = item;

  // Pick gradient based on pet ID for consistency
  const gradientIndex = Number(data.id) % gradients.length;
  const gradient = gradients[gradientIndex];

  const handleClick = () => {
    navigate(`/pets/${data.id}`);
  };

  return (
    <Card
      className={styles.petCard}
      onClick={handleClick}
    >
      <div className={styles.avatarContainer} style={{ background: gradient }}>
        <Avatar
          size={120}
          src={data.avatarUrl}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
      </div>

      <div className={styles.content}>
        <Title level={4} className={styles.name}>
          {data.name}
        </Title>

        {(data.species || data.breed) && (
          <div className={styles.tags}>
            {data.species && (
              <Tag color="blue" className={styles.tag}>
                {data.species}
              </Tag>
            )}
            {data.breed && (
              <Tag color="cyan" className={styles.tag}>
                {data.breed}
              </Tag>
            )}
          </div>
        )}

        <div className={styles.meta}>
          <div className={styles.owner}>
            <UserOutlined />
            <Text className={styles.ownerName}>
              {data.owner.username}
            </Text>
          </div>

          <div className={styles.followers}>
            <HeartOutlined />
            <Text>{data.followerCount}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

