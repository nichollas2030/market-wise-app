import { API_CONFIG } from '../config';
import type { 
  SimulationRequest, 
  SimulationResponse, 
  SimulationHistoryItem 
} from '../types/simulation';

// Headers padrão para requisições
const getHeaders = () => ({
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${token}` // Se necessário autenticação
});

// Classe de erro customizada para simulação
export class SimulationError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'SimulationError';
  }
}

// Serviço principal de simulação
export class SimulationService {
  private static instance: SimulationService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_CONFIG.AGENT_FINANCE_BASE_URL}/api/simulation`;
  }

  public static getInstance(): SimulationService {
    if (!SimulationService.instance) {
      SimulationService.instance = new SimulationService();
    }
    return SimulationService.instance;
  }

  // Otimização de carteira
  async optimizePortfolio(request: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SimulationError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // Backtesting avançado
  async runBacktest(request: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/backtest`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SimulationError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // Buscar histórico de simulações
  async getSimulationHistory(
    page: number = 1,
    limit: number = 10,
    filters?: {
      optimizationType?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{
    items: SimulationHistoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.optimizationType && { optimizationType: filters.optimizationType }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters?.dateTo && { dateTo: filters.dateTo }),
      });

      const response = await fetch(`${this.baseUrl}/history?${params}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SimulationError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // Buscar simulação específica por ID
  async getSimulationById(simulationId: string): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${simulationId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SimulationError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // Salvar simulação localmente
  async saveSimulation(simulation: SimulationResponse): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(simulation),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SimulationError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // Deletar simulação
  async deleteSimulation(simulationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${simulationId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SimulationError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // Verificar status da API
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new SimulationError(
          `Health check failed: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof SimulationError) {
        throw error;
      }
      throw new SimulationError(
        `Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'HEALTH_CHECK_ERROR'
      );
    }
  }
}

// Instância singleton
export const simulationService = SimulationService.getInstance();

// Funções utilitárias para simulação
export const simulationUtils = {
  // Validar request de simulação
  validateSimulationRequest(request: SimulationRequest): string[] {
    const errors: string[] = [];

    if (!request.coins || request.coins.length < 2) {
      errors.push('At least 2 cryptocurrencies must be selected');
    }

    if (request.coins && request.coins.length > 20) {
      errors.push('Maximum 20 cryptocurrencies allowed');
    }

    if (!request.dateRange?.startDate || !request.dateRange?.endDate) {
      errors.push('Start and end dates are required');
    } else {
      const startDate = new Date(request.dateRange.startDate);
      const endDate = new Date(request.dateRange.endDate);
      const now = new Date();

      if (startDate >= endDate) {
        errors.push('Start date must be before end date');
      }

      if (endDate > now) {
        errors.push('End date cannot be in the future');
      }

      const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 30) {
        errors.push('Simulation period must be at least 30 days');
      }

      if (daysDiff > 1825) { // 5 years
        errors.push('Simulation period cannot exceed 5 years');
      }
    }

    if (!request.initialInvestment || request.initialInvestment <= 0) {
      errors.push('Initial investment must be greater than 0');
    }

    if (!request.optimizationType) {
      errors.push('Optimization type is required');
    }

    if (!request.timeframe) {
      errors.push('Timeframe is required');
    }

    return errors;
  },

  // Formatar tempo de processamento
  formatProcessingTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  },

  // Gerar nome para simulação
  generateSimulationName(request: SimulationRequest): string {
    const coinSymbols = request.coins.map(coin => coin.symbol).join(', ');
    const startDate = new Date(request.dateRange.startDate).toLocaleDateString();
    const endDate = new Date(request.dateRange.endDate).toLocaleDateString();
    
    return `${request.optimizationType.toUpperCase()} - ${coinSymbols} (${startDate} to ${endDate})`;
  }
}; 