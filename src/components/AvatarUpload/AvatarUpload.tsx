/**
 * Avatar Upload Component Example
 *
 * This component demonstrates how to use the media upload service
 * following PawPlanet design guidelines.
 */

import { useState } from 'react';
import { Upload, message, Avatar } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { motion } from 'motion/react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userId: number;
  onUploadSuccess?: (url: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userId,
  onUploadSuccess,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);

  const { upload, uploading, progress } = useMediaUpload({
    onSuccess: (result) => {
      setPreviewUrl(result.secureUrl);
      message.success('Avatar uploaded successfully!');
      onUploadSuccess?.(result.secureUrl);
    },
    onError: (error) => {
      message.error(`Upload failed: ${error.message}`);
    },
  });

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    // Validate file size (max 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    upload(file, 'USER_AVATAR', userId);

    // Prevent default upload behavior
    return false;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Upload
        name="avatar"
        listType="picture-circle"
        showUploadList={false}
        beforeUpload={beforeUpload}
        disabled={uploading}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: 'pointer' }}
        >
          <Avatar
            size={120}
            src={previewUrl}
            icon={<UserOutlined />}
            style={{
              border: '3px solid #E6F7FF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#1890FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.4)',
            }}
          >
            <CameraOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
        </motion.div>
      </Upload>

      {uploading && progress && (
        <div style={{ marginTop: 16, color: '#6B7280' }}>
          Uploading... {progress.percentage}%
        </div>
      )}
    </div>
  );
};

