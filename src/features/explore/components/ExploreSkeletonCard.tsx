import React from 'react';
import { Card, Skeleton } from 'antd';
import styles from './ExploreSkeletonCard.module.css';

export const ExploreSkeletonCard: React.FC = () => {
  // Random height for masonry effect
  const heights = [280, 340, 400, 320, 360];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <Card
      className={styles.skeletonCard}
      style={{ height: `${randomHeight}px` }}
      bordered={false}
    >
      <Skeleton.Image
        active
        style={{ width: '100%', height: '60%' }}
      />
      <div className={styles.content}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </Card>
  );
};

