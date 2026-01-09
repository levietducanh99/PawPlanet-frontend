/**
 * Pet Photo Group Component
 * Displays photos grouped by pet with pet avatar and name
 */

import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import styles from './PetPhotoGroup.module.css';

const { Text } = Typography;

export interface PetPhoto {
  postId: number;
  url: string;
  caption?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface PetPhotoGroupProps {
  petId?: number;
  petName: string;
  petAvatar?: string;
  photos: PetPhoto[];
  onPhotoClick?: (photo: PetPhoto) => void;
  onPetClick?: (petId?: number) => void;
}

export const PetPhotoGroup: React.FC<PetPhotoGroupProps> = ({
  petId,
  petName,
  petAvatar,
  photos,
  onPhotoClick,
  onPetClick,
}) => {
  const photoCount = photos.length;

  return (
    <div className={styles.petPhotoGroup}>
      {/* Pet Header */}
      <div
        className={styles.petHeader}
        onClick={() => onPetClick?.(petId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPetClick?.(petId);
          }
        }}
      >
        <Avatar
          size={40}
          src={petAvatar}
          icon={<UserOutlined />}
          className={styles.petAvatar}
        />
        <div className={styles.petInfo}>
          <Text className={styles.petName}>{petName}</Text>
          <Text className={styles.photoCount}>
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
          </Text>
        </div>
      </div>

      {/* Photo Grid */}
      <div className={styles.photoGrid}>
        {photos.map((photo, index) => (
          <motion.div
            key={`${photo.postId}-${index}`}
            className={styles.photoCard}
            whileHover={{
              y: -4,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            onClick={() => onPhotoClick?.(photo)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPhotoClick?.(photo);
              }
            }}
          >
            <div
              className={styles.photoImage}
              style={{ backgroundImage: `url(${photo.url})` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

