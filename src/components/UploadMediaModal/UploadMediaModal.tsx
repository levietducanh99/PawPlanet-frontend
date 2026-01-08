import React, { useState } from 'react';
import { Modal, Upload, Button, message, Typography, Space, Radio } from 'antd';
import { PlusOutlined, CloudUploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { uploadMediaForPet } from '@/services/media.service';

const { Text, Paragraph } = Typography;

interface UploadMediaModalProps {
  visible: boolean;
  onClose: () => void;
  petId: number;
  petName: string;
  onUploadSuccess: () => void;
}

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  visible,
  onClose,
  petId,
  petName,
  onUploadSuccess
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mediaRole, setMediaRole] = useState<'primary' | 'avatar' | 'gallery'>('gallery');

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select at least one photo');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Upload each file
      for (const file of fileList) {
        if (file.originFileObj) {
          try {
            await uploadMediaForPet(petId, file.originFileObj, mediaRole);
            successCount++;
          } catch (error) {
            console.error('Upload error:', error);
            errorCount++;
          }
        }
      }

      if (successCount > 0) {
        message.success(`Successfully uploaded ${successCount} file(s)`);
        setFileList([]);
        onUploadSuccess();
        onClose();
      }

      if (errorCount > 0) {
        message.error(`Failed to upload ${errorCount} file(s)`);
      }
    } catch (error) {
      console.error('Upload process error:', error);
      message.error('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList,
    beforeUpload: (file) => {
      // Validate file type - allow images and videos
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        message.error('You can only upload image or video files!');
        return Upload.LIST_IGNORE;
      }

      // Validate file size (max 50MB for videos, 5MB for images)
      const maxSize = isVideo ? 50 : 5;
      const isUnderLimit = file.size / 1024 / 1024 < maxSize;

      if (!isUnderLimit) {
        message.error(`${isVideo ? 'Video' : 'Image'} must be smaller than ${maxSize}MB!`);
        return Upload.LIST_IGNORE;
      }

      setFileList([...fileList, file as any]);
      return false; // Prevent auto upload
    },
    onRemove: (file) => {
      setFileList(fileList.filter(item => item.uid !== file.uid));
    },
    multiple: true,
    accept: 'image/*,video/*'
  };

  const handleCancel = () => {
    setFileList([]);
    setMediaRole('gallery');
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={`Upload Photos for ${petName}`}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={uploading}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={fileList.length === 0}
          icon={<CloudUploadOutlined />}
        >
          Upload {fileList.length > 0 ? `(${fileList.length})` : ''}
        </Button>
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Paragraph type="secondary">
            Add beautiful photos and videos to {petName}'s library. Media will be visible to all followers.
          </Paragraph>
        </div>

        <div>
          <Text strong>Photo Role:</Text>
          <br />
          <Radio.Group
            value={mediaRole}
            onChange={(e) => setMediaRole(e.target.value)}
            style={{ marginTop: '8px' }}
          >
            <Radio.Button value="gallery">Gallery Photo</Radio.Button>
            <Radio.Button value="primary">Primary Photo</Radio.Button>
            <Radio.Button value="avatar">Avatar</Radio.Button>
          </Radio.Group>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {mediaRole === 'gallery' && '📸 Regular photo for the gallery'}
            {mediaRole === 'primary' && '⭐ Featured photo shown prominently'}
            {mediaRole === 'avatar' && '👤 Profile picture for this pet'}
          </Text>
        </div>

        <div>
          <Text strong>Select Photos:</Text>
          <Upload {...uploadProps}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
            • Images: Max 5MB per file
            <br />
            • Videos: Max 50MB per file
            <br />
            • Supported formats: JPG, PNG, GIF, WebP, MP4, MOV, AVI
            <br />
            • You can upload multiple files at once
          </Text>
        </div>

        {fileList.length > 0 && (
          <div
            style={{
              padding: '12px',
              background: '#f0f5ff',
              borderRadius: '8px',
              border: '1px solid #d6e4ff'
            }}
          >
            <Text strong style={{ color: '#1890ff' }}>
              ✓ {fileList.length} file{fileList.length > 1 ? 's' : ''} ready to upload
            </Text>
          </div>
        )}
      </Space>
    </Modal>
  );
};

