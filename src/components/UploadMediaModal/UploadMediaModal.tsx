import React, { useState } from 'react';
import { Modal, Upload, Button, message, Typography, Space } from 'antd';
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
  // Gallery uploads only - backend will assign roles automatically
  const mediaRole = 'gallery';

  const handleUpload = async () => {
    console.log('🟢 UploadMediaModal: handleUpload triggered');
    console.log('📁 Files to upload:', fileList.length);
    console.log('🐾 Pet ID:', petId);

    if (fileList.length === 0) {
      message.warning('Please select at least one photo or video');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      console.log('🚀 Starting upload process...');
      // Upload each file
      for (const file of fileList) {
        console.log('📤 Processing file:', file.name, 'UID:', file.uid);
        console.log('🔍 File structure:', {
          name: file.name,
          uid: file.uid,
          type: file.type,
          size: file.size,
          hasOriginFileObj: !!file.originFileObj,
          fileKeys: Object.keys(file)
        });

        // The file itself might BE the originFileObj when added via beforeUpload
        const actualFile = file.originFileObj || (file as any);
        console.log('🔍 Using file:', actualFile instanceof File ? 'File object' : 'Not a File', actualFile);

        if (actualFile instanceof File) {
          try {
            console.log('🔵 Calling uploadMediaForPet for:', file.name);
            const result = await uploadMediaForPet(petId, actualFile, mediaRole);
            console.log('✅ Upload success for:', file.name, result);
            successCount++;
          } catch (error) {
            console.error('❌ Upload error for:', file.name, error);
            errorCount++;
          }
        } else {
          console.error('⚠️ No valid File object for:', file.name, 'Type:', typeof actualFile);
        }
      }

      console.log('📊 Upload summary - Success:', successCount, 'Errors:', errorCount);

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
      console.error('💥 Upload process error:', error);
      message.error('Failed to upload photos');
    } finally {
      setUploading(false);
      console.log('🏁 Upload process finished');
    }
  };

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList,
    beforeUpload: (file) => {
      console.log('📥 beforeUpload called for:', file.name, 'Type:', file.type);

      // Validate file type - allow images and videos
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        message.error('You can only upload image or video files!');
        console.log('❌ Invalid file type:', file.type);
        return Upload.LIST_IGNORE;
      }

      // Validate file size (max 50MB for videos, 5MB for images)
      const maxSize = isVideo ? 50 : 5;
      const isUnderLimit = file.size / 1024 / 1024 < maxSize;

      if (!isUnderLimit) {
        message.error(`${isVideo ? 'Video' : 'Image'} must be smaller than ${maxSize}MB!`);
        console.log('❌ File too large:', file.size / 1024 / 1024, 'MB');
        return Upload.LIST_IGNORE;
      }

      // Add file to list with proper UploadFile structure
      setFileList(prevList => {
        const uploadFile: UploadFile = {
          uid: file.uid,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'done',
          originFileObj: file, // ✅ This is the key property!
        } as UploadFile;

        const newList = [...prevList, uploadFile];
        console.log('✅ File added to list. Total files:', newList.length);
        console.log('🔍 Added file structure:', {
          name: uploadFile.name,
          hasOriginFileObj: !!uploadFile.originFileObj
        });
        return newList;
      });

      return false; // Prevent auto upload
    },
    onRemove: (file) => {
      console.log('🗑️ Removing file:', file.name);
      setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
    },
    multiple: true,
    accept: 'image/*,video/*'
  };

  const handleCancel = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={`Upload Media to ${petName}'s Gallery`}
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
            Add beautiful photos and videos to {petName}'s gallery. Media will be visible to all followers.
          </Paragraph>
        </div>

        <div>
          <Text strong>Select Media:</Text>
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

