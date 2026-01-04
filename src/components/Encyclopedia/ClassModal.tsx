import React from 'react';
import { motion } from 'motion/react';
import { Modal, Tag, Button, Typography } from 'antd';
import { AnimalClassData } from './AnimalClassCard';
import styles from './ClassModal.module.css';

const { Title, Paragraph } = Typography;

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewSpecies: () => void;
  selectedClass: AnimalClassData | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onViewSpecies,
  selectedClass,
}) => {
  if (!selectedClass) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      className={styles.classModal}
      centered
      closeIcon={<span className={styles.closeIcon}>×</span>}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={styles.modalImage}
          style={{ backgroundImage: `url(${selectedClass.image})` }}
        >
          <div className={styles.modalOverlay}>
            <Tag className={styles.modalTag}>{selectedClass.name.toUpperCase()}</Tag>
            <Title level={2} className={styles.modalTitle}>
              {selectedClass.name} Class
            </Title>
            <Paragraph className={styles.modalSubtitle}>
              Discover the fascinating world of {selectedClass.name.toLowerCase()}s
            </Paragraph>
          </div>
        </div>
        <div className={styles.modalContent}>
          <Paragraph className={styles.modalDescription}>
            {selectedClass.description}
          </Paragraph>
          <Button
            type="primary"
            size="large"
            block
            className={styles.viewButton}
            onClick={onViewSpecies}
          >
            View All {selectedClass.name} Species
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};
