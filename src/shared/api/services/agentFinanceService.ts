import { agentFinanceApi } from '../config';
import type { CryptoAsset, AnalysisRequest, AnalysisResponse, HealthResponse, AIAnalysisState } from '../types';

export class AgentFinanceService {
  /**
   * Check API health status with LLM provider information
   */
  static async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await agentFinanceApi.get<HealthResponse>('/reports/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        llm_providers: {
          groq: false,
          openai: false,
          anthropic: false,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate AI analysis report for cryptocurrencies with performance tracking
   */
  static async generateCryptoReport(coins: CryptoAsset[]): Promise<{ report: string; generationTime: number }> {
    try {
      if (!coins || coins.length === 0) {
        throw new Error('No cryptocurrencies provided for analysis');
      }

      const request: AnalysisRequest = { coins };
      const startTime = Date.now();
      
      const response = await agentFinanceApi.post<AnalysisResponse>(
        '/reports/crypto',
        request
      );

      const generationTime = Date.now() - startTime;

      return {
        report: response.data.report,
        generationTime,
      };
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
  static async analyzeSingleCrypto(crypto: CryptoAsset): Promise<{ report: string; generationTime: number }> {
    return this.generateCryptoReport([crypto]);
  }

  /**
   * Generate analysis for multiple cryptocurrencies
   */
  static async analyzeMultipleCryptos(cryptos: CryptoAsset[]): Promise<{ report: string; generationTime: number }> {
    if (cryptos.length > 10) {
      console.warn('Analyzing more than 10 cryptocurrencies may take longer');
    }
    
    return this.generateCryptoReport(cryptos);
  }

  /**
   * Get available LLM providers
   */
  static async getAvailableLLMs(): Promise<{ groq: boolean; openai: boolean; anthropic: boolean }> {
    try {
      const health = await this.checkHealth();
      return health.llm_providers;
    } catch (error) {
      console.error('Failed to get LLM providers:', error);
      return {
        groq: false,
        openai: false,
        anthropic: false,
      };
    }
  }
}