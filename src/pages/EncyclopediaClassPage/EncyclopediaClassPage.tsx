import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Alert, Pagination, Row, Col, Typography } from 'antd';

import { pageVariants } from '@/animations/variants';
import { HeroBanner, PillTabs, SpeciesCard, TabItem, SpeciesCardData } from '@/components/Encyclopedia';
import { useEncyclopediaClasses, useEncyclopediaSpeciesList } from '@/hooks';

import styles from './EncyclopediaClassPage.module.css';

const { Paragraph, Title } = Typography;

const tabs: TabItem[] = [
  { key: 'species', label: 'Species' },
];

export const EncyclopediaClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const numericClassId = Number(classId);
  const [activeTab, setActiveTab] = useState('species');
  const [page, setPage] = useState(1);

  const pageSize = 24;

  const { data: classes } = useEncyclopediaClasses();

  const currentClass = useMemo(() => {
    if (!Number.isFinite(numericClassId)) return undefined;
    return classes.find((c) => c.id === numericClassId);
  }, [classes, numericClassId]);

  const {
    data: speciesPaged,
    loading: speciesLoading,
    error: speciesError,
  } = useEncyclopediaSpeciesList({
    classId: Number.isFinite(numericClassId) ? numericClassId : undefined,
    page: page - 1,
    size: pageSize,
  });

  const heroImage =
    currentClass?.avatarUrl ||
    'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1600';

  const speciesCards: SpeciesCardData[] = useMemo(() => {
    return (speciesPaged.items ?? []).map((s) => ({
      id: String(s.id),
      name: s.name,
      scientificName: s.scientificName,
      status: undefined,
      statusColor: undefined,
      image:
        s.avatarUrl ||
        'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800',
      slug: s.slug,
    }));
  }, [speciesPaged.items]);

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <HeroBanner
        image={heroImage}
        status="Animal Class"
        statusColor="#1890FF"
        title={currentClass?.name || 'Animal Class'}
        subtitle={currentClass?.description}
      />

      <PillTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} sticky />

      <div className={styles.content}>
        {speciesError && (
          <Alert type="error" message={speciesError.message} showIcon />
        )}

        {speciesLoading ? (
          <Paragraph className={styles.loading}>Loading species...</Paragraph>
        ) : (
          <>
            <div className={styles.headerRow}>
              <Title level={4} className={styles.sectionTitle}>
                Species
              </Title>
              <Paragraph className={styles.meta}>
                {speciesPaged.totalItems} results
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} className={styles.grid}>
              {speciesCards.map((s) => (
                <Col key={s.id} xs={24} sm={12} md={8} lg={6}>
                  <SpeciesCard
                    species={s}
                    onClick={(item) => {
                      if (item.slug) navigate(`/encyclopedia/species/${item.slug}`);
                      else navigate(`/encyclopedia/species/${item.id}`);
                    }}
                  />
                </Col>
              ))}
            </Row>

            {speciesPaged.totalItems > pageSize && (
              <div className={styles.pagination}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={speciesPaged.totalItems}
                  showSizeChanger={false}
                  onChange={(next) => setPage(next)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

