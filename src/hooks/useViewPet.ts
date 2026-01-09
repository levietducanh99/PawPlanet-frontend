import { useMemo, useEffect } from 'react';
import { usePetDetail } from './usePetDetail';
import { usePetFollow } from './usePetFollow';
import { useUserProfile } from './useUser';
import { usePetFollowers } from './usePetFollowers';

export const useViewPet = (petId: number | null) => {
  const { pet, pageLoading, error: petError, refetch } = usePetDetail(petId);
  const {
    toggleFollow, 
    followLoading,
    error: followError,
    getOptimisticState
  } = usePetFollow();
  const { user } = useUserProfile();

  // Fetch followers to get accurate count
  const { followers, fetchFollowers } = usePetFollowers();

  // Auto-fetch followers when pet is loaded to get accurate count
  useEffect(() => {
    if (petId && pet && !pageLoading) {
      console.log('🔵 useViewPet: Auto-fetching followers for count');
      fetchFollowers(petId);
    }
  }, [petId, pet, pageLoading, fetchFollowers]);

  // Get optimistic state if exists
  const optimisticState = petId ? getOptimisticState(petId) : null;

  // Computed properties for easier usage in components
  const isOwner = useMemo(() => {
    return pet?.isOwner || (user?.id && pet?.ownerId === user.id);
  }, [pet?.isOwner, pet?.ownerId, user?.id]);

  const canFollow = useMemo(() => {
    return pet?.canFollow && !isOwner;
  }, [pet?.canFollow, isOwner]);

  // Use optimistic state if exists (whether pending or confirmed), otherwise use real state
  const isFollowing = useMemo(() => {
    const result = optimisticState
      ? optimisticState.isFollowing
      : (pet?.isFollowing || false);

    console.log('🔄 isFollowing computed:', {
      petId,
      hasOptimisticState: !!optimisticState,
      optimisticValue: optimisticState?.isFollowing,
      optimisticPending: optimisticState?.isPending,
      petApiValue: pet?.isFollowing,
      finalResult: result
    });

    return result;
  }, [petId, pet?.isFollowing, optimisticState]);

  const isPrivate = useMemo(() => {
    return pet?.status?.toLowerCase() === 'hidden';
  }, [pet?.status]);

  const petStatus = useMemo(() => {
    if (!pet?.status) return 'public';
    return pet.status.toLowerCase() === 'hidden' ? 'private' : 'public';
  }, [pet?.status]);


  // Helper function để handle follow/unfollow với optimistic update
  const handleFollowToggle = async (): Promise<boolean> => {
    if (!petId || !canFollow) return false;

    const success = await toggleFollow(petId, isFollowing);
    
    // Refetch followers to update the count
    if (success && petId) {
      console.log('🔵 useViewPet: Refetching followers after follow toggle');
      fetchFollowers(petId);
    }

    return success;
  };

  console.log('🐕📱 useViewPet: Pet data summary:', {
    petId,
    petName: pet?.name,
    isOwner,
    canFollow,
    isFollowing,
    hasOptimisticState: !!optimisticState,
    optimisticPending: optimisticState?.isPending,
    isPrivate,
    petStatus,
    pageLoading,
    followLoading,
    actualFollowerCount: followers.length
  });

  return {
    // Pet data
    pet,
    pageLoading,      // Only for initial page load
    petError,
    refetch,

    // Follow functionality
    canFollow,
    isFollowing, // This now includes optimistic updates!
    handleFollowToggle,
    followLoading,    // Only for follow/unfollow actions
    followError,

    // Followers data
    followers,
    followerCount: followers.length, // Accurate count from fetched data

    // User context
    user,
    isOwner,

    // Status helpers
    isPrivate,
    petStatus,


    // Combined error
    error: petError || followError,

    // Optimistic state info
    isOptimistic: optimisticState?.isPending || false,
  };
};
