/**
 * Pet Appearance Description Component
 *
 * Reusable component for pet appearance and distinctive signs
 */

import React from 'react';
import { Form, Input, Typography } from 'antd';
import styles from './PetAppearanceForm.module.css';

const { Title } = Typography;
const { TextArea } = Input;

interface PetAppearanceFormProps {
  form?: any;
  initialValues?: any;
  disabled?: boolean;
}

export const PetAppearanceForm: React.FC<PetAppearanceFormProps> = ({
  form,
  initialValues,
  disabled = false
}) => {
  return (
    <div className={styles.appearanceForm}>
      <Title level={4} className={styles.sectionTitle}>
        Appearance and distinctive signs
      </Title>

      <Typography.Paragraph className={styles.description}>
        Describe unique features, colors, patterns, or distinctive marks.
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.form}
      >
        <Form.Item
          name="appearance"
          className={styles.formItem}
        >
          <TextArea
            placeholder="Brown Dark White mix, with light markings about pet's chest and nose..."
            className={styles.textArea}
            rows={4}
            maxLength={500}
            showCount
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="additionalNotes"
          className={styles.formItem}
        >
          <TextArea
            placeholder="Include details about other unique features that may identify your pet."
            className={styles.textArea}
            rows={3}
            maxLength={300}
            showCount
            disabled={disabled}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
