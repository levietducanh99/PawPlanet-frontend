import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchOutlined } from '@ant-design/icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

// Particle component
const FloatingParticle: React.FC<{
  delay: number;
  index: number;
  size?: 'small' | 'medium' | 'large';
}> = ({ delay, index, size = 'medium' }) => {
  const randomX = (Math.random() - 0.5) * 40; // small horizontal drift in px
  const randomY = -20 - Math.random() * 80; // upward motion
  const randomDuration = 0.9 + Math.random() * 1.3;
  const randomDelay = delay + index * 0.08 + Math.random() * 0.2;

  const hues = [268, 292, 312, 330, 350, 210, 230, 250]; // purple -> pink -> blue tones
  const currentHue = hues[index % hues.length];

  // left percent between 18% and 82% so it stays inside input and avoids the icon on the left
  const leftPercent = 18 + Math.random() * 64;
  const bottomPx = 6 + Math.random() * 10;

  const classes = [styles.particle, size === 'small' ? styles.small : size === 'large' ? styles.large : ''].join(' ');

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 0], x: randomX, y: [0, randomY], scale: [0.6, 1.1, 0.5] }}
      transition={{ duration: randomDuration, delay: randomDelay, ease: 'easeOut' }}
      style={{
        background: `linear-gradient(180deg, hsl(${currentHue} 80% 70% / 1), hsl(${currentHue} 80% 60% / 0.6))`,
        left: `${leftPercent}%`,
        bottom: `${bottomPx}px`,
      }}
    />
  );
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search animals, species, or breeds...',
  onSearch,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={styles.searchBarContainer} ref={containerRef}>
      {/* Glow effect - hiển thị khi focus */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className={styles.glowEffect}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Main search input container */}
      <motion.div
        className={styles.inputWrapper}
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className={styles.searchInputContainer}>
          <span className={styles.searchIcon} aria-hidden>
            <SearchOutlined />
          </span>
          <input
            type="text"
            className={styles.searchInput}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search"
          />

          {/* Sheen element (animated highlight) */}
          <div className={styles.sheen} aria-hidden />

          {/* Floating particles - render inside input container so positions are relative to the input */}
          {isFocused && (
            <>
              {Array.from({ length: 12 }).map((_, index) => {
                const size: 'small' | 'medium' | 'large' = index % 3 === 0 ? 'large' : index % 2 === 0 ? 'small' : 'medium';
                return <FloatingParticle key={`particle-${index}`} delay={0} index={index} size={size} />;
              })}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
