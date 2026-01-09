/**
 * Refresh Token Test Component
 *
 * Component này dùng để test automatic refresh token functionality
 * Nó giả lập các scenario:
 * 1. Token expired - single request
 * 2. Token expired - multiple concurrent requests
 * 3. Refresh token failed
 */

import React, { useState } from 'react';
import { Button, Card, Space, Typography, Alert, Spin } from 'antd';
import {
  ReloadOutlined,
  ThunderboltOutlined,
  StopOutlined
} from '@ant-design/icons';
import { apiClient } from '@/services/apiConfig';

const { Title, Paragraph, Text } = Typography;

interface TestResult {
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export const RefreshTokenTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (type: TestResult['type'], message: string) => {
    setResults(prev => [{
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 10)); // Keep last 10 results
  };

  /**
   * Test 1: Single request với expired token
   */
  const testSingleRequest = async () => {
    setLoading(true);
    addResult('info', '🧪 Test 1: Single request với expired token');

    try {
      // Giả sử token đã expired, backend sẽ trả về 401
      // Interceptor sẽ tự động refresh và retry
      const response = await apiClient.get('/api/v1/user/profile');

      addResult('success', `✅ Success: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult('error', `❌ Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Test 2: Multiple concurrent requests với expired token
   */
  const testMultipleRequests = async () => {
    setLoading(true);
    addResult('info', '🧪 Test 2: Multiple concurrent requests');

    try {
      // Gửi 5 requests cùng lúc
      const requests = [
        apiClient.get('/api/v1/user/profile'),
        apiClient.get('/api/v1/pets/my-pets'),
        apiClient.get('/api/v1/posts/my-posts'),
        apiClient.get('/api/v1/user/profile'),
        apiClient.get('/api/v1/pets/my-pets'),
      ];

      const results = await Promise.allSettled(requests);

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failCount = results.filter(r => r.status === 'rejected').length;

      addResult('success', `✅ Completed: ${successCount} success, ${failCount} failed`);
      addResult('info', `📊 Expected: Only 1 refresh token call for all requests`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult('error', `❌ Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Test 3: Force token to be invalid
   */
  const testInvalidToken = async () => {
    setLoading(true);
    addResult('info', '🧪 Test 3: Invalid token');

    try {
      // Set invalid token
      const originalToken = localStorage.getItem('authToken');
      localStorage.setItem('authToken', 'invalid-token-12345');

      addResult('info', '🔧 Set invalid token');

      // Try to make request
      await apiClient.get('/api/v1/user/profile');

      // Restore original token
      if (originalToken) {
        localStorage.setItem('authToken', originalToken);
      }

      addResult('success', '✅ Request succeeded after refresh');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addResult('error', `❌ Failed: ${errorMessage}`);
      addResult('info', '💡 Expected: Redirect to login page');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check current token info
   */
  const checkTokenInfo = () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      addResult('error', '❌ No token found');
      return;
    }

    try {
      // Decode JWT (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = new Date(payload.exp * 1000);
      const now = new Date();
      const remainingMs = expiresAt.getTime() - now.getTime();
      const remainingMinutes = Math.floor(remainingMs / 60000);

      if (remainingMs > 0) {
        addResult('success', `✅ Token valid for ${remainingMinutes} more minutes`);
        addResult('info', `📅 Expires at: ${expiresAt.toLocaleString()}`);
      } else {
        addResult('error', '❌ Token already expired');
      }
    } catch (error) {
      addResult('error', '❌ Failed to decode token');
    }
  };

  /**
   * Clear all results
   */
  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <Title level={2}>🔄 Refresh Token Integration Test</Title>
        <Paragraph>
          Component này test automatic token refresh functionality trong <Text code>apiConfig.ts</Text>
        </Paragraph>

        <Alert
          message="How it works"
          description={
            <ul style={{ marginBottom: 0 }}>
              <li>Khi token expire, API trả về 401 error</li>
              <li>Axios interceptor tự động gọi /api/v1/auth/refresh</li>
              <li>Nhận token mới và retry request ban đầu</li>
              <li>Multiple requests được queue trong lúc refresh</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Test Controls */}
          <Card title="Test Controls" type="inner">
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={testSingleRequest}
                loading={loading}
                type="primary"
              >
                Test Single Request
              </Button>

              <Button
                icon={<ThunderboltOutlined />}
                onClick={testMultipleRequests}
                loading={loading}
                type="primary"
              >
                Test Multiple Requests
              </Button>

              <Button
                icon={<StopOutlined />}
                onClick={testInvalidToken}
                loading={loading}
                danger
              >
                Test Invalid Token
              </Button>

              <Button onClick={checkTokenInfo}>
                Check Token Info
              </Button>

              <Button onClick={clearResults}>
                Clear Results
              </Button>
            </Space>
          </Card>

          {/* Test Results */}
          <Card title="Test Results" type="inner">
            {loading && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: 16 }}>
                  Running test... Check console for detailed logs
                </Paragraph>
              </div>
            )}

            {results.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Paragraph type="secondary">
                  No results yet. Click a test button above.
                </Paragraph>
              </div>
            )}

            {results.map((result, index) => (
              <Alert
                key={index}
                message={
                  <Space>
                    <Text type="secondary">[{result.timestamp}]</Text>
                    <Text>{result.message}</Text>
                  </Space>
                }
                type={result.type}
                showIcon
                style={{ marginBottom: 8 }}
              />
            ))}
          </Card>

          {/* Instructions */}
          <Card title="📖 How to Test" type="inner">
            <Paragraph>
              <strong>Before Testing:</strong>
            </Paragraph>
            <ol>
              <li>Make sure you're logged in</li>
              <li>Open browser DevTools Console tab</li>
              <li>Watch for console logs during tests</li>
            </ol>

            <Paragraph style={{ marginTop: 16 }}>
              <strong>Expected Console Logs:</strong>
            </Paragraph>
            <pre style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 8,
              overflow: 'auto'
            }}>
{`📤 API Request: GET /api/v1/user/profile - Token attached
🔒 401 Unauthorized - Token may be expired
🔄 Calling refresh token API...
✅ Token refreshed successfully
🔄 Retrying original request with new token
📤 API Request: GET /api/v1/user/profile - Token attached`}
            </pre>

            <Paragraph style={{ marginTop: 16 }}>
              <strong>For Multiple Requests Test:</strong>
            </Paragraph>
            <pre style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 8,
              overflow: 'auto'
            }}>
{`🔒 401 Unauthorized - Token may be expired
🔄 Calling refresh token API...
⏳ Token refresh in progress - queueing request
⏳ Token refresh in progress - queueing request
⏳ Token refresh in progress - queueing request
✅ Token refreshed successfully
🔄 Retrying original request with new token`}
            </pre>
          </Card>

          {/* Debug Info */}
          <Card title="🔍 Debug Info" type="inner">
            <Space direction="vertical">
              <Text>
                <strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://pawplanet-ae61a47d7179.herokuapp.com'}
              </Text>
              <Text>
                <strong>Token Location:</strong> {
                  localStorage.getItem('authToken') ? 'localStorage' :
                  sessionStorage.getItem('authToken') ? 'sessionStorage' :
                  'Not found'
                }
              </Text>
              <Text>
                <strong>Refresh Endpoint:</strong> /api/v1/auth/refresh
              </Text>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default RefreshTokenTest;

