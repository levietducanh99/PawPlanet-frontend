import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Alert, Typography, Row, Col, Card } from 'antd';
import { pageVariants } from '@/animations/variants';
import {
  HeroBanner,
  PillTabs,
  TabItem,
  AttributeCard,
  AttributeData,
  PhotoGallery,
} from '@/components/Encyclopedia';
import { useEncyclopediaBreedDetail } from '@/hooks';
import styles from './BreedDetailPage.module.css';

const { Title, Paragraph } = Typography;

export const BreedDetailPage: React.FC = () => {
  const { breedId } = useParams<{ breedId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const numericId = Number(breedId);
  const { data: breed, loading, error } = useEncyclopediaBreedDetail(
    Number.isFinite(numericId) ? numericId : undefined
  );

  const heroImage =
    breed?.heroUrl ||
    breed?.thumbnailUrl ||
    breed?.galleryPreview?.[0]?.url ||
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600';

  const attributes: AttributeData[] = useMemo(() => {
    return (breed?.attributes ?? [])
      .slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((attr) => ({
        icon: attr.key,
        label: attr.key,
        value: attr.value || '',
      }));
  }, [breed?.attributes]);

  const galleryImages = useMemo(() => {
    return (breed?.galleryPreview ?? []).map((m) => m.url).filter(Boolean);
  }, [breed?.galleryPreview]);

  // Build dynamic tabs based on breed sections + gallery
  const tabs: TabItem[] = useMemo(() => {
    const baseTabs: TabItem[] = [
      { key: 'overview', label: 'Overview' },
      { key: 'attributes', label: 'Attributes' },
    ];

    const sectionTabs: TabItem[] = (breed?.sections ?? []).map((s) => ({
      key: String(s.id),
      label: s.title,
    }));

    const galleryTab: TabItem[] = galleryImages.length > 0 ? [{ key: 'gallery', label: 'Gallery' }] : [];

    return [...baseTabs, ...sectionTabs, ...galleryTab];
  }, [breed?.sections, galleryImages.length]);

  if (loading) {
    return (
      <motion.div
        className={styles.breedPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Paragraph className={styles.sectionContent}>Loading...</Paragraph>
      </motion.div>
    );
  }

  if (error || !breed) {
    return (
      <motion.div
        className={styles.breedPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <Alert type="error" message={error?.message || 'Breed not found'} showIcon />
      </motion.div>
    );
  }

  const overviewText = breed.shortDescription || 'Information about this breed is not available yet.';

  const activeSection = (breed.sections ?? []).find((s) => String(s.id) === activeTab);

  return (
    <motion.div
      className={styles.breedPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <HeroBanner
        image={heroImage}
        status={breed.taxonomyType}
        statusColor={'#27AE60'}
        title={breed.name}
        subtitle={breed.origin}
      />

      {/* Tab Navigation */}
      <PillTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} sticky />

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
                    <Col xs={12} sm={8} md={6} lg={4} key={index}>
                      <AttributeCard attribute={attr} />
                    </Col>
                  ))}
                </Row>
              </section>
            )}

            {/* Render all sections here as well (like previous mock) */}
            {(breed.sections ?? [])
              .slice()
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .map((section) => (
                <Card bordered={false} className={styles.contentCard} key={section.id}>
                  <Title level={4} className={styles.cardTitle}>
                    {section.title}
                  </Title>
                  <Paragraph className={styles.sectionContent}>
                    {section.content || 'No content yet.'}
                  </Paragraph>
                </Card>
              ))}

            {/* Photo Gallery */}
            {galleryImages.length > 0 && <PhotoGallery images={galleryImages} altPrefix={breed.name} />}
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
                    <Col xs={12} sm={8} md={6} lg={4} key={index}>
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
            {galleryImages.length > 0 ? (
              <PhotoGallery images={galleryImages} altPrefix={breed.name} />
            ) : (
              <div className={styles.emptyState}>
                <Paragraph>No gallery images available.</Paragraph>
              </div>
            )}
          </motion.div>
        )}

        {/* Dynamic Section Tabs */}
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card bordered={false} className={styles.contentCard}>
              <Title level={4} className={styles.cardTitle}>
                {activeSection.title}
              </Title>
              <Paragraph className={styles.sectionContent}>
                {activeSection.content || 'No content yet.'}
              </Paragraph>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
