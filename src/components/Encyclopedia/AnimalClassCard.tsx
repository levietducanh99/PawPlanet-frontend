import React from 'react';
import { motion } from 'motion/react';
import { Typography } from 'antd';
import { cardHoverVariants } from '@/animations/variants';
import styles from './AnimalClassCard.module.css';

const { Title, Paragraph } = Typography;

export interface AnimalClassData {
  id: string;
  slug?: string;
  name: string;
  description: string;
  image: string;
  size: 'large' | 'small';
}

interface AnimalClassCardProps {
  animalClass: AnimalClassData;
  onClick?: (animalClass: AnimalClassData) => void;
}

export const AnimalClassCard: React.FC<AnimalClassCardProps> = ({
  animalClass,
  onClick,
}) => {
  const isLarge = animalClass.size === 'large';

  return (
    <motion.div
      className={isLarge ? styles.largeCard : styles.smallCard}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      onClick={() => onClick?.(animalClass)}
    >
      <div
        className={styles.cardImage}
        style={{ backgroundImage: `url(${animalClass.image})` }}
      >
        <div className={styles.cardOverlay}>
          <Title
            level={isLarge ? 4 : 5}
            className={styles.cardTitle}
          >
            {animalClass.name}
          </Title>
          <Paragraph className={isLarge ? styles.cardDescription : styles.cardDescriptionSmall}>
            {animalClass.description}
          </Paragraph>
        </div>
      </div>
    </motion.div>
  );
};
