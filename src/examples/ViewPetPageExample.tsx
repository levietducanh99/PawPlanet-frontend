// Example usage trong ViewPetPage component

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Alert } from 'antd';
import { useViewPet } from '@/hooks';

export const ViewPetPageExample: React.FC = () => {
  const petId = 1; // Example pet ID
  const navigate = useNavigate();

  const {
    pet,
    pageLoading,
    error,
    canFollow,
    isFollowing,
    handleFollowToggle,
    followLoading,
    isOwner,
    isPrivate,
    petStatus
  } = useViewPet(petId);

  const handleEdit = () => {
    navigate(`/edit-pet/${petId}`);
  };

  if (pageLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  if (!pet) {
    return <Alert message="Pet not found" type="warning" />;
  }

  return (
    <div>
      {/* Pet Header */}
      <div>
        <h1>{pet.name}</h1>
        <p>Species: {pet.speciesName}</p>
        <p>Breed: {pet.breedName}</p>
        <p>Owner: {pet.ownerUsername}</p>
        <p>Status: {petStatus === 'private' ? 'Private' : 'Public'}</p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 16, gap: 8, display: 'flex' }}>
        {/* Follow Button - only show if canFollow */}
        {canFollow && (
          <Button
            type={isFollowing ? 'default' : 'primary'}
            loading={followLoading}
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}

        {/* Edit Button - only show if owner */}
        {isOwner && (
          <Button onClick={handleEdit}>
            Edit Pet
          </Button>
        )}
      </div>

      {/* Pet Content */}
      <div style={{ marginTop: 24 }}>
        {isPrivate && !isOwner ? (
          <Alert message="This pet's profile is private" type="info" />
        ) : (
          <div>
            {/* Pet media gallery */}
            {pet.media && pet.media.length > 0 && (
              <div>
                <h3>Photos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {pet.media.map((media, index) => (
                    <img
                      key={index}
                      src={media.url}
                      alt={`${pet.name} photo`}
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pet description */}
            {pet.description && (
              <div style={{ marginTop: 16 }}>
                <h3>About {pet.name}</h3>
                <p>{pet.description}</p>
              </div>
            )}

            {/* Pet details */}
            <div style={{ marginTop: 16 }}>
              <h3>Details</h3>
              <p>Birth Date: {pet.birthDate}</p>
              <p>Gender: {pet.gender}</p>
              {pet.weight && <p>Weight: {pet.weight} kg</p>}
              {pet.height && <p>Height: {pet.height} cm</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
