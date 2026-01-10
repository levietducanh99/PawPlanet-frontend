import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Typography, Modal, Popconfirm, Button } from 'antd';
import { AddImageCard } from './AddImageCard';
import styles from './PhotoGallery.module.css';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PhotoGalleryProps {
  images: string[];
  // optional media items with id when admin deletion is needed
  mediaItems?: { id: number; url: string }[];
  title?: string;
  altPrefix?: string;
  isAdmin?: boolean;
  entityType?: 'species' | 'breed';
  entityId?: number;
  entitySlug?: string; // Thêm slug cho upload
  onImageAdded?: () => void;
  onDeleteImage?: (mediaId: number) => Promise<void>;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  mediaItems,
  title = 'Photo Gallery',
  altPrefix = 'Photo',
  isAdmin = false,
  entityType,
  entityId,
  entitySlug,
  onImageAdded,
  onDeleteImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const showAddCard = isAdmin && entityType && entityId !== undefined && entitySlug;

  const handleDelete = async (mediaId: number) => {
    if (!onDeleteImage) return;
    try {
      await onDeleteImage(mediaId);
    } catch (e) {
      // handled by caller
    }
  };

  return (
    <section className={styles.section}>
      <Title level={4} className={styles.sectionTitle}>
        {title}
      </Title>
      <div className={styles.masonryGrid}>
        {/* Add Image Card for Admins */}
        {showAddCard && (
          <AddImageCard
            entityType={entityType}
            entityId={entityId}
            slug={entitySlug!}
            onSuccess={onImageAdded}
          />
        )}

        {/* Existing Images */}
        {images.map((image, index) => {
          const mediaObj = mediaItems?.find((m) => m.url === image);
          return (
            <motion.div
              key={index}
              className={styles.masonryItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedImage(image)}
            >
              <div className={styles.imageWrapper} style={{ position: 'relative' }}>
                <img src={image} alt={`${altPrefix} ${index + 1}`} loading="lazy" />

                {/* Admin delete overlay */}
                {isAdmin && mediaObj && onDeleteImage && (
                  <div className={styles.deleteOverlay} onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                      title="Delete this media?"
                      onConfirm={() => handleDelete(mediaObj.id)}
                      okText="Delete"
                      okType="danger"
                      cancelText="Cancel"
                    >
                      <Button danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                )}

                <div className={styles.overlay}>
                  <span className={styles.overlayText}>View Full Image</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={!!selectedImage}
        footer={null}
        onCancel={() => setSelectedImage(null)}
        centered
        width="auto"
        style={{ maxWidth: '90vw' }}
        styles={{
          body: { padding: 0 },
        }}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain' }}
          />
        )}
      </Modal>
    </section>
  );
};
