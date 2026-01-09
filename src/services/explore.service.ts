import { ExploreApi, Configuration } from './api';
import { ExploreResponse, ExploreParams } from '@/domain/explore';
import { mapExploreItems } from '@/mappers/explore.mapper';
import apiClient from './apiConfig';

// Create API configuration with auth
const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || 'https://pawplanet-ae61a47d7179.herokuapp.com',
});

const api = new ExploreApi(apiConfiguration, undefined, apiClient);

/**
 * Explore Service - handles explore feed API calls
 */
export const exploreService = {
  /**
   * Fetch explore feed with mixed content (posts, pets, users)
   */
  async getExploreFeed(params?: ExploreParams): Promise<ExploreResponse> {
    try {
      console.log('🔍 Fetching explore feed with params:', params);

      const response = await api.getExploreFeed({
        limit: params?.limit,
        seed: params?.seed,
        include: params?.include,
      });

      console.log('✅ Explore API response:', response.data);

      // Check if response has data
      if (!response.data) {
        console.warn('⚠️ API returned empty response');
        return { seed: '', items: [] };
      }

      // Map API response to frontend domain models
      const mappedItems = mapExploreItems(response.data.items || []);
      console.log(`✅ Mapped ${mappedItems.length} items from ${response.data.items?.length || 0} raw items`);

      return {
        seed: response.data.seed || '',
        items: mappedItems,
      };
    } catch (error: any) {
      console.error('❌ Explore feed API error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Provide more helpful error messages
      if (error.response?.status === 401) {
        throw new Error('Please login to view explore feed');
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this content');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later');
      }

      throw new Error('Failed to load explore feed. Please try again');
    }
  },
};

