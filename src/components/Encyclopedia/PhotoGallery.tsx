import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Typography, Modal } from 'antd';
import { AddImageCard } from './AddImageCard';
import styles from './PhotoGallery.module.css';

const { Title } = Typography;

interface PhotoGalleryProps {
  images: string[];
  title?: string;
  altPrefix?: string;
  isAdmin?: boolean;
  entityType?: 'species' | 'breed';
  entityId?: number;
  entitySlug?: string; // Thêm slug cho upload
  onImageAdded?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  title = 'Photo Gallery',
  altPrefix = 'Photo',
  isAdmin = false,
  entityType,
  entityId,
  entitySlug,
  onImageAdded,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const showAddCard = isAdmin && entityType && entityId !== undefined && entitySlug;

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
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={styles.masonryItem}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => setSelectedImage(image)}
          >
            <div className={styles.imageWrapper}>
              <img src={image} alt={`${altPrefix} ${index + 1}`} loading="lazy" />
              <div className={styles.overlay}>
                <span className={styles.overlayText}>View Full Image</span>
              </div>
            </div>
          </motion.div>
        ))}
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
