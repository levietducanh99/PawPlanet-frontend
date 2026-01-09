/**
 * PetAdoptionToggle Component
 * 
 * Toggle switch for enabling/disabling adoption status (owner only).
 * Controls pet status between NORMAL and FOR_ADOPTION.
 */

import React from 'react';
import { Switch, Card, Typography, Space } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PetAdoptionToggleProps {
  isForAdoption: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

export const PetAdoptionToggle: React.FC<PetAdoptionToggleProps> = ({
  isForAdoption,
  onToggle,
  loading = false,
  disabled = false,
}) => {
  const handleChange = async (checked: boolean) => {
    await onToggle(checked);
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '16px',
      }}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isForAdoption ? '#FFF7E6' : '#F0F0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartOutlined
              style={{ fontSize: '20px', color: isForAdoption ? '#F2994A' : '#8C8C8C' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block' }}>
              Available for Adoption
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {isForAdoption
                ? 'Your pet is open for adoption'
                : 'Enable to make your pet available for adoption'}
            </Text>
          </div>
        </Space>
        <Switch
          checked={isForAdoption}
          onChange={handleChange}
          loading={loading}
          disabled={disabled}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      </Space>
    </Card>
  );
};
