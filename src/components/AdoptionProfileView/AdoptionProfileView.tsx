/**
 * AdoptionProfileView Component
 * 
 * Displays adoption profile in read-only mode.
 * Accessible to all users when pet status is FOR_ADOPTION.
 */

import React from 'react';
import { Card, Descriptions, Tag, Typography, Space, Divider } from 'antd';
import {
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { AdoptionProfile } from '@/domain/adoption';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface AdoptionProfileViewProps {
  profile: AdoptionProfile;
  petName?: string;
}

export const AdoptionProfileView: React.FC<AdoptionProfileViewProps> = ({
  profile,
  petName,
}) => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFF7E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <HeartOutlined style={{ fontSize: '32px', color: '#F2994A' }} />
        </div>
        <Title level={3} style={{ marginBottom: '8px' }}>
          {petName ? `${petName} is Available for Adoption` : 'Adoption Profile'}
        </Title>
        <Text type="secondary">
          Read carefully to ensure this pet is a good match for your home
        </Text>
      </div>

      <Card
        bordered={false}
        style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      >
        {/* Health Information */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            <InfoCircleOutlined style={{ marginRight: '8px', color: '#1890FF' }} />
            Health Information
          </Title>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Health Status">
              <Text>{profile.healthStatus}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Vaccinated">
              {profile.vaccinated ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Yes
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="default">
                  No
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Sterilized/Neutered">
              {profile.sterilized ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Yes
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="default">
                  No
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Personality & Behavior */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            Personality & Behavior
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Personality:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.personality}
              </Paragraph>
            </div>
            <div>
              <Text strong>Habits:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.habits}
              </Paragraph>
            </div>
            <div>
              <Text strong>Favorite Activities:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.favoriteActivities}
              </Paragraph>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Care Requirements */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            Care Requirements
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Care Instructions:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.careInstructions}
              </Paragraph>
            </div>
            <div>
              <Text strong>Diet:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.diet}
              </Paragraph>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Adoption Details */}
        <div>
          <Title level={5} style={{ marginBottom: '16px' }}>
            Adoption Details
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>Requirements for Adopters:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.adoptionRequirements}
              </Paragraph>
            </div>
            <div>
              <Text strong>Reason for Adoption:</Text>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                {profile.reasonForAdoption}
              </Paragraph>
            </div>
          </Space>
        </div>

        {profile.createdAt && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Profile created on {dayjs(profile.createdAt).format('MMMM D, YYYY')}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};
