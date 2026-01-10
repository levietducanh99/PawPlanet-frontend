import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from 'antd';
import { HeartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { pageVariants } from '@/animations/variants.ts';
import styles from './HomePage.module.css';
import '../../styles/variables.css';
import '../../styles/fonts.css';

// Import logo
import logoImage from '/logo/logo_pawplanet.png';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '10K+', label: 'Thú Cưng' },
    { value: '5K+', label: 'Thành Viên' },
    { value: '50K+', label: 'Bài Viết' },
  ];

  return (
    <motion.div
      className={styles.homePage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section with Central Logo and Floating Pet Bubbles */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Central Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={styles.centralLogoWrapper}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <img
                src={logoImage}
                alt="PawPlanet"
                className={styles.centralLogo}
              />
            </motion.div>
          </motion.div>

          {/* Floating Pet Bubbles */}
          {[
            { img: '/bubble/1000_F_569415360_6wT95w9RyK6I0rHFDGdSKd1kI0oPMFDW.jpg', position: 'topLeft', color: '#27AE60' },
            { img: '/bubble/a-close-up-portrait-of-an-adorable-baby-panda-with-black-and-white-fur-looking-directly-photo.jpg', position: 'topRight', color: '#1890FF' },
            { img: '/bubble/45202208bb43745d61ccd7a5779bb8e6.jpg', position: 'middleLeft', color: '#F2994A' },
            { img: '/bubble/b5387b049af8ddf5a97e334364b61c0d.jpg', position: 'middleRight', color: '#EB5757' },
            { img: '/bubble/cute-fish-ocean-wonder-photo_960396-928430.avif', position: 'bottomLeft', color: '#9B59B6' },
            { img: '/bubble/anh-mo-ta.jfif', position: 'bottomRight', color: '#27AE60' },
          ].map((bubble, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
              className={`${styles.petBubble} ${styles[bubble.position]}`}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={styles.petBubbleInner}
              >
                <div className={styles.petBubbleImage}>
                  <img src={bubble.img} alt={`Pet ${index + 1}`} />
                </div>
                <div className={styles.petBubbleIcon} style={{ backgroundColor: bubble.color }}>
                  <HeartOutlined />
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Hero Content Below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className={styles.heroContentCenter}
          >
            <h1 className={styles.heroTitle}>
              Kết Nối Cộng Đồng
              <br />
              <span className={styles.heroTitleHighlight}>Yêu Động Vật</span>
            </h1>

            <p className={styles.heroDescription}>
              Chia sẻ khoảnh khắc đáng yêu, khám phá tri thức về động vật,kết nối và nhận được sự giúp đỡ của cộng đồng yêu động vật trên toàn cầu
            </p>

            <div className={styles.buttonGroup}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/explore')}
                className={styles.primaryButton}
                icon={<ArrowRightOutlined />}
              >
                Khám Phá Ngay
              </Button>

              <Button
                size="large"
                onClick={() => navigate('/create-pet')}
                className={styles.secondaryButton}
              >
                Tạo Hồ Sơ Pet
              </Button>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.1 }}
                  className={styles.statItem}
                >
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};
