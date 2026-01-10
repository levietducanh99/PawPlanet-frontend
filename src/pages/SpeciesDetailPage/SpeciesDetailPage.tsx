import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Alert, Typography, Row, Col, Card, message } from 'antd';
import { pageVariants } from '@/animations/variants';
import {
  HeroBanner,
  PillTabs,
  TabItem,
  AttributeCard,
  AttributeData,
  PhotoGallery,
  SpeciesCard,
  SpeciesCardData,
} from '@/components/Encyclopedia';
import { useEncyclopediaSpeciesDetail, useEncyclopediaBreedsBySpecies, useEncyclopediaSpeciesList } from '@/hooks';
import { useAuth } from '@/hooks';
import { isAdmin } from '@/domain/auth';
import styles from './SpeciesDetailPage.module.css';

const { Title, Paragraph } = Typography;

const tabs: TabItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'attributes', label: 'Attributes' },
  { key: 'appearance', label: 'Appearance & Habits' },
  { key: 'habitat', label: 'Habitat' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'breeds', label: 'Breeds' },
  { key: 'related', label: 'Related Species' },
];

export const SpeciesDetailPage: React.FC = () => {
  const { speciesId } = useParams<{ speciesId?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);

  // Parse slug to get actual ID
  const { data: searchResult } = useEncyclopediaSpeciesList({
    q: speciesId,
    page: 0,
    size: 10,
  });

  // Find species by slug or use numeric ID directly
  const actualSpeciesId = useMemo(() => {
    if (!speciesId) return undefined;
    const numericId = Number(speciesId);
    if (Number.isFinite(numericId)) return numericId;

    // Find by slug
    const found = searchResult.items.find((s) => s.slug === speciesId);
    return found?.id;
  }, [speciesId, searchResult.items]);

  const { data: species, loading, error } = useEncyclopediaSpeciesDetail(actualSpeciesId);

  const heroImage =
    species?.heroUrl ||
    species?.thumbnailUrl ||
    species?.galleryPreview?.[0]?.url ||
    'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1600';

  const attributes: AttributeData[] = useMemo(() => {
    return (species?.attributes ?? [])
      .slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((attr) => ({
        icon: attr.key,
        label: attr.key,
        value:
          attr.value ??
          [attr.valueMin, attr.valueMax].filter((v) => v !== undefined).join(' - ') +
            (attr.unit ? ` ${attr.unit}` : ''),
      }));
  }, [species?.attributes]);

  const galleryImages = useMemo(() => {
    return (species?.galleryPreview ?? []).map((m) => m.url).filter(Boolean);
  }, [species?.galleryPreview]);

  const galleryMediaItems = useMemo(() => {
    return (species?.galleryPreview ?? []).filter(Boolean).map((m) => ({ id: m.id, url: m.url }));
  }, [species?.galleryPreview]);

  const handleDeleteEncyclopediaImage = async (mediaId: number) => {
    try {
      const { encyclopediaService } = await import('@/services/encyclopedia.service');
      await encyclopediaService.deleteEncyclopediaMedia(mediaId);
      message.success('Media deleted');
      window.location.reload();
    } catch (err: unknown) {
      console.error('Failed to delete encyclopedia media', err);
      const e = err as { message?: string };
      message.error(e?.message || 'Failed to delete media');
    }
  };

  const {
    data: breedsList,
    loading: breedsLoading,
    error: breedsError,
  } = useEncyclopediaBreedsBySpecies(species?.id);

  const breeds: SpeciesCardData[] = useMemo(() => {
    return (breedsList ?? []).map((b) => ({
      id: String(b.id),
      name: b.name,
      scientificName: b.origin,
      status: b.taxonomyType,
      statusColor: '#27AE60',
      image: b.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
      slug: b.slug,
    }));
  }, [breedsList]);

  const handleBreedClick = (breed: SpeciesCardData) => {
    navigate(`/encyclopedia/breed/${breed.id}`);
  };

  if (loading) {
    return (
      <motion.div
        className={styles.speciesPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Paragraph className={styles.sectionContent}>Loading...</Paragraph>
      </motion.div>
    );
  }

  if (error || !species) {
    return (
      <motion.div
        className={styles.speciesPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Alert
          type="error"
          message={error?.message || 'Species not found'}
          showIcon
        />
      </motion.div>
    );
  }

  const overviewText = species.description || 'No overview available yet.';

  return (
    <motion.div
      className={styles.speciesPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <HeroBanner
        image={heroImage}
        status={'Species'}
        statusColor={'#1890FF'}
        title={species.name}
        subtitle={species.scientificName}
      />

      {/* Tab Navigation */}
      <PillTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        sticky
      />

      {/* Content Sections */}
      <div className={styles.contentContainer}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>
                Overview
              </Title>
              <Paragraph className={styles.sectionContent}>{overviewText}</Paragraph>
            </section>

            {/* Key Attributes */}
            {attributes.length > 0 && (
              <section className={styles.section}>
                <Title level={4} className={styles.sectionTitle}>
                  Key Attributes
                </Title>
                <Row gutter={[16, 16]}>
                  {attributes.map((attr, index) => (
                    <Col xs={12} sm={8} md={4} key={index}>
                      <AttributeCard attribute={attr} />
                    </Col>
                  ))}
                </Row>
              </section>
            )}

            {/* Sections rendered as content cards */}
            {(species.sections ?? []).length > 0 && (
              <Card bordered={false} className={styles.contentCard}>
                <Title level={3} className={styles.cardTitle}>
                  About
                </Title>
                {(species.sections ?? [])
                  .slice()
                  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                  .map((section) => (
                    <div className={styles.subsection} key={section.id}>
                      <Title level={5} className={styles.subsectionTitle}>
                        {section.title}
                      </Title>
                      <Paragraph className={styles.subsectionContent}>
                        {section.content || 'No content yet.'}
                      </Paragraph>
                    </div>
                  ))}
              </Card>
            )}

            {/* Photo Gallery */}
            <PhotoGallery
              images={galleryImages}
              mediaItems={galleryMediaItems}
              altPrefix={species.name}
              isAdmin={userIsAdmin}
              entityType="species"
              entityId={species.id}
              entitySlug={species.slug}
              onImageAdded={() => window.location.reload()}
              onDeleteImage={handleDeleteEncyclopediaImage}
            />

            {/* Breeds */}
            {breeds.length > 0 && (
              <section className={styles.section}>
                <Title level={4} className={styles.sectionTitle}>
                  Breeds
                </Title>
                <Row gutter={[16, 16]}>
                  {breeds.map((breed) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={breed.id}>
                      <SpeciesCard species={breed} onClick={handleBreedClick} />
                    </Col>
                  ))}
                </Row>
              </section>
            )}
          </motion.div>
        )}

        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>
                All Attributes
              </Title>
              {attributes.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {attributes.map((attr, index) => (
                    <Col xs={12} sm={8} md={4} key={index}>
                      <AttributeCard attribute={attr} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className={styles.emptyState}>
                  <Paragraph>No attribute information available.</Paragraph>
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoGallery
              images={galleryImages}
              mediaItems={galleryMediaItems}
              altPrefix={species.name}
              isAdmin={userIsAdmin}
              entityType="species"
              entityId={species.id}
              entitySlug={species.slug}
              onImageAdded={() => window.location.reload()}
              onDeleteImage={handleDeleteEncyclopediaImage}
            />
          </motion.div>
        )}

        {/* Breeds Tab */}
        {activeTab === 'breeds' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {breedsError && (
              <Alert type="error" message={breedsError.message} showIcon style={{ marginBottom: 16 }} />
            )}

            {breedsLoading ? (
              <div className={styles.emptyState}>
                <Paragraph>Loading breeds...</Paragraph>
              </div>
            ) : breeds.length > 0 ? (
              <section className={styles.section}>
                <Title level={4} className={styles.sectionTitle}>
                  All Breeds
                </Title>
                <Row gutter={[16, 16]}>
                  {breeds.map((breed) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={breed.id}>
                      <SpeciesCard species={breed} onClick={handleBreedClick} />
                    </Col>
                  ))}
                </Row>
              </section>
            ) : (
              <div className={styles.emptyState}>
                <Paragraph>No breeds available for this species.</Paragraph>
              </div>
            )}
          </motion.div>
        )}

        {/* Other tabs - keep existing empty state */}
        {(activeTab === 'appearance' || activeTab === 'habitat' || activeTab === 'related') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.emptyState}>
              <Paragraph>Coming soon!</Paragraph>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
