import React from 'react';
import { motion } from 'motion/react';
import { Typography } from 'antd';
import { cardHoverVariants } from '@/animations/variants';
import styles from './PhotoGallery.module.css';

const { Title } = Typography;

interface PhotoGalleryProps {
  images: string[];
  title?: string;
  altPrefix?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  title = 'Photo Gallery',
  altPrefix = 'Photo',
}) => {
  if (images.length === 0) return null;

  return (
    <section className={styles.section}>
      <Title level={4} className={styles.sectionTitle}>
        {title}
      </Title>
      <div className={styles.galleryGrid}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={styles.galleryItem}
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
          >
            <img src={image} alt={`${altPrefix} ${index + 1}`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
