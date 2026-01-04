import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Input, Tag, Modal, Button, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { pageVariants, cardHoverVariants } from '@/animations/variants';
import styles from './EncyclopediaPage.module.css';

const { Title, Paragraph } = Typography;

// Mock data for animal classes
const animalClasses = [
  {
    id: 'mammal',
    name: 'Mammal',
    description: 'Warm-blooded animals with fur or hair, producing milk for their young.',
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800',
    size: 'large',
  },
  {
    id: 'bird',
    name: 'Bird',
    description: 'Warm-blooded animals with feathers and wings, laying eggs.',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800',
    size: 'large',
  },
  {
    id: 'reptile',
    name: 'Reptile',
    description: 'Cold-blooded animals with dry, scaly skin.',
    image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800',
    size: 'small',
  },
  {
    id: 'amphibian',
    name: 'Amphibian',
    description: 'Animals that can live both in water and on land.',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
    size: 'small',
  },
  {
    id: 'fish',
    name: 'Fish',
    description: 'Aquatic animals that breathe through gills.',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800',
    size: 'small',
  },
  {
    id: 'insect',
    name: 'Insect',
    description: 'Invertebrate animals with six legs.',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
    size: 'small',
  },
  {
    id: 'mollusk',
    name: 'Mollusk',
    description: 'Invertebrate animals with soft bodies, often with shells.',
    image: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=800',
    size: 'small',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other animal types not included in the above categories.',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800',
    size: 'small',
  },
];

// Demo species for quick access
const demoSpecies = [
  { id: 'lion', name: 'Demo: Lion (Standard)', emoji: '🦁', color: '#F2994A' },
  { id: 'snake', name: 'Demo: Snake (Venomous)', emoji: '🐍', color: '#EB5757' },
  { id: 'jellyfish', name: 'Demo: Jellyfish (Marine)', emoji: '🎐', color: '#1890FF' },
];

interface AnimalClass {
  id: string;
  name: string;
  description: string;
  image: string;
  size: string;
}

export const EncyclopediaPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('animal-classes');
  const [searchValue, setSearchValue] = useState('');
  const [selectedClass, setSelectedClass] = useState<AnimalClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClassClick = (animalClass: AnimalClass) => {
    setSelectedClass(animalClass);
    setIsModalOpen(true);
  };

  const handleViewSpecies = () => {
    if (selectedClass) {
      navigate(`/encyclopedia/class/${selectedClass.id}`);
    }
    setIsModalOpen(false);
  };

  const handleDemoClick = (speciesId: string) => {
    navigate(`/encyclopedia/species/${speciesId}`);
  };

  const tabs = [
    { key: 'animal-classes', label: 'Animal Classes' },
    { key: 'popular', label: 'Popular Animals' },
    { key: 'random', label: 'Random Discovery' },
  ];

  return (
    <motion.div
      className={styles.encyclopediaPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Demo Tags */}
      <div className={styles.demoTags}>
        {demoSpecies.map((species) => (
          <Tag
            key={species.id}
            className={styles.demoTag}
            style={{ borderColor: species.color, color: species.color }}
            onClick={() => handleDemoClick(species.id)}
          >
            {species.emoji} {species.name}
          </Tag>
        ))}
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <Input
          size="large"
          placeholder="Search for animals..."
          prefix={<SearchOutlined className={styles.searchIcon} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animal Classes Grid */}
      <AnimatePresence mode="wait">
        {activeTab === 'animal-classes' && (
          <motion.div
            className={styles.gridContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Large Cards Row */}
            <div className={styles.largeCardsRow}>
              {animalClasses
                .filter((c) => c.size === 'large')
                .map((animalClass) => (
                  <motion.div
                    key={animalClass.id}
                    className={styles.largeCard}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    onClick={() => handleClassClick(animalClass)}
                  >
                    <div
                      className={styles.cardImage}
                      style={{ backgroundImage: `url(${animalClass.image})` }}
                    >
                      <div className={styles.cardOverlay}>
                        <Title level={4} className={styles.cardTitle}>
                          {animalClass.name}
                        </Title>
                        <Paragraph className={styles.cardDescription}>
                          {animalClass.description}
                        </Paragraph>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Small Cards Row */}
            <div className={styles.smallCardsRow}>
              {animalClasses
                .filter((c) => c.size === 'small')
                .map((animalClass) => (
                  <motion.div
                    key={animalClass.id}
                    className={styles.smallCard}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    onClick={() => handleClassClick(animalClass)}
                  >
                    <div
                      className={styles.cardImage}
                      style={{ backgroundImage: `url(${animalClass.image})` }}
                    >
                      <div className={styles.cardOverlay}>
                        <Title level={5} className={styles.cardTitle}>
                          {animalClass.name}
                        </Title>
                        <Paragraph className={styles.cardDescriptionSmall}>
                          {animalClass.description}
                        </Paragraph>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'popular' && (
          <motion.div
            className={styles.placeholderContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paragraph className={styles.placeholderText}>
              Popular Animals section - Coming soon!
            </Paragraph>
          </motion.div>
        )}

        {activeTab === 'random' && (
          <motion.div
            className={styles.placeholderContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paragraph className={styles.placeholderText}>
              Random Discovery section - Coming soon!
            </Paragraph>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class Detail Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
        className={styles.classModal}
        centered
        closeIcon={<span className={styles.closeIcon}>×</span>}
      >
        {selectedClass && (
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
                onClick={handleViewSpecies}
              >
                View All {selectedClass.name} Species
              </Button>
            </div>
          </motion.div>
        )}
      </Modal>
    </motion.div>
  );
};
