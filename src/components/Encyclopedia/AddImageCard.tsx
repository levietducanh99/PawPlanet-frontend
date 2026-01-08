import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Modal, message, Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEncyclopediaMedia } from '@/hooks';
import { uploadMedia } from '@/services/media.service';
import type { UploadFile } from 'antd';
import styles from './AddImageCard.module.css';

interface AddImageCardProps {
  entityType: 'species' | 'breed';
  entityId: number;
  slug: string; // Thêm slug bắt buộc cho upload context
  onSuccess?: () => void;
}

export const AddImageCard: React.FC<AddImageCardProps> = ({
  entityType,
  entityId,
  slug,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { addMediaToSpecies, addMediaToBreed } = useEncyclopediaMedia();

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select at least one image');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = fileList.map(async (file) => {
        let context: 'ENCYCLOPEDIA_SPECIES' | 'ENCYCLOPEDIA_BREED' = 'ENCYCLOPEDIA_SPECIES';
        if (entityType === 'breed') context = 'ENCYCLOPEDIA_BREED';
        const uploadResult = await uploadMedia(file.originFileObj as File, {
          context,
          slug,
        });
        // Xác định type: image hoặc video
        const fileType = file.type && file.type.startsWith('video/') ? 'video' : 'image';
        return {
          publicId: uploadResult.publicId,
          type: fileType,
          role: 'GALLERY',
          url: uploadResult.secureUrl,
        };
      });

      const mediaItems = await Promise.all(uploadPromises);

      // Add media to encyclopedia
      const success =
        entityType === 'species'
          ? await addMediaToSpecies(entityId, { mediaItems })
          : await addMediaToBreed(entityId, { mediaItems });

      if (success) {
        message.success('Images added successfully!');
        setFileList([]);
        setIsModalOpen(false);
        onSuccess?.();
      } else {
        message.error('Failed to add images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <>
      <motion.div
        className={styles.addImageCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <PlusOutlined className={styles.icon} />
          </div>
          <span className={styles.text}>Add Image</span>
        </div>
      </motion.div>

      <Modal
        title="Add Images to Gallery"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpload}
        okText="Upload"
        confirmLoading={uploading}
        width={600}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          beforeUpload={beforeUpload}
          multiple
        >
          {fileList.length >= 8 ? null : (
            <div>
              {uploading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        <p style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
          You can upload up to 8 images at once. Supported formats: JPG, PNG, GIF (max 5MB each)
        </p>
      </Modal>
    </>
  );
};
