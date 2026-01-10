/**
 * Timezone Debug Component
 *
 * Add this component to any page to debug timezone issues
 * Usage: <TimezoneDebug />
 */

import React, { useState } from 'react';
import { Card, Typography, Space, Button, Input, Divider } from 'antd';
import {
  toVietnamTime,
  formatTimeAgo,
  formatTimeAgoShort,
  formatDateTime,
  formatDateShort,
  formatDate,
  VIETNAM_TIMEZONE
} from '@/utils/dateUtils';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export const TimezoneDebug: React.FC = () => {
  const [testTimestamp, setTestTimestamp] = useState<string>('');

  const generateTestCases = () => {
    const now = dayjs.utc();
    return {
      'Vừa xong (5 giây trước)': now.subtract(5, 'second').toISOString(),
      '1 phút trước': now.subtract(1, 'minute').toISOString(),
      '30 phút trước': now.subtract(30, 'minute').toISOString(),
      '1 giờ trước': now.subtract(1, 'hour').toISOString(),
      '2 giờ trước': now.subtract(2, 'hour').toISOString(),
      '7 giờ trước (Potential bug)': now.subtract(7, 'hour').toISOString(),
      '1 ngày trước': now.subtract(1, 'day').toISOString(),
      '3 ngày trước': now.subtract(3, 'day').toISOString(),
      '1 tuần trước': now.subtract(1, 'week').toISOString(),
      '1 tháng trước': now.subtract(1, 'month').toISOString(),
    };
  };

  const testCases = generateTestCases();

  const renderTimeInfo = (timestamp: string) => {
    try {
      const utcTime = dayjs.utc(timestamp);
      const vnTime = toVietnamTime(timestamp);
      const nowUTC = dayjs.utc();
      const nowVN = dayjs().tz(VIETNAM_TIMEZONE);

      return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Text strong>Input (Server GMT):</Text>
            <br />
            <Text code>{timestamp}</Text>
            <br />
            <Text type="secondary">{utcTime.format('YYYY-MM-DD HH:mm:ss')} UTC</Text>
          </div>

          <div>
            <Text strong>Converted to Vietnam (GMT+7):</Text>
            <br />
            <Text code>{vnTime.format('YYYY-MM-DD HH:mm:ss')}</Text>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong>Current Time:</Text>
            <br />
            <Text type="secondary">UTC: {nowUTC.format('HH:mm:ss')}</Text>
            <br />
            <Text type="secondary">VN: {nowVN.format('HH:mm:ss')}</Text>
          </div>

          <div>
            <Text strong>Time Difference:</Text>
            <br />
            <Text>Minutes: {nowVN.diff(vnTime, 'minute')}</Text>
            <br />
            <Text>Hours: {nowVN.diff(vnTime, 'hour')}</Text>
            <br />
            <Text>Days: {nowVN.diff(vnTime, 'day')}</Text>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '8px' }}>
            <Text strong>Formatted Outputs:</Text>
            <br />
            <Text>formatTimeAgo: <Text code>{formatTimeAgo(timestamp)}</Text></Text>
            <br />
            <Text>formatTimeAgoShort: <Text code>{formatTimeAgoShort(timestamp)}</Text></Text>
            <br />
            <Text>formatDateTime: <Text code>{formatDateTime(timestamp)}</Text></Text>
            <br />
            <Text>formatDateShort: <Text code>{formatDateShort(timestamp)}</Text></Text>
            <br />
            <Text>formatDate: <Text code>{formatDate(timestamp)}</Text></Text>
          </div>
        </Space>
      );
    } catch (error) {
      return <Text type="danger">Invalid timestamp format</Text>;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>🕐 Timezone Debug Tool</Title>
      <Paragraph>
        Test timezone conversion from GMT to Vietnam (GMT+7)
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Current Time Display */}
        <Card title="⏰ Current Time" size="small">
          <Space direction="vertical">
            <Text>
              <Text strong>Browser:</Text> {new Date().toLocaleString()}
            </Text>
            <Text>
              <Text strong>UTC:</Text> {dayjs.utc().format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <Text>
              <Text strong>Vietnam:</Text> {dayjs().tz(VIETNAM_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
            <Text>
              <Text strong>Timezone:</Text> {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </Text>
          </Space>
        </Card>

        {/* Custom Test */}
        <Card title="🧪 Custom Test" size="small">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Enter ISO timestamp (e.g., 2024-01-10T10:00:00Z)"
              value={testTimestamp}
              onChange={(e) => setTestTimestamp(e.target.value)}
            />
            <Button type="primary" onClick={() => setTestTimestamp(dayjs.utc().toISOString())}>
              Use Now (UTC)
            </Button>
          </Space.Compact>
          {testTimestamp && (
            <div style={{ marginTop: '16px' }}>
              {renderTimeInfo(testTimestamp)}
            </div>
          )}
        </Card>

        {/* Pre-defined Test Cases */}
        <Card title="📋 Test Cases" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {Object.entries(testCases).map(([label, timestamp]) => (
              <Card
                key={label}
                type="inner"
                title={label}
                size="small"
                extra={
                  <Button size="small" onClick={() => setTestTimestamp(timestamp)}>
                    Test
                  </Button>
                }
              >
                {renderTimeInfo(timestamp)}
              </Card>
            ))}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default TimezoneDebug;

