import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Alert, Tag, Typography } from 'antd';
import { pageVariants } from '@/animations/variants';
import { SearchBar } from '@/components';
import {
  AnimalClassCard,
  AnimalClassData,
  ClassModal,
  PillTabs,
  TabItem,
} from '@/components/Encyclopedia';
import { useEncyclopediaClasses, useEncyclopediaSearch } from '@/hooks';
import styles from './EncyclopediaPage.module.css';

const { Paragraph, Title } = Typography;

const tabs: TabItem[] = [
  { key: 'animal-classes', label: 'Animal Classes' },
  { key: 'popular', label: 'Popular Animals' },
  { key: 'random', label: 'Random Discovery' },
];

const mapDomainClassToCard = (c: { id: number; name: string; description?: string; avatarUrl?: string; slug?: string }): AnimalClassData => {
  // The UI card expects an id string; we keep it stable via slug fallback.
  const id = String(c.id);
  return {
    id,
    slug: c.slug ? String(c.slug) : undefined,
    name: c.name,
    description: c.description || 'Learn more about this animal class.',
    image:
      c.avatarUrl ||
      'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800',
    size: 'small',
  };
};

export const EncyclopediaPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('animal-classes');
  const [searchValue, setSearchValue] = useState('');
  const [selectedClass, setSelectedClass] = useState<AnimalClassData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const { data: classes, loading: classesLoading, error: classesError } = useEncyclopediaClasses();
  const { data: searchResult, loading: searchLoading, error: searchError, search } = useEncyclopediaSearch();

  // Hero images from public/hero folder (for main slider)
  const heroImages = [
    '/hero/pexels-simonakidric-2607544.jpg',
    '/hero/istockphoto-1184184060-612x612.jpg',
    '/hero/photo-1560114928-40f1f1eb26a0.jfif',
    '/hero/Gemini_Generated_Image_3qafw23qafw23qaf.png',
    '/hero/Gemini_Generated_Image_v3y3bev3y3bev3y3.png',
  ];

  // Auto-slide hero images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const animalClasses: AnimalClassData[] = useMemo(() => {
    // First 2 big, rest small (to mimic the existing grid layout)
    const cards = classes.map(mapDomainClassToCard);
    return cards.map((c, idx) => ({ ...c, size: idx < 2 ? 'large' : 'small' }));
  }, [classes]);

  const handleClassClick = (animalClass: AnimalClassData) => {
    setSelectedClass(animalClass);
    setIsModalOpen(true);
  };

  const handleViewSpecies = () => {
    if (selectedClass) {
      navigate(`/encyclopedia/class/${selectedClass.id}`);
    }
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className={styles.encyclopediaPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section with Full Background Slider */}
      <div className={styles.heroSection}>
        {/* Background Image Slider */}
        <div className={styles.heroImageBackground}>
          {heroImages.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentHeroIndex}
                src={heroImages[currentHeroIndex]}
                alt="Featured animal"
                className={styles.heroBackgroundImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
          )}
          {/* Dark overlay for better text readability */}
          <div className={styles.heroOverlay} />
        </div>

        {/* Content Overlay */}
        <div className={styles.heroContentOverlay}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Title level={1} className={styles.heroTitle}>
              <motion.span
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: 'inline-block' }}
              >
                🐾
              </motion.span>{' '}
              Discover the{' '}
              <span className={styles.highlightText}>Animal Kingdom</span>
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              Explore fascinating creatures from every corner of the world. From majestic mammals to mysterious marine life.
            </Paragraph>

            {/* Search Bar Overlay */}
            <motion.div
              className={styles.heroSearchBar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search for animals, species, or breeds..."
                loading={searchLoading}
                onSearch={(value) => {
                  void search(value);
                }}
              />

              {/* Search Results - Display right below search bar */}
              {searchValue.trim() && searchResult.items.length > 0 && (
                <motion.div
                  className={styles.searchResults}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {searchResult.items.slice(0, 8).map((item) => (
                    <Tag
                      key={item.key}
                      className={styles.resultTag}
                      onClick={() => {
                        if (item.type === 'SPECIES') navigate(`/encyclopedia/species/${item.id}`);
                        if (item.type === 'BREED') navigate(`/encyclopedia/breed/${item.id}`);
                        if (item.type === 'CLASS') navigate(`/encyclopedia/class/${item.id}`);
                      }}
                    >
                      {item.title}
                    </Tag>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative dots */}
        <div className={styles.decorativeDots}>
          <motion.div
            className={styles.dotPattern}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Search Error */}
      {searchError && (
        <div style={{ marginBottom: 16 }}>
          <Alert type="error" message={searchError.message} showIcon />
        </div>
      )}

      {/* Tab Navigation */}
      <PillTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

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
            {classesError && (
              <div style={{ marginBottom: 16 }}>
                <Alert type="error" message={classesError.message} showIcon />
              </div>
            )}

            {classesLoading ? (
              <Paragraph className={styles.placeholderText}>Loading classes...</Paragraph>
            ) : (
              <>
                {/* Large Cards Row */}
                <div className={styles.largeCardsRow}>
                  {animalClasses
                    .filter((c) => c.size === 'large')
                    .map((animalClass) => (
                      <AnimalClassCard
                        key={animalClass.id}
                        animalClass={animalClass}
                        onClick={handleClassClick}
                      />
                    ))}
                </div>

                {/* Small Cards Row */}
                <div className={styles.smallCardsRow}>
                  {animalClasses
                    .filter((c) => c.size === 'small')
                    .map((animalClass) => (
                      <AnimalClassCard
                        key={animalClass.id}
                        animalClass={animalClass}
                        onClick={handleClassClick}
                      />
                    ))}
                </div>
              </>
            )}
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
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onViewSpecies={handleViewSpecies}
        selectedClass={selectedClass}
      />
    </motion.div>
  );
};
