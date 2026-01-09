/**
 * Debug component to test Following Pets API
 * Open browser console to see logs
 */
import React, { useEffect } from 'react';
import { Button, Card } from 'antd';
import { useFollowingPets } from '@/hooks';

export const DebugFollowingPets: React.FC = () => {
  const userId = 1; // Change this to your user ID
  const { pets, loading, error } = useFollowingPets(userId);

  useEffect(() => {
    console.log('=== DEBUG: Following Pets State ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Pets count:', pets.length);
    console.log('All pets data:', pets);
  }, [pets, loading, error]);

  return (
    <Card title="Debug Following Pets" style={{ margin: 20 }}>
      <div>
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Pets Count:</strong> {pets.length}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Pets Data:</h3>
        <pre style={{ background: '#f5f5f5', padding: 10, overflow: 'auto' }}>
          {JSON.stringify(pets, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: 20 }}>
        <Button onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>

      <div style={{ marginTop: 20, padding: 10, background: '#fff3cd' }}>
        <strong>Check Browser Console for detailed logs!</strong>
      </div>
    </Card>
  );
};

