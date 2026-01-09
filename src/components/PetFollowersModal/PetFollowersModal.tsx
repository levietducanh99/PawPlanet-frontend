// src/components/PetFollowersModal/PetFollowersModal.tsx
import React, { useEffect } from 'react';
import { Modal, List, Avatar, Typography, Empty, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { usePetFollowers } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import styles from './PetFollowersModal.module.css';

const { Text } = Typography;

export interface PetFollowersModalProps {
  visible: boolean;
  onClose: () => void;
  petId: number;
  petName: string;
}

export const PetFollowersModal: React.FC<PetFollowersModalProps> = ({
  visible,
  onClose,
  petId,
  petName,
}) => {
  const navigate = useNavigate();
  const { followers, loading, fetchFollowers } = usePetFollowers();

  // Fetch followers when modal becomes visible
  useEffect(() => {
    if (visible && petId) {
      console.log('🔵 PetFollowersModal: Fetching followers for petId:', petId);
      fetchFollowers(petId);
    }
  }, [visible, petId, fetchFollowers]); // fetchFollowers is now stable due to useCallback

  const handleUserClick = (username: string | undefined) => {
    if (username) {
      // We have only username here; try to resolve to user id via followers list
      const user = followers.find(f => f.username === username);
      if (user) {
        onClose();
        navigate(`/user/${user.id}`);
      }
    }
  };

  return (
    <Modal
      title={`${petName}'s Followers`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className={styles.followersModal}
      styles={{
        body: { maxHeight: '500px', overflowY: 'auto' }
      }}
    >
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : followers.length > 0 ? (
        <List
          dataSource={followers}
          renderItem={(user) => (
            <List.Item
              className={styles.followerItem}
              onClick={() => handleUserClick(user.username)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    src={user.avatarUrl}
                    icon={<UserOutlined />}
                    className={styles.avatar}
                  />
                }
                title={
                  <Text strong className={styles.username}>
                    {user.username}
                  </Text>
                }
                description={
                  user.bio ? (
                    <Text className={styles.bio} ellipsis>
                      {user.bio}
                    </Text>
                  ) : null
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description={`${petName} has no followers yet`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Modal>
  );
};
