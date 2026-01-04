/**
 * Pet Basic Information Form Component
 *
 * Reusable form component for pet basic info
 */

import React from 'react';
import { Form, Input, Select, Row, Col, Typography } from 'antd';
import styles from './PetBasicForm.module.css';

const { Title } = Typography;
const { Option } = Select;

interface PetBasicFormProps {
  form?: any;
  initialValues?: any;
  disabled?: boolean;
}

export const PetBasicForm: React.FC<PetBasicFormProps> = ({
  form,
  initialValues,
  disabled = false
}) => {
  return (
    <div className={styles.basicForm}>
      <Title level={4} className={styles.sectionTitle}>
        Basic Information
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.form}
      >
        <Form.Item
          label="Pet Name"
          name="petName"
          rules={[
            { required: true, message: 'Please enter pet name!' },
            { min: 2, message: 'Pet name must be at least 2 characters' }
          ]}
          className={styles.formItem}
        >
          <Input
            placeholder="Enter pet name"
            className={styles.input}
            disabled={disabled}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Species"
              name="species"
              rules={[{ required: true, message: 'Please select species!' }]}
              className={styles.formItem}
            >
              <Select
                placeholder="Select species"
                className={styles.select}
                disabled={disabled}
              >
                <Option value="dog">Dog</Option>
                <Option value="cat">Cat</Option>
                <Option value="bird">Bird</Option>
                <Option value="rabbit">Rabbit</Option>
                <Option value="fish">Fish</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Breed"
              name="breed"
              className={styles.formItem}
            >
              <Input
                placeholder="e.g. Border Collie"
                className={styles.input}
                disabled={disabled}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Gender"
              name="gender"
              className={styles.formItem}
            >
              <Select
                placeholder="Select gender"
                className={styles.select}
                disabled={disabled}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Size"
              name="size"
              className={styles.formItem}
            >
              <Select
                placeholder="Select size"
                className={styles.select}
                disabled={disabled}
              >
                <Option value="small">Small</Option>
                <Option value="medium">Medium</Option>
                <Option value="large">Large</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Weight (kg)"
              name="weight"
              className={styles.formItem}
            >
              <Input
                placeholder="e.g. 25.2"
                type="number"
                step="0.1"
                className={styles.input}
                disabled={disabled}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Height (cm)"
              name="height"
              className={styles.formItem}
            >
              <Input
                placeholder="e.g. 60"
                type="number"
                className={styles.input}
                disabled={disabled}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
