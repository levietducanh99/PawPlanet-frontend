/**
 * Search service - adapter boundary for global search API
 */

import { GlobalSearchApi } from '@/services/api/api';
import { apiClient } from '@/services/apiConfig';
import type { GlobalSearchResult, SearchType } from '@/domain/search';
import { mapGlobalSearchResult } from '@/mappers/search.mapper';

class SearchService {
  private searchApi: GlobalSearchApi;

  constructor() {
    this.searchApi = new GlobalSearchApi(undefined, undefined, apiClient);
  }

  /**
   * Global search for users and pets
   * @param query - Search keyword (minimum 2 characters)
   * @param type - Type to search: 'user', 'pet', or 'all'
   * @param limit - Maximum results per type (default: 10)
   */
  async globalSearch(
    query: string,
    type: SearchType = 'all',
    limit: number = 10
  ): Promise<GlobalSearchResult> {
    try {
      if (query.length < 2) {
        return { users: [], pets: [] };
      }

      const types = type === 'all' ? undefined : type;

      const response = await this.searchApi.search({
        q: query,
        types,
        limit
      });

      return mapGlobalSearchResult(response.data);
    } catch (error: unknown) {
      console.error('Global search failed:', error);
      return { users: [], pets: [] };
    }
  }
}

export const searchService = new SearchService();

