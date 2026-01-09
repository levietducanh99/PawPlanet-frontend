/**
 * Edit Profile Page
 * Allows users to update their profile information including avatar, cover image, name, and bio
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Avatar, Card, message, Typography, Space } from 'antd';
import { UserOutlined, CameraOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProfileData, useUpdateProfile, useMediaUpload } from '@/hooks';
import styles from './EditProfilePage.module.css';

const { Title, Text } = Typography;

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user, loading: profileLoading, refreshProfile } = useProfileData();
  const { updateProfile, loading: updateLoading } = useUpdateProfile();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [avatarPublicId, setAvatarPublicId] = useState<string | undefined>();

  // Avatar upload hook
  const { upload: uploadAvatar, uploading: uploadingAvatar, progress: avatarProgress } = useMediaUpload({
    onSuccess: (result) => {
      setAvatarUrl(result.secureUrl);
      setAvatarPublicId(result.publicId);
      message.success('Avatar uploaded successfully!');
    },
    onError: (err) => {
      message.error(`Failed to upload avatar: ${err.message}`);
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refreshProfile();
  }, []);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        bio: user.bio,
      });
      setAvatarUrl(user.avatarUrl);
    }
  }, [user, form]);

  // Validate file before upload
  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Only JPEG, PNG, and WebP images are allowed');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error('Image must be smaller than 5MB');
      return false;
    }

    return true;
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    if (!validateImage(file) || !user) {
      return false;
    }

    await uploadAvatar(file, 'USER_AVATAR', user.id);
    return false; // Prevent default upload behavior
  };

  // Handle form submission
  const handleSubmit = async (values: { fullName?: string; bio?: string }) => {
    if (!user) return;

    const result = await updateProfile({
      fullName: values.fullName,
      bio: values.bio,
      avatarPublicId: avatarPublicId,
    });

    if (result) {
      message.success('Profile updated successfully!');
      navigate('/profile');
    }
  };

  if (profileLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Text>Loading profile...</Text>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <Card>
          <Text>Unable to load profile</Text>
          <Button type="primary" onClick={() => navigate('/profile')} style={{ marginTop: 16 }}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.editProfilePage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/profile')}
            className={styles.backButton}
          >
            Back to Profile
          </Button>
          <Title level={2} className={styles.title}>Edit Profile</Title>
        </div>

        <Card className={styles.editCard}>
          {/* Avatar Upload Section */}
          <div className={styles.avatarSection}>
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              disabled={uploadingAvatar}
              accept="image/jpeg,image/png,image/webp"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.avatarWrapper}
              >
                <Avatar
                  size={120}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  className={styles.avatar}
                />
                <div className={styles.cameraIcon}>
                  <CameraOutlined />
                </div>
              </motion.div>
            </Upload>

            {uploadingAvatar && avatarProgress && (
              <div className={styles.uploadProgress}>
                <Text type="secondary">
                  Uploading... {Math.round(avatarProgress.percentage)}%
                </Text>
              </div>
            )}

            <Text type="secondary" className={styles.avatarHint}>
              Click to change avatar
            </Text>
          </div>

          {/* Profile Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
          >
            <Form.Item
              label="User Name"
              name="fullName"
              rules={[
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your user name"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              label="Bio"
              name="bio"
              rules={[
                { max: 500, message: 'Bio must be less than 500 characters' },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Tell us about yourself and your pets..."
                className={styles.textarea}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item>
              <Space size="middle" className={styles.actions}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={updateLoading || uploadingAvatar}
                  className={styles.saveButton}
                >
                  Save Changes
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate('/profile')}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </motion.div>
  );
};

