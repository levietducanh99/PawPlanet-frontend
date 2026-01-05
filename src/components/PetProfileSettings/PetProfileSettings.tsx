/**
 * Pet Profile Settings Component
 *
 * Reusable component for pet profile visibility and adoption settings
 */

import React from 'react';
import { Form, Switch, Typography, Row, Col } from 'antd';
import styles from './PetProfileSettings.module.css';

const { Title, Text } = Typography;

interface PetProfileSettingsProps {
  form?: any;
  initialValues?: any;
  disabled?: boolean;
  onChange?: (field: string, value: boolean) => void;
}

export const PetProfileSettings: React.FC<PetProfileSettingsProps> = ({
  form,
  initialValues,
  disabled = false,
  onChange
}) => {
  const handleSwitchChange = (field: string) => (checked: boolean) => {
    onChange?.(field, checked);
  };

  return (
    <div className={styles.settingsForm}>
      <Title level={4} className={styles.sectionTitle}>
        Profile Settings
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.form}
      >
        <div className={styles.settingItem}>
          <Row align="middle" justify="space-between">
            <Col flex="1">
              <div className={styles.settingInfo}>
                <Text strong className={styles.settingTitle}>
                  Profile Visibility
                </Text>
                <Text type="secondary" className={styles.settingDescription}>
                  Make everyone can view
                </Text>
              </div>
            </Col>
            <Col>
              <Form.Item
                name="profileVisibility"
                valuePropName="checked"
                className={styles.switchItem}
              >
                <Switch
                  disabled={disabled}
                  onChange={handleSwitchChange('profileVisibility')}
                  className={styles.switch}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className={styles.settingItem}>
          <Row align="middle" justify="space-between">
            <Col flex="1">
              <div className={styles.settingInfo}>
                <Text strong className={styles.settingTitle}>
                  Looking for Adoption
                </Text>
                <Text type="secondary" className={styles.settingDescription}>
                  Yes - Available for adoption
                </Text>
              </div>
            </Col>
            <Col>
              <Form.Item
                name="lookingForAdoption"
                valuePropName="checked"
                className={styles.switchItem}
              >
                <Switch
                  disabled={disabled}
                  onChange={handleSwitchChange('lookingForAdoption')}
                  className={styles.switch}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};
