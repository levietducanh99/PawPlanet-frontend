import React from 'react';
import { Typography, Tag } from 'antd';
import styles from './HeroBanner.module.css';

const { Title, Paragraph } = Typography;

interface HeroBannerProps {
  image: string;
  status?: string;
  statusColor?: string;
  title: string;
  subtitle?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  image,
  status,
  statusColor = '#F2994A',
  title,
  subtitle,
}) => {
  return (
    <div
      className={styles.heroSection}
      style={{ ['--hero-image' as any]: `url(${image})` }}
    >
      <div className={styles.heroOverlay}>
        {status && (
          <Tag
            className={styles.statusTag}
            style={{ backgroundColor: statusColor }}
          >
            {status}
          </Tag>
        )}
        <Title level={2} className={styles.heroTitle}>
          {title}
        </Title>
        {subtitle && (
          <Paragraph className={styles.heroSubtitle}>
            {subtitle}
          </Paragraph>
        )}
      </div>
    </div>
  );
};
