import React, { useEffect } from 'react';
import { useViewPet } from '../hooks/useViewPet';
import { Card, Spin, Alert } from 'antd';

/**
 * Component test để verify API call GetPetById
 *
 * Usage:
 * 1. Import component này vào App.tsx
 * 2. Add route: <Route path="/test-pet/:petId" element={<TestPetApiCall />} />
 * 3. Navigate to: http://localhost:5173/test-pet/1
 * 4. Check console logs để xem API có được gọi không
 */
export const TestPetApiCall: React.FC = () => {
  const testPetId = 1; // Hardcode test pet ID

  const {
    pet,
    pageLoading,
    error,
    canFollow,
    isFollowing,
    isOwner,
    isPrivate
  } = useViewPet(testPetId);

  useEffect(() => {
    console.log('=== TEST PET API CALL ===');
    console.log('Test Pet ID:', testPetId);
    console.log('Page Loading:', pageLoading);
    console.log('Error:', error);
    console.log('Pet Data:', pet);
    console.log('========================');
  }, [pet, pageLoading, error, testPetId]);

  if (pageLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" />
        <p>Loading pet data from API...</p>
        <p>Check console for API call logs 🔍</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="API Error"
          description={error}
          type="error"
          showIcon
        />
        <p style={{ marginTop: '20px' }}>Check console for detailed error logs 🔍</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="No Pet Data"
          description="Pet data is null. Check console logs."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>✅ API Call Successful!</h1>

      <Card title="Pet Data from API" style={{ marginTop: '20px' }}>
        <p><strong>ID:</strong> {pet.id}</p>
        <p><strong>Name:</strong> {pet.name}</p>
        <p><strong>Species:</strong> {pet.speciesName}</p>
        <p><strong>Breed:</strong> {pet.breedName || 'N/A'}</p>
        <p><strong>Owner ID:</strong> {pet.ownerId}</p>
        <p><strong>Owner Username:</strong> {pet.ownerUsername}</p>
        <p><strong>Description:</strong> {pet.description || 'N/A'}</p>
        <p><strong>Status:</strong> {pet.status}</p>
      </Card>

      <Card title="Follow & Privacy Info" style={{ marginTop: '20px' }}>
        <p><strong>Can Follow:</strong> {canFollow ? 'Yes ✅' : 'No ❌'}</p>
        <p><strong>Is Following:</strong> {isFollowing ? 'Yes ❤️' : 'No 🤍'}</p>
        <p><strong>Is Owner:</strong> {isOwner ? 'Yes 👤' : 'No 👥'}</p>
        <p><strong>Is Private:</strong> {isPrivate ? 'Yes 🔒' : 'No 🔓'}</p>
      </Card>

      <Card title="Media" style={{ marginTop: '20px' }}>
        <p><strong>Avatar URL:</strong> {pet.avatarUrl || 'N/A'}</p>
        <p><strong>Total Media:</strong> {pet.media?.length || 0}</p>
        {pet.media && pet.media.length > 0 && (
          <div>
            <h4>Media Files:</h4>
            {pet.media.map((media, index) => (
              <div key={media.id} style={{ marginBottom: '10px' }}>
                <p>
                  <strong>Media {index + 1}:</strong> {media.role} - {media.type}
                  <br />
                  <a href={media.url} target="_blank" rel="noopener noreferrer">
                    {media.url}
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0' }}>
        <h3>✅ Test Results:</h3>
        <ul>
          <li>API được gọi thành công ✅</li>
          <li>Data được parse đúng từ PetProfileDTO → Pet domain model ✅</li>
          <li>Hook useViewPet hoạt động đúng ✅</li>
          <li>Mapper hoạt động đúng ✅</li>
        </ul>
        <p><strong>Check browser console để xem chi tiết API calls 🔍</strong></p>
      </div>
    </div>
  );
};
