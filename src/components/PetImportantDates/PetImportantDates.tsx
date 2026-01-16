/**
 * Pet Important Dates Component
 *
 * Reusable component for managing pet important dates
 */

import React from 'react';
import { Form, DatePicker, Row, Col, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './PetImportantDates.module.css';

const { Title } = Typography;

interface PetImportantDatesProps {
  form?: any;
  initialValues?: any;
  disabled?: boolean;
}

export const PetImportantDates: React.FC<PetImportantDatesProps> = ({
  form,
  initialValues,
  disabled = false
}) => {
  return (
    <div className={styles.datesForm}>
      <Title level={4} className={styles.sectionTitle}>
        Date of Birth
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.form}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label={
                <span className={styles.labelWithIcon}>
                  <CalendarOutlined className={styles.icon} />
                  Date of Birth
                </span>
              }
              name="birthDate"
              className={styles.formItem}
            >
              <DatePicker
                className={styles.datePicker}
                placeholder="Select birth date"
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
