/**
 * Debug component for testing Pet Creation and Database Issues
 * This helps debug the pet_media_pkey constraint violation
 */

import React, { useState } from 'react';
import { Card, Button, Space, Typography, message } from 'antd';
import { petService } from '@/services/pet.service';
import type { CreatePetData } from '@/services/pet.service';

const {Text, Paragraph } = Typography;

export const PetCreationDebugComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testData] = useState<CreatePetData>({
    name: 'Test Pet ' + Date.now(),
    speciesId: 1,
    breedId: 1,
    birthDate: '2023-01-01',
    gender: 'MALE',
    description: 'Test pet for debugging',
    weight: 5.5,
    height: 30,
    status: 'ACTIVE'
  });

  const testCreatePet = async () => {
    setLoading(true);
    try {
      console.log('🐾 Testing pet creation with data:', testData);

      const result = await petService.createPet(testData);
      console.log('✅ Pet created successfully:', result);

      message.success('Pet created successfully!');
    } catch (error: any) {
      console.error('❌ Pet creation failed:', error.message);

      // Test the Ant Design message with proper context
      if (error.message.includes('Media upload conflict')) {
        message.error('Media upload conflict detected - this is the user-friendly error message');
      } else if (error.message.includes('constraint')) {
        message.warning('Database constraint violation detected');
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const testAntDMessage = () => {
    // Test all Ant Design message types to ensure App context works
    message.info('Testing info message');
    message.success('Testing success message');
    message.warning('Testing warning message');
    message.error('Testing error message');
    console.log('📝 Ant Design message test completed - check for warnings in console');
  };

  const simulateConstraintError = async () => {
    setLoading(true);
    try {
      // Try to create pet with same data multiple times to trigger constraint
      console.log('🔄 Attempting to create duplicate pet to trigger constraint...');

      await petService.createPet({
        ...testData,
        name: 'Duplicate Test Pet'
      });

      message.success('First pet created');

      // Try again with same data - this should trigger constraint
      await petService.createPet({
        ...testData,
        name: 'Duplicate Test Pet'
      });

    } catch (error: any) {
      console.log('✅ Constraint error triggered as expected:', error.message);
      message.warning('Constraint error handled: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="🐾 Pet Creation Debug Panel"
      style={{ margin: 20, maxWidth: 700 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">

        {/* Test Data Display */}
        <div>
          <Text strong>Test Pet Data:</Text>
          <Paragraph>
            <pre style={{ fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
              {JSON.stringify(testData, null, 2)}
            </pre>
          </Paragraph>
        </div>

        {/* Database Error Info */}
        <div>
          <Text strong>Expected Database Error:</Text>
          <Paragraph>
            <Text type="danger">
              duplicate key value violates unique constraint "pet_media_pkey"
            </Text>
            <br />
            <Text type="secondary">
              This happens when backend tries to insert media record with existing ID
            </Text>
          </Paragraph>
        </div>

        {/* Action Buttons */}
        <Space wrap>
          <Button
            type="primary"
            onClick={testCreatePet}
            loading={loading}
          >
            Test Create Pet
          </Button>

          <Button
            onClick={testAntDMessage}
            type="dashed"
          >
            Test Ant Design Messages
          </Button>

          <Button
            onClick={simulateConstraintError}
            loading={loading}
            danger
          >
            Simulate Constraint Error
          </Button>
        </Space>

        {/* Instructions */}
        <div>
          <Text strong>Instructions:</Text>
          <Paragraph>
            <div>1. Open browser console to see detailed logs</div>
            <div>2. Click "Test Create Pet" to attempt pet creation</div>
            <div>3. Check for database constraint errors in console</div>
            <div>4. Test Ant Design messages to ensure App context works</div>
            <div>5. Monitor network requests in DevTools</div>
          </Paragraph>
        </div>

        {/* Expected Results */}
        <div>
          <Text strong>Expected Results:</Text>
          <Paragraph>
            <div>✅ <Text type="success">No Ant Design static message warnings</Text></div>
            <div>✅ <Text type="success">User-friendly error messages for DB constraints</Text></div>
            <div>✅ <Text type="success">Proper error logging with STATUS and BACKEND MESSAGE</Text></div>
            <div>❌ <Text type="danger">pet_media_pkey constraint violation handled gracefully</Text></div>
          </Paragraph>
        </div>

      </Space>
    </Card>
  );
};
