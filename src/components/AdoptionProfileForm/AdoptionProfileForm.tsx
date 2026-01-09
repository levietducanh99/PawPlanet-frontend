/**
 * AdoptionProfileForm Component
 * 
 * Form for creating adoption profile (owner only).
 * Displays all required fields for adoption profile creation.
 */

import React from 'react';
import { Form, Input, Switch, Button, Space, Typography, Divider, Row, Col } from 'antd';
import { HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { CreateAdoptionProfileRequest } from '@/domain/adoption';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AdoptionProfileFormProps {
  onSubmit: (values: CreateAdoptionProfileRequest) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export const AdoptionProfileForm: React.FC<AdoptionProfileFormProps> = ({
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: CreateAdoptionProfileRequest) => {
    await onSubmit(values);
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#E6F7FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <HeartOutlined style={{ fontSize: '32px', color: '#1890FF' }} />
        </div>
        <Title level={3} style={{ marginBottom: '8px' }}>
          Create Adoption Profile
        </Title>
        <Text type="secondary">
          Provide detailed information to help find the perfect home for your pet
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          vaccinated: false,
          sterilized: false,
        }}
      >
        <Divider titlePlacement="left">Health Information</Divider>

        <Form.Item
          name="healthStatus"
          label="Health Status"
          rules={[{ required: true, message: 'Please describe the health status' }]}
        >
          <Input
            placeholder="e.g., Excellent health, no known issues"
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="vaccinated" label="Vaccinated" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="sterilized" label="Sterilized/Neutered" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Col>
        </Row>

        <Divider titlePlacement="left">Personality & Behavior</Divider>

        <Form.Item
          name="personality"
          label="Personality"
          rules={[{ required: true, message: 'Please describe the personality' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Friendly, playful, loves attention..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Form.Item
          name="habits"
          label="Habits"
          rules={[{ required: true, message: 'Please describe the habits' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Sleeps a lot, active in the morning..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Form.Item
          name="favoriteActivities"
          label="Favorite Activities"
          rules={[{ required: true, message: 'Please list favorite activities' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Playing fetch, going for walks..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Divider titlePlacement="left">Care Requirements</Divider>

        <Form.Item
          name="careInstructions"
          label="Care Instructions"
          rules={[{ required: true, message: 'Please provide care instructions' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Needs daily exercise, regular grooming..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Form.Item
          name="diet"
          label="Diet"
          rules={[{ required: true, message: 'Please describe the diet' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Dry food twice daily, no chicken..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Divider titlePlacement="left">Adoption Details</Divider>

        <Form.Item
          name="adoptionRequirements"
          label="Adoption Requirements"
          rules={[{ required: true, message: 'Please specify adoption requirements' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Must have a yard, experience with dogs preferred..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Form.Item
          name="reasonForAdoption"
          label="Reason for Adoption"
          rules={[{ required: true, message: 'Please explain the reason for adoption' }]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., Moving abroad, cannot keep pet..."
            style={{ borderRadius: '12px' }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'center' }} size="middle">
            {onCancel && (
              <Button
                size="large"
                onClick={onCancel}
                style={{ borderRadius: '8px', minWidth: '120px' }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<CheckCircleOutlined />}
              style={{ borderRadius: '8px', minWidth: '160px' }}
            >
              Create Profile
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
