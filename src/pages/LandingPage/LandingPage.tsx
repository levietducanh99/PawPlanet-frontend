import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from 'antd';
import {
  ArrowRightOutlined,
  UserOutlined,
  BookOutlined,
  HeartOutlined,
  SearchOutlined,
  CloseOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import styles from './LandingPage.module.css';
import logoImage from '/logo/pawplanet-horizontal-logo.svg';

export interface LandingPageProps {
  onGetStarted: () => void;
}

interface PetInfo {
  name: string;
  category: string;
  origin: string;
  size: string;
  temperament: string;
  lifespan: string;
  description: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState<PetInfo | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'Shiba Inu?',
    'Mèo Ba Tư?',
    'Rồng Nam Mỹ?',
    'Corgi?',
    'Chó Golden Retriever?',
    'Mèo Anh Lông Ngắn?',
  ];

  const petDatabase = [
    {
      name: 'Shiba Inu',
      category: 'Chó',
      origin: 'Nhật Bản',
      size: 'Trung bình',
      temperament: 'Độc lập, trung thành, tinh nghịch',
      lifespan: '12-15 năm',
      description: 'Shiba Inu là giống chó nguyên thủy của Nhật Bản, nổi tiếng với vẻ ngoài giống cáo và tính cách độc lập.',
    },
    {
      name: 'Mèo Ba Tư',
      category: 'Mèo',
      origin: 'Iran (Ba Tư)',
      size: 'Trung bình đến lớn',
      temperament: 'Hiền lành, yên tĩnh, dịu dàng',
      lifespan: '12-17 năm',
      description: 'Mèo Ba Tư nổi tiếng với bộ lông dài mềm mại và khuôn mặt tròn trĩnh đáng yêu.',
    },
    {
      name: 'Rồng Nam Mỹ',
      category: 'Bò Sát',
      origin: 'Nam Mỹ',
      size: 'Lớn',
      temperament: 'Hiền lành khi quen thuộc, thông minh',
      lifespan: '15-20 năm',
      description: 'Iguana xanh Nam Mỹ là loài thằn lằn lớn, thường được nuôi làm thú cưng bò sát.',
    },
    {
      name: 'Corgi',
      category: 'Chó',
      origin: 'Xứ Wales',
      size: 'Nhỏ đến trung bình',
      temperament: 'Thân thiện, năng động, thông minh',
      lifespan: '12-15 năm',
      description: 'Corgi nổi tiếng với đôi chân ngắn, tai to và tính cách vui vẻ, năng động.',
    },
    {
      name: 'Golden Retriever',
      category: 'Chó',
      origin: 'Scotland',
      size: 'Lớn',
      temperament: 'Thân thiện, thông minh, đáng tin cậy',
      lifespan: '10-12 năm',
      description: 'Golden Retriever là giống chó gia đình lý tưởng, nổi tiếng với tính cách hiền lành và dễ huấn luyện.',
    },
    {
      name: 'Mèo Anh Lông Ngắn',
      category: 'Mèo',
      origin: 'Vương Quốc Anh',
      size: 'Trung bình đến lớn',
      temperament: 'Bình tĩnh, dễ gần, độc lập',
      lifespan: '12-20 năm',
      description: 'British Shorthair có thân hình mập mạp, mặt tròn và bộ lông ngắn dày đặc.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = petDatabase.find(
      (pet) => pet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setSelectedPet(found);
    }
  };

  const features = [
    {
      icon: <UserOutlined />,
      title: 'Cộng Đồng Yêu Thú Cưng',
      description: 'Kết nối với hàng ngàn người yêu động vật, chia sẻ khoảnh khắc đáng yêu và học hỏi kinh nghiệm nuôi pet.',
      color: '#1890FF',
    },
    {
      icon: <BookOutlined />,
      title: 'Bách Khoa Toàn Thư',
      description: 'Khám phá tri thức về hàng trăm giống chó, mèo, chim và thú cưng khác với thông tin chi tiết và chính xác.',
      color: '#F2994A',
    },
    {
      icon: <HeartOutlined />,
      title: 'Hỗ Trợ Động Vật',
      description: 'Tìm kiếm thú cưng bị thất lạc, nhận nuôi thú cưng, kêu gọi giúp đỡ động vật và tạo nên sự khác biệt.',
      color: '#27AE60',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Người Dùng' },
    { value: '500+', label: 'Giống Vật Nuôi' },
    { value: '2K+', label: 'Pet Được Nhận Nuôi' },
  ];

  return (
    <div className={styles.landingPage}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={styles.navbar}
      >
        <div className={styles.navContainer}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={styles.logoWrapper}
          >
            <img src={logoImage} alt="PawPlanet Logo" className={styles.logo} />
          </motion.div>

          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              Tính Năng
            </a>
            <a href="#about" className={styles.navLink}>
              Về Chúng Tôi
            </a>
            <Button
              type="primary"
              onClick={onGetStarted}
              className={styles.navButton}
              icon={<ArrowRightOutlined />}
            >
              Bắt Đầu
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.backgroundAnimations}>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={styles.bgBlob1}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={styles.bgBlob2}
          />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroContent}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.badge}
              >
                <span>✨</span>
                <span>Nền Tảng Mạng Xã Hội Thú Cưng #1 Việt Nam</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                Kết Nối Cộng Đồng
                <br />
                <span className={styles.heroTitleHighlight}>Yêu Thú Cưng</span>
              </h1>

              <p className={styles.heroDescription}>
                Chia sẻ khoảnh khắc đáng yêu, khám phá tri thức về động vật, và góp phần giúp động vật có 1 cuộc sống tốt hơn.
                Tất cả trong một nền tảng.
              </p>

              <div className={styles.heroButtons}>
                <Button
                  type="primary"
                  size="large"
                  onClick={onGetStarted}
                  className={styles.primaryButton}
                  icon={<ArrowRightOutlined />}
                >
                  Bắt Đầu Miễn Phí
                </Button>
                <Button
                  size="large"
                  className={styles.secondaryButton}
                >
                  Xem Demo
                </Button>
              </div>

              {/* Stats */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={styles.statItem}
                  >
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Logo with 3D Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroImageWrapper}
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 10, 0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={styles.logo3D}
              >
                <img
                  src={logoImage}
                  alt="PawPlanet"
                  className={styles.heroLogo}
                />
              </motion.div>

              {/* Floating paw prints */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    y: [0, -100, 0],
                    x: [0, Math.random() * 50 - 25, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className={styles.floatingPaw}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                >
                  🐾
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresBg} />

        <div className={styles.featuresContainer}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.featuresHeader}
          >
            <h2 className={styles.featuresTitle}>
              Bạn Thực Sự Hiểu
              <br />
              <span className={styles.featuresTitleHighlight}>Người Bạn Nhỏ</span> Của Mình?
            </h2>
            <p className={styles.featuresSubtitle}>
              Khám phá bách khoa toàn thư về hàng trăm giống thú cưng
            </p>
          </motion.div>

          {/* Giant Search Bar */}
          <motion.form
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className={styles.searchWrapper}
          >
            <div className={styles.searchContainer}>
              <SearchOutlined className={styles.searchIcon} />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />

              {/* Animated Placeholder */}
              {!searchQuery && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={placeholderIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.searchPlaceholder}
                  >
                    Bạn muốn tìm hiểu về... {placeholders[placeholderIndex]}
                  </motion.div>
                </AnimatePresence>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.searchButton}
              >
                Tìm Kiếm
                <SearchOutlined />
              </motion.button>
            </div>
          </motion.form>

          {/* Quick Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className={styles.suggestions}
          >
            {['Shiba Inu', 'Mèo Ba Tư', 'Corgi', 'Golden Retriever'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className={styles.suggestionTag}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>

          {/* Feature Cards */}
          <div className={styles.featureCards}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon} style={{ backgroundColor: `${feature.color}20` }}>
                  {React.cloneElement(feature.icon, { style: { color: feature.color, fontSize: '32px' } })}
                </div>

                <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                <p className={styles.featureCardDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pet Detail Modal */}
        <AnimatePresence>
          {selectedPet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modalOverlay}
              onClick={() => setSelectedPet(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className={styles.modal}
              >
                {/* Modal Header */}
                <div className={styles.modalHeader}>
                  <button
                    onClick={() => setSelectedPet(null)}
                    className={styles.modalClose}
                  >
                    <CloseOutlined />
                  </button>

                  <div className={styles.modalHeaderContent}>
                    <div className={styles.modalIconWrapper}>
                      🐾
                    </div>
                    <div>
                      <h3 className={styles.modalTitle}>{selectedPet.name}</h3>
                      <p className={styles.modalCategory}>{selectedPet.category}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className={styles.modalBody}>
                  <p className={styles.modalDescription}>{selectedPet.description}</p>

                  <div className={styles.modalDetails}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Xuất Xứ</div>
                      <div className={styles.detailValue}>{selectedPet.origin}</div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Kích Thước</div>
                      <div className={styles.detailValue}>{selectedPet.size}</div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Tính Cách</div>
                      <div className={styles.detailValue}>{selectedPet.temperament}</div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Tuổi Thọ</div>
                      <div className={styles.detailValue}>{selectedPet.lifespan}</div>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    onClick={onGetStarted}
                    className={styles.modalButton}
                    block
                  >
                    Tìm Hiểu Thêm Trên PawPlanet
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />

        <div className={styles.ctaContainer}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ctaContent}
          >
            <SafetyOutlined className={styles.ctaIcon} />

            <h2 className={styles.ctaTitle}>Sẵn Sàng Tham Gia Cộng Đồng?</h2>
            <p className={styles.ctaDescription}>
              Đăng ký miễn phí ngay hôm nay và khám phá thế giới thú cưng đầy màu sắc
            </p>

            <Button
              type="primary"
              size="large"
              onClick={onGetStarted}
              className={styles.ctaButton}
              icon={<ArrowRightOutlined />}
            >
              Bắt Đầu Ngay
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <img src={logoImage} alt="PawPlanet" className={styles.footerLogo} />

          <p className={styles.footerCopyright}>
            © 2026 PawPlanet. Tất cả quyền được bảo lưu.
          </p>

          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Điều Khoản</a>
            <a href="#" className={styles.footerLink}>Quyền Riêng Tư</a>
            <a href="#" className={styles.footerLink}>Liên Hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

