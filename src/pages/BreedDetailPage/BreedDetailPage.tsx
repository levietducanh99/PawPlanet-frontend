import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Typography, Row, Col, Card } from 'antd';
import { pageVariants } from '@/animations/variants';
import {
  HeroBanner,
  PillTabs,
  TabItem,
  AttributeCard,
  AttributeData,
  PhotoGallery,
} from '@/components/Encyclopedia';
import styles from './BreedDetailPage.module.css';

const { Title, Paragraph } = Typography;

// Custom section interface for breed-specific content
interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list';
  items?: string[];
}

interface BreedInfo {
  id: string;
  name: string;
  scientificName?: string;
  origin?: string;
  status?: string;
  statusColor?: string;
  heroImage: string;
  overview: string;
  attributes: AttributeData[];
  gallery: string[];
  customSections: CustomSection[];
}

// Mock data for breeds - each breed can have unique sections
const breedData: Record<string, BreedInfo> = {
  'golden-retriever': {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    origin: 'Scotland',
    status: 'Popular',
    statusColor: '#27AE60',
    heroImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600',
    overview: `The Golden Retriever is a medium-large gun dog that was bred to retrieve shot waterfowl, such as ducks and upland game birds, during hunting and shooting parties. The name "retriever" refers to the breed's ability to retrieve shot game undamaged due to their soft mouth.`,
    attributes: [
      { icon: 'height', label: 'Height', value: '51-61 cm' },
      { icon: 'weight', label: 'Weight', value: '25-34 kg' },
      { icon: 'lifespan', label: 'Life Span', value: '10-12 years' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600',
    ],
    customSections: [
      {
        id: 'temperament',
        title: 'Temperament',
        content: 'Golden Retrievers are known for their friendly, reliable, and trustworthy nature. They are intelligent and versatile, making them excellent family pets, therapy dogs, and assistance dogs.',
        type: 'text',
      },
      {
        id: 'care',
        title: 'Care Requirements',
        content: 'Golden Retrievers require regular exercise and grooming. Their beautiful golden coat needs brushing several times a week to prevent matting.',
        type: 'text',
      },
      {
        id: 'training',
        title: 'Training Tips',
        content: '',
        type: 'list',
        items: [
          'Start training early - puppies are eager to learn',
          'Use positive reinforcement techniques',
          'Socialize with other dogs and people',
          'Provide plenty of mental stimulation',
        ],
      },
    ],
  },
  'asiatic-lion': {
    id: 'asiatic-lion',
    name: 'Asiatic Lion',
    scientificName: 'Panthera leo persica',
    origin: 'Gir Forest, India',
    status: 'Endangered',
    statusColor: '#F2994A',
    heroImage: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1600',
    overview: `The Asiatic lion is a lion population in Gujarat, India. Its range is restricted to the Gir National Park and environs. On a genetic basis, it is separated from the African lion.`,
    attributes: [
      { icon: 'length', label: 'Length', value: '2.0-2.8 m' },
      { icon: 'height', label: 'Height', value: '1.0-1.2 m' },
      { icon: 'weight', label: 'Weight', value: '150-250 kg' },
      { icon: 'lifespan', label: 'Life Span', value: '16-18 years' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600',
    ],
    customSections: [
      {
        id: 'conservation',
        title: 'Conservation Status',
        content: 'The Asiatic lion is listed as Endangered on the IUCN Red List. Conservation efforts have helped increase their population from around 180 in 1974 to over 600 in recent years.',
        type: 'text',
      },
      {
        id: 'habitat',
        title: 'Natural Habitat',
        content: 'Asiatic lions inhabit the Gir Forest in Gujarat, India. This dry deciduous forest is the only place in the wild where these lions can be found.',
        type: 'text',
      },
    ],
  },
  'barbary-lion': {
    id: 'barbary-lion',
    name: 'Barbary Lion',
    scientificName: 'Panthera leo leo',
    origin: 'North Africa',
    status: 'Extinct',
    statusColor: '#EB5757',
    heroImage: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1600',
    overview: `The Barbary lion was a population of the lion that is now extinct in the wild. It inhabited the Atlas Mountains of North Africa. The last known wild Barbary lion was shot in Morocco in 1942.`,
    attributes: [
      { icon: 'length', label: 'Length', value: '2.5-3.0 m' },
      { icon: 'weight', label: 'Weight', value: '200-270 kg' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600',
    ],
    customSections: [
      {
        id: 'history',
        title: 'Historical Significance',
        content: 'The Barbary lion was the most famous lion in the Roman era, often used in gladiatorial games. They were prized for their impressive dark manes that extended over the shoulders and belly.',
        type: 'text',
      },
      {
        id: 'extinction',
        title: 'Extinction',
        content: 'Overhunting and habitat loss led to the extinction of Barbary lions in the wild. Some descendants may exist in captivity, but their genetic purity is debated.',
        type: 'text',
      },
    ],
  },
};

// Default breed for demo
const defaultBreed: BreedInfo = {
  id: 'unknown',
  name: 'Unknown Breed',
  heroImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600',
  overview: 'Information about this breed is not available yet.',
  attributes: [],
  gallery: [],
  customSections: [],
};

export const BreedDetailPage: React.FC = () => {
  const { breedId } = useParams<{ breedId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const breed = breedData[breedId || ''] || defaultBreed;

  // Build dynamic tabs based on breed's custom sections
  const baseTabs: TabItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'attributes', label: 'Attributes' },
  ];

  // Add custom section tabs
  const customTabs: TabItem[] = breed.customSections.map((section) => ({
    key: section.id,
    label: section.title,
  }));

  // Add gallery tab if breed has gallery images
  const galleryTab: TabItem[] = breed.gallery.length > 0
    ? [{ key: 'gallery', label: 'Gallery' }]
    : [];

  const tabs = [...baseTabs, ...customTabs, ...galleryTab];

  const renderCustomSection = (section: CustomSection) => {
    if (section.type === 'list' && section.items) {
      return (
        <Card bordered={false} className={styles.contentCard}>
          <Title level={4} className={styles.cardTitle}>
            {section.title}
          </Title>
          <ul className={styles.listContent}>
            {section.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
      );
    }

    return (
      <Card bordered={false} className={styles.contentCard}>
        <Title level={4} className={styles.cardTitle}>
          {section.title}
        </Title>
        <Paragraph className={styles.sectionContent}>
          {section.content}
        </Paragraph>
      </Card>
    );
  };

  return (
    <motion.div
      className={styles.breedPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <HeroBanner
        image={breed.heroImage}
        status={breed.status}
        statusColor={breed.statusColor}
        title={breed.name}
        subtitle={breed.scientificName || breed.origin}
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
              <Paragraph className={styles.sectionContent}>
                {breed.overview}
              </Paragraph>
            </section>

            {/* Key Attributes */}
            {breed.attributes.length > 0 && (
              <section className={styles.section}>
                <Title level={4} className={styles.sectionTitle}>
                  Key Attributes
                </Title>
                <Row gutter={[16, 16]}>
                  {breed.attributes.map((attr, index) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={index}>
                      <AttributeCard attribute={attr} />
                    </Col>
                  ))}
                </Row>
              </section>
            )}

            {/* Display all custom sections on overview */}
            {breed.customSections.map((section) => (
              <div key={section.id}>
                {renderCustomSection(section)}
              </div>
            ))}

            {/* Photo Gallery */}
            {breed.gallery.length > 0 && (
              <PhotoGallery
                images={breed.gallery}
                altPrefix={breed.name}
              />
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
              {breed.attributes.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {breed.attributes.map((attr, index) => (
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
            <PhotoGallery
              images={breed.gallery}
              altPrefix={breed.name}
            />
          </motion.div>
        )}

        {/* Custom Section Tabs */}
        {breed.customSections.map((section) => (
          activeTab === section.id && (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderCustomSection(section)}
            </motion.div>
          )
        ))}
      </div>
    </motion.div>
  );
};
