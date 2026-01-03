/**
 * Complete Integration Example
 *
 * This file shows how to integrate the media upload service
 * into a real user profile page with full validation and error handling.
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Card,
  message,
  Space,
  Typography,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { motion } from 'motion/react';

const { Title, Text } = Typography;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface EditProfilePageProps {
  user: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
}

/**
 * Complete example of user profile edit page with avatar upload
 */
export const EditProfilePage: React.FC<EditProfilePageProps> = ({
  user,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  // Setup media upload hook
  const { upload, uploading, progress, error: uploadError } = useMediaUpload({
    onSuccess: (result) => {
      setAvatarUrl(result.secureUrl);
      form.setFieldsValue({ avatarUrl: result.secureUrl });
      message.success('Avatar updated successfully!');
    },
    onError: (err) => {
      message.error(`Failed to upload avatar: ${err.message}`);
    },
  });

  // Validate file before upload
  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Only JPEG, PNG, and WebP images are allowed');
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('Image must be smaller than 5MB');
      return false;
    }

    // Check image dimensions (optional)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 100 || img.height < 100) {
          message.error('Image must be at least 100x100 pixels');
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        message.error('Failed to load image');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    }) as unknown as boolean;
  };

  // Handle file upload
  const handleAvatarUpload = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    // Upload to Cloudinary via our service
    await upload(file, 'USER_AVATAR', user.id);
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      await onSave({
        ...user,
        ...values,
        avatarUrl: avatarUrl || user.avatarUrl,
      });
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title level={2}>Edit Profile</Title>

        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginTop: 24,
          }}
        >
          {/* Avatar Upload Section */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={(file) => {
                handleAvatarUpload(file);
                return false; // Prevent default upload
              }}
              disabled={uploading}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <Avatar
                  size={120}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  style={{
                    border: '4px solid #E6F7FF',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#1890FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.4)',
                    cursor: 'pointer',
                  }}
                >
                  <CameraOutlined style={{ color: '#fff', fontSize: 20 }} />
                </div>
              </motion.div>
            </Upload>

            {uploading && progress && (
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">
                  Uploading... {Math.round(progress.percentage)}%
                </Text>
              </div>
            )}

            {uploadError && (
              <div style={{ marginTop: 12 }}>
                <Text type="danger">{uploadError.message}</Text>
              </div>
            )}

            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Click to change avatar
            </Text>
          </div>

          {/* Profile Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={user}
            onFinish={handleSubmit}
          >
            <Form.Item name="avatarUrl" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter your name' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your name"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                size="large"
                type="email"
                placeholder="your.email@example.com"
                style={{ borderRadius: 12 }}
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
                placeholder="Tell us about yourself..."
                style={{ borderRadius: 12 }}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item>
              <Space size="middle" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={saving || uploading}
                  block
                  style={{ borderRadius: 8 }}
                >
                  Save Changes
                </Button>
                <Button
                  size="large"
                  onClick={() => form.resetFields()}
                  style={{ borderRadius: 8 }}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditProfilePage;

