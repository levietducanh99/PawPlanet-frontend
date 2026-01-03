import React from 'react';
import { motion } from 'motion/react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { HeartOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { pageVariants, cardHoverVariants } from '@/animations/variants.ts';
import styles from './HomePage.module.css';
import '../../styles/variables.css';
import '../../styles/fonts.css';

const { Title, Paragraph } = Typography;

export const HomePage: React.FC = () => {
  return (
    <motion.div
      className={styles.homePage}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className={styles.header}>
        <Title level={1} className={styles.title}>
          Welcome to PawPlanet
        </Title>
        <Paragraph className={styles.subtitle}>
          Your pet social network - Connect, Share, and Care for your furry friends
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
          >
            <Card bordered={false} className={styles.card}>
              <div className={styles.iconContainer}>
                <HeartOutlined className={styles.icon} />
              </div>
              <Title level={3}>Share Pet Moments</Title>
              <Paragraph className={styles.cardDescription}>
                Share adorable photos and stories of your pets with the community
              </Paragraph>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} md={8}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
          >
            <Card bordered={false} className={styles.card}>
              <div className={styles.iconContainer}>
                <UserOutlined className={styles.icon} />
              </div>
              <Title level={3}>Connect with Others</Title>
              <Paragraph className={styles.cardDescription}>
                Meet fellow pet lovers and build a supportive community
              </Paragraph>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} md={8}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
          >
            <Card bordered={false} className={styles.card}>
              <div className={styles.iconContainer}>
                <EnvironmentOutlined className={styles.icon} />
              </div>
              <Title level={3}>Discover Pet Places</Title>
              <Paragraph className={styles.cardDescription}>
                Find pet-friendly places, vets, and services near you
              </Paragraph>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <div className={styles.ctaSection}>
        <Button type="primary" size="large" className={styles.primaryButton}>
          Get Started
        </Button>
        <Button size="large">
          Learn More
        </Button>
      </div>
    </motion.div>
  );
};
