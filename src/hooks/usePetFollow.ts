import { useState, useCallback } from 'react';
import { followPet, unfollowPet } from '@/services/pet.service';

interface OptimisticFollowState {
  petId: number;
  isFollowing: boolean;
  isPending: boolean;
}

export const usePetFollow = () => {
  const [followLoading, setFollowLoading] = useState(false); // Separate loading for follow actions
  const [error, setError] = useState<string | null>(null);
  const [optimisticStates, setOptimisticStates] = useState<Map<number, OptimisticFollowState>>(new Map());

  /**
   * Get optimistic follow state for a pet
   */
  const getOptimisticState = useCallback((petId: number) => {
    return optimisticStates.get(petId);
  }, [optimisticStates]);

  /**
   * Follow pet with optimistic update
   */
  const followPetAction = useCallback(async (petId: number): Promise<boolean> => {
    // Optimistic update - immediately show as following
    setOptimisticStates(prev => {
      const newMap = new Map(prev);
      newMap.set(petId, { petId, isFollowing: true, isPending: true });
      return newMap;
    });

    setFollowLoading(true);
    setError(null);

    try {
      console.log('🔔 usePetFollow: Following pet ID:', petId);
      await followPet(petId);
      console.log('🔔 usePetFollow: Successfully followed pet');
      
      // Confirm optimistic update
      setOptimisticStates(prev => {
        const newMap = new Map(prev);
        newMap.set(petId, { petId, isFollowing: true, isPending: false });
        return newMap;
      });
      
      return true;
    } catch (err) {
      console.error('🔔 usePetFollow: Follow error:', err);
      
      // Rollback optimistic update on error
      setOptimisticStates(prev => {
        const newMap = new Map(prev);
        newMap.set(petId, { petId, isFollowing: false, isPending: false });
        return newMap;
      });
      
      setError(err instanceof Error ? err.message : 'Failed to follow pet');
      return false;
    } finally {
      setFollowLoading(false);
    }
  }, []);

  /**
   * Unfollow pet with optimistic update
   */
  const unfollowPetAction = useCallback(async (petId: number): Promise<boolean> => {
    // Optimistic update - immediately show as not following
    setOptimisticStates(prev => {
      const newMap = new Map(prev);
      newMap.set(petId, { petId, isFollowing: false, isPending: true });
      return newMap;
    });

    setFollowLoading(true);
    setError(null);

    try {
      console.log('🔕 usePetFollow: Unfollowing pet ID:', petId);
      await unfollowPet(petId);
      console.log('🔕 usePetFollow: Successfully unfollowed pet');
      
      // Confirm optimistic update
      setOptimisticStates(prev => {
        const newMap = new Map(prev);
        newMap.set(petId, { petId, isFollowing: false, isPending: false });
        return newMap;
      });
      
      return true;
    } catch (err) {
      console.error('🔕 usePetFollow: Unfollow error:', err);
      
      // Rollback optimistic update on error
      setOptimisticStates(prev => {
        const newMap = new Map(prev);
        newMap.set(petId, { petId, isFollowing: true, isPending: false });
        return newMap;
      });
      
      setError(err instanceof Error ? err.message : 'Failed to unfollow pet');
      return false;
    } finally {
      setFollowLoading(false);
    }
  }, []);

  /**
   * Toggle follow with optimistic update
   */
  const toggleFollow = useCallback(async (
    petId: number, 
    isCurrentlyFollowing: boolean
  ): Promise<boolean> => {
    if (isCurrentlyFollowing) {
      return await unfollowPetAction(petId);
    } else {
      return await followPetAction(petId);
    }
  }, [followPetAction, unfollowPetAction]);

  /**
   * Clear optimistic state for a pet (after refetch)
   */
  const clearOptimisticState = useCallback((petId: number) => {
    setOptimisticStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(petId);
      return newMap;
    });
  }, []);

  console.log('🔔 usePetFollow: Current state - followLoading:', followLoading, 'error:', error);

  return {
    followPet: followPetAction,
    unfollowPet: unfollowPetAction,
    toggleFollow,
    getOptimisticState,
    clearOptimisticState,
    followLoading,
    error
  };
};
