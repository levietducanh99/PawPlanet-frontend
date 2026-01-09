import React from 'react';
import { motion } from 'motion/react';
import { Avatar } from 'antd';
import styles from './PetTag.module.css';

export interface PetTagProps {
  id: number;
  name: string;
  species: string;
  breed?: string;
  avatarUrl?: string;
  onClick?: () => void;
}

/**
 * PetTag Component - "Glass Bio-Link" Design
 *
 * Modern, luxurious pet tag with glassmorphism effect.
 * Features:
 * - Frosted glass background (backdrop-filter blur)
 * - 3D floating avatar with elevation effect
 * - Species-specific accent colors on hover
 * - Premium, contemporary aesthetic
 */
export const PetTag: React.FC<PetTagProps> = ({
  name,
  species,
  breed,
  avatarUrl,
  onClick,
}) => {
  // Get species identifier for CSS styling
  const getSpeciesIdentifier = (speciesName: string): string => {
    const lowerSpecies = speciesName.toLowerCase();

    if (lowerSpecies.includes('dog') || lowerSpecies.includes('chó')) {
      return 'dog';
    }
    if (lowerSpecies.includes('cat') || lowerSpecies.includes('mèo')) {
      return 'cat';
    }
    if (lowerSpecies.includes('bird') || lowerSpecies.includes('chim')) {
      return 'bird';
    }
    if (lowerSpecies.includes('fish') || lowerSpecies.includes('cá')) {
      return 'fish';
    }
    if (lowerSpecies.includes('rabbit') || lowerSpecies.includes('thỏ')) {
      return 'rabbit';
    }

    return 'other';
  };

  // Get avatar background color for species - pastel gradients
  const getAvatarBgColor = (speciesName: string): string => {
    const lowerSpecies = speciesName.toLowerCase();

    if (lowerSpecies.includes('dog') || lowerSpecies.includes('chó')) {
      return '#63B3ED'; // Soft blue
    }
    if (lowerSpecies.includes('cat') || lowerSpecies.includes('mèo')) {
      return '#FF77BB'; // Soft pink
    }
    if (lowerSpecies.includes('bird') || lowerSpecies.includes('chim')) {
      return '#A78BFA'; // Soft purple
    }
    if (lowerSpecies.includes('fish') || lowerSpecies.includes('cá')) {
      return '#5EEAC5'; // Soft turquoise
    }
    if (lowerSpecies.includes('rabbit') || lowerSpecies.includes('thỏ')) {
      return '#FCA5A5'; // Soft coral
    }

    return '#CBD5E1'; // Soft gray
  };

  const speciesId = getSpeciesIdentifier(species);
  const avatarBgColor = getAvatarBgColor(species);
  const details = breed ? `${species} · ${breed}` : species;

  return (
    <motion.div
      className={styles.petTag}
      data-species={speciesId}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {/* 3D Floating Avatar */}
      {avatarUrl ? (
        <Avatar
          src={avatarUrl}
          size={48}
          className={styles.avatar}
        />
      ) : (
        <Avatar
          size={48}
          className={styles.avatar}
          style={{ backgroundColor: avatarBgColor }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      )}

      {/* Pet Info */}
      <div className={styles.petInfo}>
        <span className={styles.petName}>{name}</span>
        <span className={styles.petDetails}>
          {details}
        </span>
      </div>
    </motion.div>
  );
};


