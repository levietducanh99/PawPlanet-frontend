import React from 'react';
import { Card } from 'antd';
import {
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import styles from './AttributeCard.module.css';

export interface AttributeData {
  icon: string;
  label: string;
  value: string;
}

interface AttributeCardProps {
  attribute: AttributeData;
}

const getAttributeIcon = (iconType: string) => {
  switch (iconType) {
    case 'length':
      return <ColumnWidthOutlined />;
    case 'height':
      return <ColumnHeightOutlined />;
    case 'weight':
    case 'weight-male':
    case 'weight-female':
      return <InboxOutlined />;
    case 'lifespan':
      return <ClockCircleOutlined />;
    case 'speed':
      return <ThunderboltOutlined />;
    default:
      return <span>•</span>;
  }
};

export const AttributeCard: React.FC<AttributeCardProps> = ({ attribute }) => {
  return (
    <Card bordered={false} className={styles.attributeCard}>
      <div className={styles.attributeIcon}>
        {getAttributeIcon(attribute.icon)}
      </div>
      <div className={styles.attributeLabel}>{attribute.label}</div>
      <div className={styles.attributeValue}>{attribute.value}</div>
    </Card>
  );
};
