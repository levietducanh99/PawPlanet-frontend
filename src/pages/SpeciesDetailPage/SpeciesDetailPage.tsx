import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Typography, Tag, Row, Col, Card } from 'antd';
import {
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { pageVariants, cardHoverVariants } from '@/animations/variants';
import styles from './SpeciesDetailPage.module.css';

const { Title, Paragraph } = Typography;

// Mock data for species
const speciesData: Record<string, SpeciesInfo> = {
  lion: {
    id: 'lion',
    commonName: 'African Lion',
    scientificName: 'Panthera leo',
    status: 'Vulnerable',
    statusColor: '#F2994A',
    heroImage: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1600',
    overview: `The African lion is a large cat of the genus Panthera native to Africa and India. It has a muscular, broad-chested body; short, rounded head; round ears; and a hairy tuft at the end of its tail. It is sexually dimorphic; adult male lions are larger than females and have a prominent mane.`,
    attributes: [
      { icon: 'length', label: 'Length', value: '1.4-2.5 m' },
      { icon: 'height', label: 'Height', value: '1.2 m' },
      { icon: 'weight-male', label: 'Weight (Male)', value: '190 kg' },
      { icon: 'weight-female', label: 'Weight (Female)', value: '126 kg' },
      { icon: 'lifespan', label: 'Life Span', value: '10-14 years' },
      { icon: 'speed', label: 'Top Speed', value: '80 km/h' },
    ],
    appearance: {
      title: 'Physical Appearance',
      content: `Lions are the only cats that live in groups, called prides. A pride consists of about 15 lions. Male lions defend the pride's territory, which may include some 100 square miles of grasslands, scrub, or open woodlands. These intimidating animals mark the area with urine, roar menacingly to warn intruders, and chase off animals that encroach on their turf.`,
    },
    behavior: {
      title: 'Lifestyle & Behavior',
      content: `Female lions are the pride's primary hunters. They often work together to prey upon antelopes, zebras, wildebeest, and other large animals of the open grasslands. Many of these animals are faster than lions, so teamwork pays off. After the kill, the males usually eat first, lionesses next—and the cubs get what's left.`,
    },
    gallery: [
      'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600',
      'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600',
      'https://images.unsplash.com/photo-1552410260-0fd9e8f8e0c2?w=600',
    ],
    subspecies: [
      {
        id: 'asiatic-lion',
        name: 'Asiatic Lion',
        scientificName: 'Panthera leo persica',
        status: 'Endangered',
        statusColor: '#F2994A',
        image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400',
      },
      {
        id: 'barbary-lion',
        name: 'Barbary Lion',
        scientificName: 'Panthera leo leo',
        status: 'Extinct',
        statusColor: '#EB5757',
        image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400',
      },
    ],
  },
  snake: {
    id: 'snake',
    commonName: 'King Cobra',
    scientificName: 'Ophiophagus hannah',
    status: 'Venomous',
    statusColor: '#EB5757',
    heroImage: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=1600',
    overview: `The king cobra is the world's longest venomous snake, with a length up to 5.85 m (19.2 ft). This species is native to the Indian subcontinent and Southeast Asia. Despite the word "cobra" in its common name, this species does not belong to the genus Naja but is the sole member of its own genus.`,
    attributes: [
      { icon: 'length', label: 'Length', value: '3-5.8 m' },
      { icon: 'weight-male', label: 'Weight', value: '6 kg' },
      { icon: 'lifespan', label: 'Life Span', value: '20 years' },
      { icon: 'speed', label: 'Strike Speed', value: '2.4 m/s' },
    ],
    appearance: {
      title: 'Physical Appearance',
      content: `The king cobra's skin colour varies across habitats, from black with white stripes to unbroken brownish grey. It has an olive green colour with pale yellow cross bands in some areas.`,
    },
    behavior: {
      title: 'Lifestyle & Behavior',
      content: `King cobras are diurnal and primarily feed on other snakes. They are the only snakes that build nests for their eggs, which the female guards until they hatch.`,
    },
    gallery: [
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600',
    ],
    subspecies: [],
  },
  jellyfish: {
    id: 'jellyfish',
    commonName: 'Moon Jellyfish',
    scientificName: 'Aurelia aurita',
    status: 'Marine',
    statusColor: '#1890FF',
    heroImage: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=1600',
    overview: `The moon jellyfish is a species of jellyfish found throughout most of the world's oceans. It is translucent, usually about 25–40 cm (10–16 in) in diameter, and can be recognized by its four horseshoe-shaped gonads, easily seen through the top of the bell.`,
    attributes: [
      { icon: 'length', label: 'Diameter', value: '25-40 cm' },
      { icon: 'lifespan', label: 'Life Span', value: '6-12 months' },
    ],
    appearance: {
      title: 'Physical Appearance',
      content: `Moon jellies are translucent and their four horseshoe-shaped gonads are easily visible through the bell. The bell is almost flat, with a round disk shape.`,
    },
    behavior: {
      title: 'Lifestyle & Behavior',
      content: `Moon jellyfish feed on plankton, which includes organisms such as mollusks, crustaceans, tunicate larvae, copepods, rotifers, and nematodes.`,
    },
    gallery: [
      'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=600',
    ],
    subspecies: [],
  },
};

interface Attribute {
  icon: string;
  label: string;
  value: string;
}

interface Subspecies {
  id: string;
  name: string;
  scientificName: string;
  status: string;
  statusColor: string;
  image: string;
}

interface SpeciesInfo {
  id: string;
  commonName: string;
  scientificName: string;
  status: string;
  statusColor: string;
  heroImage: string;
  overview: string;
  attributes: Attribute[];
  appearance: { title: string; content: string };
  behavior: { title: string; content: string };
  gallery: string[];
  subspecies: Subspecies[];
}

const getAttributeIcon = (iconType: string) => {
  switch (iconType) {
    case 'length':
      return <ColumnWidthOutlined />;
    case 'height':
      return <ColumnHeightOutlined />;
    case 'weight-male':
    case 'weight-female':
      return <span className={styles.weightIcon}>⚖</span>;
    case 'lifespan':
      return <ClockCircleOutlined />;
    case 'speed':
      return <ThunderboltOutlined />;
    default:
      return <span>•</span>;
  }
};

export const SpeciesDetailPage: React.FC = () => {
  const { speciesId } = useParams<{ speciesId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const species = speciesData[speciesId || 'lion'] || speciesData.lion;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'attributes', label: 'Attributes' },
    { key: 'appearance', label: 'Appearance & Habits' },
    { key: 'habitat', label: 'Habitat' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'subspecies', label: 'Subspecies' },
    { key: 'related', label: 'Related Species' },
  ];

  return (
    <motion.div
      className={styles.speciesPage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <div
        className={styles.heroSection}
        style={{ backgroundImage: `url(${species.heroImage})` }}
      >
        <div className={styles.heroOverlay}>
          <Tag
            className={styles.statusTag}
            style={{ backgroundColor: species.statusColor }}
          >
            {species.status}
          </Tag>
          <Title level={2} className={styles.heroTitle}>
            {species.commonName}
          </Title>
          <Paragraph className={styles.heroScientificName}>
            {species.scientificName}
          </Paragraph>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
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
      </div>

      {/* Content Sections */}
      <div className={styles.contentContainer}>
        {/* Overview Section - Always visible on overview tab */}
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
                {species.overview}
              </Paragraph>
            </section>

            {/* Key Attributes */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>
                Key Attributes
              </Title>
              <Row gutter={[16, 16]}>
                {species.attributes.map((attr, index) => (
                  <Col xs={12} sm={8} md={4} key={index}>
                    <Card bordered={false} className={styles.attributeCard}>
                      <div className={styles.attributeIcon}>
                        {getAttributeIcon(attr.icon)}
                      </div>
                      <div className={styles.attributeLabel}>{attr.label}</div>
                      <div className={styles.attributeValue}>{attr.value}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>

            {/* Appearance & Habits */}
            <Card bordered={false} className={styles.contentCard}>
              <Title level={3} className={styles.cardTitle}>
                Appearance & Habits
              </Title>

              <div className={styles.subsection}>
                <Title level={5} className={styles.subsectionTitle}>
                  {species.appearance.title}
                </Title>
                <Paragraph className={styles.subsectionContent}>
                  {species.appearance.content}
                </Paragraph>
              </div>

              <div className={styles.subsection}>
                <Title level={5} className={styles.subsectionTitle}>
                  {species.behavior.title}
                </Title>
                <Paragraph className={styles.subsectionContent}>
                  {species.behavior.content}
                </Paragraph>
              </div>
            </Card>

            {/* Photo Gallery */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitleBlue}>
                Photo Gallery
              </Title>
              <div className={styles.galleryGrid}>
                {species.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    className={styles.galleryItem}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <img src={image} alt={`${species.commonName} ${index + 1}`} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Subspecies */}
            {species.subspecies.length > 0 && (
              <section className={styles.section}>
                <Title level={4} className={styles.sectionTitle}>
                  Subspecies
                </Title>
                <Row gutter={[16, 16]}>
                  {species.subspecies.map((sub) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={sub.id}>
                      <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                      >
                        <Card bordered={false} className={styles.subspeciesCard}>
                          <div
                            className={styles.subspeciesImage}
                            style={{ backgroundImage: `url(${sub.image})` }}
                          >
                            <Tag
                              className={styles.subspeciesTag}
                              style={{ backgroundColor: sub.statusColor }}
                            >
                              {sub.status}
                            </Tag>
                          </div>
                          <div className={styles.subspeciesInfo}>
                            <Title level={5} className={styles.subspeciesName}>
                              {sub.name}
                            </Title>
                            <Paragraph className={styles.subspeciesScientific}>
                              {sub.scientificName}
                            </Paragraph>
                          </div>
                        </Card>
                      </motion.div>
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
              <Row gutter={[16, 16]}>
                {species.attributes.map((attr, index) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={index}>
                    <Card bordered={false} className={styles.attributeCard}>
                      <div className={styles.attributeIcon}>
                        {getAttributeIcon(attr.icon)}
                      </div>
                      <div className={styles.attributeLabel}>{attr.label}</div>
                      <div className={styles.attributeValue}>{attr.value}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>
          </motion.div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card bordered={false} className={styles.contentCard}>
              <Title level={3} className={styles.cardTitle}>
                Appearance & Habits
              </Title>
              <div className={styles.subsection}>
                <Title level={5} className={styles.subsectionTitle}>
                  {species.appearance.title}
                </Title>
                <Paragraph className={styles.subsectionContent}>
                  {species.appearance.content}
                </Paragraph>
              </div>
              <div className={styles.subsection}>
                <Title level={5} className={styles.subsectionTitle}>
                  {species.behavior.title}
                </Title>
                <Paragraph className={styles.subsectionContent}>
                  {species.behavior.content}
                </Paragraph>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitleBlue}>
                Photo Gallery
              </Title>
              <div className={styles.galleryGrid}>
                {species.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    className={styles.galleryItem}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <img src={image} alt={`${species.commonName} ${index + 1}`} />
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* Subspecies Tab */}
        {activeTab === 'subspecies' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>
                Subspecies
              </Title>
              {species.subspecies.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {species.subspecies.map((sub) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={sub.id}>
                      <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                      >
                        <Card bordered={false} className={styles.subspeciesCard}>
                          <div
                            className={styles.subspeciesImage}
                            style={{ backgroundImage: `url(${sub.image})` }}
                          >
                            <Tag
                              className={styles.subspeciesTag}
                              style={{ backgroundColor: sub.statusColor }}
                            >
                              {sub.status}
                            </Tag>
                          </div>
                          <div className={styles.subspeciesInfo}>
                            <Title level={5} className={styles.subspeciesName}>
                              {sub.name}
                            </Title>
                            <Paragraph className={styles.subspeciesScientific}>
                              {sub.scientificName}
                            </Paragraph>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className={styles.emptyState}>
                  <Paragraph>No subspecies information available.</Paragraph>
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'habitat' || activeTab === 'related') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.placeholderSection}
          >
            <Paragraph className={styles.placeholderText}>
              {activeTab === 'habitat' ? 'Habitat' : 'Related Species'} section - Coming soon!
            </Paragraph>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
