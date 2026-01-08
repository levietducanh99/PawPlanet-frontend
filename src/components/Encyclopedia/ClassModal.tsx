import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal, Typography } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { AnimalClassData } from './AnimalClassCard';
import { useEncyclopediaSpeciesList } from '@/hooks';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const classId = selectedClass ? Number(selectedClass.id) : undefined;

  const { data: speciesData } = useEncyclopediaSpeciesList({
    classId: Number.isFinite(classId) ? classId : undefined,
    page: 0,
    size: 20,
  });

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  if (!selectedClass) return null;

  const speciesImages = speciesData.items.map((s) => ({
    id: s.id,
    slug: s.slug ?? String(s.id),
    name: s.name,
    scientificName: s.scientificName,
    url: s.avatarUrl || 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800',
  }));

  const count = speciesImages.length;
  // guard: if no species available, render a simple modal fallback
  if (count === 0) {
    return (
      <Modal open={isOpen} onCancel={onClose} footer={null} width={700} className={styles.classModal} centered closeIcon={<span className={styles.closeIcon}>×</span>}>
        <div className={styles.modalWrapper}>
          <div className={styles.modalHeader}>
            <div className={styles.headerTag}>SPECIMEN STAGE</div>
            <Title level={3} className={styles.modalTitle}>{selectedClass.name}</Title>
            <Paragraph className={styles.modalSubtitle}>{selectedClass.description}</Paragraph>
          </div>
          <Paragraph style={{ textAlign: 'center' }}>No specimens available.</Paragraph>
        </div>
      </Modal>
    );
  }

  const handleNext = () => {
    if (count === 0) return;
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const handlePrev = () => {
    if (count === 0) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const handlePillClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleSpecimenClick = (specimen: { id: number; slug?: string }) => {
    navigate(`/encyclopedia/species/${specimen.id}`);
    onClose();
  };

  // Calculate positions for 3D coverflow effect
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDistance = Math.abs(diff);

    if (absDistance > 2) {
      return { display: 'none' };
    }

    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let opacity = 1;
    let scale = 1;
    let blur = 0;

    if (diff === 0) {
      // Center card (Active specimen)
      translateX = 0;
      translateZ = 0;
      rotateY = 0;
      opacity = 1;
      scale = 1.1;
      blur = 0;
    } else if (diff === -1) {
      // Left card
      translateX = -280;
      translateZ = -180;
      rotateY = 35;
      opacity = 0.6;
      scale = 0.85;
      blur = 1;
    } else if (diff === 1) {
      // Right card
      translateX = 280;
      translateZ = -180;
      rotateY = -35;
      opacity = 0.6;
      scale = 0.85;
      blur = 1;
    } else if (diff === -2) {
      // Far left
      translateX = -420;
      translateZ = -280;
      rotateY = 45;
      opacity = 0.3;
      scale = 0.7;
      blur = 2;
    } else if (diff === 2) {
      // Far right
      translateX = 420;
      translateZ = -280;
      rotateY = -45;
      opacity = 0.3;
      scale = 0.7;
      blur = 2;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      filter: `blur(${blur}px)`,
      zIndex: diff === 0 ? 10 : 5 - absDistance,
    };
  };

  const activeSpecies = speciesImages[activeIndex];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      className={styles.classModal}
      centered
      closeIcon={<span className={styles.closeIcon}>×</span>}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.modalWrapper}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTag}>SPECIMEN STAGE</div>
          <Title level={3} className={styles.modalTitle}>
            {selectedClass.name}
          </Title>
          <Paragraph className={styles.modalSubtitle}>
            {selectedClass.description}
          </Paragraph>
        </div>

        {/* Filter Pills */}
        <div className={styles.pillTags}>
          {speciesImages.slice(0, 9).map((species, idx) => (
            <div
              key={species.id}
              className={`${styles.pillTag} ${idx === activeIndex ? styles.pillTagActive : ''}`}
              onClick={() => handlePillClick(idx)}
            >
              {species.name}
            </div>
          ))}
          <div className={styles.pillTag} onClick={onViewSpecies}>
            View More
            <RightOutlined style={{ marginLeft: 4, fontSize: 12 }} />
          </div>
        </div>

        {/* 3D Coverflow Stage */}
        <div className={styles.coverflowStage}>
          <div className={styles.coverflowContainer}>
            <AnimatePresence mode="sync">
              {speciesImages.map((specimen, index) => (
                <motion.div
                  key={specimen.id}
                  className={styles.coverflowCard}
                  style={getCardStyle(index)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: getCardStyle(index).opacity }}
                  transition={{
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  {/* set CSS variable in a typed fashion to avoid eslint/no-explicit-any */}
                  {(() => {
                    const cssVar = '--specimen-image';
                    const styleObj = { [cssVar]: `url(${specimen.url})` } as React.CSSProperties;
                    return (
                      <div
                        className={styles.specimenImage}
                        style={styleObj}
                        onClick={() => handleSpecimenClick(specimen as any)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSpecimenClick(specimen as any);
                        }}
                      />
                    );
                  })()}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Specimen Info (Below center card) */}
          <AnimatePresence mode="wait">
            {activeSpecies && (
              <motion.div
                key={activeSpecies.id}
                className={styles.specimenInfo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Title level={4} className={styles.specimenName}>
                  {activeSpecies.name}
                </Title>
                {activeSpecies.scientificName && (
                  <Paragraph className={styles.specimenScientific}>
                    {activeSpecies.scientificName}
                  </Paragraph>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {speciesImages.length > 1 && (
          <div className={styles.coverflowNav}>
            <button
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="Previous specimen"
            >
              <LeftOutlined />
            </button>
            <button
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Next specimen"
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </motion.div>
    </Modal>
  );
};
