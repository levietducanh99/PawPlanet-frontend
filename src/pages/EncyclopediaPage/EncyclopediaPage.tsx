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

const { Paragraph } = Typography;

// Demo species for quick access (kept as UI-only shortcuts)
const demoSpecies = [
  { id: 'lion', name: 'Demo: Lion (Standard)', emoji: '🦁', color: '#F2994A' },
  { id: 'snake', name: 'Demo: Snake (Venomous)', emoji: '🐍', color: '#EB5757' },
  { id: 'jellyfish', name: 'Demo: Jellyfish (Marine)', emoji: '🎐', color: '#1890FF' },
];

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

  const { data: classes, loading: classesLoading, error: classesError } = useEncyclopediaClasses();
  const { data: searchResult, loading: searchLoading, error: searchError, search } = useEncyclopediaSearch();

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

  const handleDemoClick = (speciesId: string) => {
    navigate(`/encyclopedia/species/${speciesId}`);
  };

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
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search for animals, species, or breeds..."
          loading={searchLoading}
          onSearch={(value) => {
            void search(value);
          }}
        />
      </div>

      {searchError && (
        <div style={{ marginBottom: 16 }}>
          <Alert type="error" message={searchError.message} showIcon />
        </div>
      )}

      {/* If we have search results, show them above tabs (minimal integration) */}
      {searchValue.trim() && searchResult.items.length > 0 && (
        <div className={styles.demoTags}>
          {searchResult.items.slice(0, 8).map((item) => (
            <Tag
              key={item.key}
              className={styles.demoTag}
              onClick={() => {
                if (item.type === 'SPECIES') navigate(`/encyclopedia/species/${item.id}`);
                if (item.type === 'BREED') navigate(`/encyclopedia/breed/${item.id}`);
                if (item.type === 'CLASS') navigate(`/encyclopedia/class/${item.id}`);
              }}
            >
              {item.title}
            </Tag>
          ))}
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
