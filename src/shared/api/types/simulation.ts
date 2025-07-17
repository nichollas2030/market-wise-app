import type { CryptoAsset } from '../types';

// Request Payload
export interface SimulationRequest {
  coins: Array<{
    id: string;
    symbol: string;
    name: string;
  }>;
  dateRange: {
    startDate: string;    // ISO format
    endDate: string;      // ISO format
  };
  timeframe: 'daily' | 'weekly' | 'monthly';
  optimizationType: 'sharpe' | 'genetic_algorithm' | 'risk_parity' | 'momentum' | 'custom_ai';
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  initialInvestment: number;
}

// Performance Interface
export interface Performance {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

// Daily Returns Interface
export interface DailyReturn {
  date: string;
  value: number;
  return: number;
}

// Portfolio Allocation Interface
export interface PortfolioAllocation {
  coinId: string;
  symbol: string;
  weight: number;        // % da carteira
  amount: number;        // valor em USD
}

// Risk Metrics Interface
export interface RiskMetrics {
  var95: number;         // Value at Risk
  cvar95: number;        // Conditional VaR
  beta: number;
  correlation: number;
}

// Benchmark Interface
export interface Benchmark {
  symbol: string;
  performance: Performance;
}

// Portfolio Interface
export interface Portfolio {
  allocations: PortfolioAllocation[];
  performance: Performance;
  metrics: {
    startValue: number;
    endValue: number;
    totalProfit: number;
    profitPercentage: number;
  };
  dailyReturns: DailyReturn[];
}

// Simulation Response Interface
export interface SimulationResponse {
  id: string;
  timestamp: string;
  request: SimulationRequest;
  portfolio: Portfolio;
  benchmark?: Benchmark;
  riskMetrics: RiskMetrics;
  status: 'completed' | 'processing' | 'failed';
  processingTime?: number;
  error?: string;
}

// Simulation History Item
export interface SimulationHistoryItem {
  id: string;
  name: string;
  timestamp: string;
  optimizationType: string;
  initialInvestment: number;
  totalReturn: number;
  status: 'completed' | 'processing' | 'failed';
}

// Optimization Type Configuration
export interface OptimizationTypeConfig {
  id: 'sharpe' | 'genetic_algorithm' | 'risk_parity' | 'momentum' | 'custom_ai';
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  estimatedTime: number; // seconds
  icon: string;
  features: string[];
}

// Simulation State for Zustand Store
export interface SimulationState {
  selectedCoins: CryptoAsset[];
  simulationParams: Partial<SimulationRequest>;
  currentSimulation: SimulationResponse | null;
  simulationHistory: SimulationHistoryItem[];
  isWizardOpen: boolean;
  currentStep: number;

  // Actions
  setSelectedCoins: (coins: CryptoAsset[]) => void;
  updateParams: (params: Partial<SimulationRequest>) => void;
  saveSimulation: (simulation: SimulationResponse) => void;
  clearSimulation: () => void;
  setWizardOpen: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  addToHistory: (item: SimulationHistoryItem) => void;
  clearHistory: () => void;

  // Wizard helpers
  isStepValid: (step: number) => boolean;
  canProceedToNextStep: () => boolean;
  canGoToPreviousStep: () => boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetWizard: () => void;
  resetAll: () => void;
}

// Wizard Step Configuration
export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
}

// Simulation Validation Errors
export interface SimulationValidationErrors {
  coins?: string;
  dateRange?: string;
  investment?: string;
  timeframe?: string;
  optimizationType?: string;
} 