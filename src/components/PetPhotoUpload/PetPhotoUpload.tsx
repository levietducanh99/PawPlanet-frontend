/**
 * Pet Photo Upload Component
 *
 * Reusable component for uploading pet photos with preview
 */

import React, { useState } from 'react';
import { Upload, Avatar, Button, Typography, message } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import styles from './PetPhotoUpload.module.css';

const { Text } = Typography;

interface PetPhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange?: (file: File | null) => void;
  size?: number;
  disabled?: boolean;
}

export const PetPhotoUpload: React.FC<PetPhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  size = 120,
  disabled = false
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentPhoto);

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    onPhotoChange?.(file);
    return false; // Prevent default upload
  };

  return (
    <div className={styles.photoUpload}>
      <div className={styles.avatarContainer}>
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar
            size={size}
            src={imageUrl}
            icon={<UserOutlined />}
            className={styles.avatar}
          />

          {!disabled && (
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              className={styles.uploadTrigger}
            >
              <div className={styles.uploadOverlay}>
                <CameraOutlined className={styles.cameraIcon} />
              </div>
            </Upload>
          )}
        </motion.div>
      </div>

      <div className={styles.uploadInfo}>
        <Button
          type="link"
          size="small"
          className={styles.changeButton}
          disabled={disabled}
        >
          Change photo
        </Button>
        <Text type="secondary" className={styles.uploadHint}>
          Click on the photo to upload a new image
        </Text>
        <Text type="secondary" className={styles.uploadHint}>
          Recommend: Square image, at least 300x300
        </Text>
      </div>
    </div>
  );
};
