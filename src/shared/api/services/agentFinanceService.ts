import { agentFinanceApi } from '../config';
import type { CryptoAsset, AnalysisRequest, AnalysisResponse, HealthResponse } from '../types';

export class AgentFinanceService {
  /**
   * Check API health status
   */
  static async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await agentFinanceApi.get<HealthResponse>('/reports/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Generate AI analysis report for cryptocurrencies
   */
  static async generateCryptoReport(coins: CryptoAsset[]): Promise<string> {
    try {
      if (!coins || coins.length === 0) {
        throw new Error('No cryptocurrencies provided for analysis');
      }

      const request: AnalysisRequest = { coins };
      
      const response = await agentFinanceApi.post<AnalysisResponse>(
        '/reports/crypto',
        request
      );

      return response.data.report;
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      
      if (error instanceof Error) {
        throw new Error(`AI Analysis failed: ${error.message}`);
      }
      
      throw new Error('Failed to generate AI analysis report');
    }
  }

  /**
   * Generate analysis for a single cryptocurrency
   */
  static async analyzeSingleCrypto(crypto: CryptoAsset): Promise<string> {
    return this.generateCryptoReport([crypto]);
  }

  /**
   * Generate analysis for multiple cryptocurrencies
   */
  static async analyzeMultipleCryptos(cryptos: CryptoAsset[]): Promise<string> {
    if (cryptos.length > 10) {
      console.warn('Analyzing more than 10 cryptocurrencies may take longer');
    }
    
    return this.generateCryptoReport(cryptos);
  }
}