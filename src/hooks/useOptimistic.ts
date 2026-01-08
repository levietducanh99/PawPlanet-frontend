/**
 * Optimistic Update Hook
 *
 * Provides optimistic UI updates for better UX
 */

import { useState, useCallback } from 'react';

export interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
  error?: Error;
}

/**
 * Hook for optimistic updates
 * Updates UI immediately, then syncs with server
 */
export const useOptimistic = <T,>(initialData: T) => {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
  });

  /**
   * Update data optimistically
   * @param optimisticData - Data to show immediately
   * @param asyncFn - Async function to sync with server
   */
  const update = useCallback(
    async (
      optimisticData: T,
      asyncFn: () => Promise<T>
    ): Promise<T> => {
      // Step 1: Update UI immediately (optimistic)
      setState({
        data: optimisticData,
        isOptimistic: true,
      });

      try {
        // Step 2: Sync with server
        const serverData = await asyncFn();

        // Step 3: Update with server response
        setState({
          data: serverData,
          isOptimistic: false,
        });

        return serverData;
      } catch (error) {
        // Step 4: Revert on error
        setState({
          data: initialData,
          isOptimistic: false,
          error: error as Error,
        });

        throw error;
      }
    },
    [initialData]
  );

  /**
   * Set data without optimistic update
   */
  const setData = useCallback((newData: T) => {
    setState({
      data: newData,
      isOptimistic: false,
    });
  }, []);

  /**
   * Reset to initial data
   */
  const reset = useCallback(() => {
    setState({
      data: initialData,
      isOptimistic: false,
    });
  }, [initialData]);

  return {
    data: state.data,
    isOptimistic: state.isOptimistic,
    error: state.error,
    update,
    setData,
    reset,
  };
};

