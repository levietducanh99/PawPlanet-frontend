import React from 'react';
import { motion } from 'motion/react';
import { Card, Tag, Typography } from 'antd';
import { cardHoverVariants } from '@/animations/variants';
import styles from './SpeciesCard.module.css';

const { Title, Paragraph } = Typography;

export interface SpeciesCardData {
  id: string;
  name: string;
  scientificName?: string;
  status?: string;
  statusColor?: string;
  image: string;
}

interface SpeciesCardProps {
  species: SpeciesCardData;
  onClick?: (species: SpeciesCardData) => void;
}

export const SpeciesCard: React.FC<SpeciesCardProps> = ({
  species,
  onClick,
}) => {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      onClick={() => onClick?.(species)}
    >
      <Card bordered={false} className={styles.speciesCard}>
        <div
          className={styles.speciesImage}
          style={{ ['--species-image' as any]: `url(${species.image})` }}
        >
          {species.status && (
            <Tag
              className={styles.speciesTag}
              style={{ backgroundColor: species.statusColor || '#F2994A' }}
            >
              {species.status}
            </Tag>
          )}
        </div>
        <div className={styles.speciesInfo}>
          <Title level={5} className={styles.speciesName}>
            {species.name}
          </Title>
          {species.scientificName && (
            <Paragraph className={styles.speciesScientific}>
              {species.scientificName}
            </Paragraph>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
