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

export const ExplorePetCard: React.FC<ExplorePetCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { data } = item;

  const handleClick = () => {
    navigate(`/pets/${data.id}`);
  };

  return (
    <Card
      className={styles.petCard}
      bordered={false}
      onClick={handleClick}
    >
      <div className={styles.avatarContainer}>
        <Avatar
          size={120}
          src={data.avatarUrl}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
      </div>

      <div className={styles.content}>
        <Title level={4} className={styles.name} ellipsis>
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

