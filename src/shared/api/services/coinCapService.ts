import { coinCapApi } from '../config';
import type { CryptoAsset, CoinCapResponse, CoinCapSingleResponse } from '../types';

export class CoinCapService {
  /**
   * Get list of cryptocurrency assets
   */
  static async getAssets(params?: {
    search?: string;
    ids?: string;
    limit?: number;
    offset?: number;
  }): Promise<CryptoAsset[]> {
    try {
      const response = await coinCapApi.get<CoinCapResponse>('/assets', {
        params: {
          search: params?.search,
          ids: params?.ids,
          limit: params?.limit || 100,
          offset: params?.offset || 0,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching crypto assets:', error);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  /**
   * Get specific cryptocurrency by ID
   */
  static async getAssetById(id: string): Promise<CryptoAsset> {
    try {
      const response = await coinCapApi.get<CoinCapSingleResponse>(`/assets/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching crypto asset ${id}:`, error);
      throw new Error(`Failed to fetch ${id} data`);
    }
  }

  /**
   * Get historical data for a cryptocurrency
   */
  static async getAssetHistory(
    id: string,
    interval: 'm1' | 'm5' | 'm15' | 'm30' | 'h1' | 'h2' | 'h6' | 'h12' | 'd1' = 'h1',
    start?: number,
    end?: number
  ): Promise<any[]> {
    try {
      const response = await coinCapApi.get(`/assets/${id}/history`, {
        params: {
          interval,
          start,
          end,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching history for ${id}:`, error);
      throw new Error(`Failed to fetch historical data for ${id}`);
    }
  }

  /**
   * Get top cryptocurrencies by rank
   */
  static async getTopAssets(limit: number = 10): Promise<CryptoAsset[]> {
    return this.getAssets({ limit });
  }

  /**
   * Search cryptocurrencies by name or symbol
   */
  static async searchAssets(query: string): Promise<CryptoAsset[]> {
    if (!query.trim()) return [];
    
    return this.getAssets({ search: query, limit: 20 });
  }
}