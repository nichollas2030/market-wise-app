import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  SimulationState, 
  SimulationRequest, 
  SimulationResponse, 
  SimulationHistoryItem
} from '../../shared/api/types/simulation';
import type { CryptoAsset } from '../../shared/api/types';

// Configuração de tipos de otimização
export const OPTIMIZATION_TYPES = [
  {
    id: 'sharpe' as const,
    name: 'Sharpe Ratio',
    description: 'Maximiza o retorno ajustado ao risco usando o índice de Sharpe',
    complexity: 'low' as const,
    estimatedTime: 30,
    icon: '📊',
    features: ['Otimização de risco-retorno', 'Análise de volatilidade', 'Recomendado para iniciantes']
  },
  {
    id: 'genetic_algorithm' as const,
    name: 'Algoritmo Genético',
    description: 'Usa algoritmos evolutivos para encontrar a melhor combinação de ativos',
    complexity: 'high' as const,
    estimatedTime: 120,
    icon: '🧬',
    features: ['Otimização avançada', 'Múltiplas iterações', 'Resultados precisos']
  },
  {
    id: 'risk_parity' as const,
    name: 'Paridade de Risco',
    description: 'Distribui o risco igualmente entre todos os ativos da carteira',
    complexity: 'medium' as const,
    estimatedTime: 60,
    icon: '⚖️',
    features: ['Risco equilibrado', 'Diversificação natural', 'Estabilidade']
  },
  {
    id: 'momentum' as const,
    name: 'Momentum',
    description: 'Foca em ativos com tendência de alta baseada em performance histórica',
    complexity: 'medium' as const,
    estimatedTime: 45,
    icon: '🚀',
    features: ['Tendência de mercado', 'Performance histórica', 'Timing de entrada']
  },
  {
    id: 'custom_ai' as const,
    name: 'IA Customizada',
    description: 'Usa machine learning para otimização personalizada baseada em múltiplos fatores',
    complexity: 'high' as const,
    estimatedTime: 180,
    icon: '🤖',
    features: ['Machine Learning', 'Análise multidimensional', 'Otimização avançada']
  }
];

// Configuração de tolerância ao risco
export const RISK_TOLERANCE_OPTIONS = [
  {
    id: 'conservative' as const,
    name: 'Conservador',
    description: 'Foco em preservação de capital com baixo risco',
    icon: '🛡️',
    color: 'text-green-600'
  },
  {
    id: 'moderate' as const,
    name: 'Moderado',
    description: 'Equilíbrio entre risco e retorno',
    icon: '⚖️',
    color: 'text-yellow-600'
  },
  {
    id: 'aggressive' as const,
    name: 'Agressivo',
    description: 'Maximização de retorno com maior tolerância ao risco',
    icon: '🔥',
    color: 'text-red-600'
  }
];

// Configuração de timeframes
export const TIMEFRAME_OPTIONS = [
  {
    id: 'daily' as const,
    name: 'Diário',
    description: 'Análise baseada em dados diários',
    icon: '📅'
  },
  {
    id: 'weekly' as const,
    name: 'Semanal',
    description: 'Análise baseada em dados semanais',
    icon: '📊'
  },
  {
    id: 'monthly' as const,
    name: 'Mensal',
    description: 'Análise baseada em dados mensais',
    icon: '📈'
  }
];

// Estado inicial
const initialState = {
  selectedCoins: [],
  simulationParams: {
    timeframe: 'daily' as const,
    optimizationType: 'sharpe' as const,
    riskTolerance: 'moderate' as const,
    initialInvestment: 10000,
  },
  currentSimulation: null,
  simulationHistory: [],
  isWizardOpen: false,
  currentStep: 0,
};

// Create the simulation store with persistence
export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setSelectedCoins: (coins: CryptoAsset[]) => {
        set({ selectedCoins: coins });
      },

      updateParams: (params: Partial<SimulationRequest>) => {
        set((state) => ({
          simulationParams: {
            ...state.simulationParams,
            ...params,
          },
        }));
      },

      saveSimulation: (simulation: SimulationResponse) => {
        set((state) => ({
          currentSimulation: simulation,
          simulationHistory: [
            {
              id: simulation.id,
              name: simulation.request.coins.map(c => c.symbol).join(', '),
              timestamp: simulation.timestamp,
              optimizationType: simulation.request.optimizationType,
              initialInvestment: simulation.request.initialInvestment,
              totalReturn: simulation.portfolio.performance.totalReturn,
              status: simulation.status,
            },
            ...state.simulationHistory,
          ].slice(0, 50), // Manter apenas as últimas 50 simulações
        }));
      },

      clearSimulation: () => {
        set({ currentSimulation: null });
      },

      setWizardOpen: (open: boolean) => {
        set({ isWizardOpen: open });
        if (!open) {
          set({ currentStep: 0 }); // Reset step when closing
        }
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      addToHistory: (item: SimulationHistoryItem) => {
        set((state) => ({
          simulationHistory: [item, ...state.simulationHistory].slice(0, 50),
        }));
      },

      clearHistory: () => {
        set({ simulationHistory: [] });
      },

      // Computed values
      getSelectedCoinsCount: () => {
        return get().selectedCoins.length;
      },

      getTotalInvestment: () => {
        return get().simulationParams.initialInvestment || 0;
      },

      getOptimizationTypeConfig: () => {
        const type = get().simulationParams.optimizationType;
        return OPTIMIZATION_TYPES.find(t => t.id === type);
      },

      getRiskToleranceConfig: () => {
        const tolerance = get().simulationParams.riskTolerance;
        return RISK_TOLERANCE_OPTIONS.find(t => t.id === tolerance);
      },

      getTimeframeConfig: () => {
        const timeframe = get().simulationParams.timeframe;
        return TIMEFRAME_OPTIONS.find(t => t.id === timeframe);
      },

      // Validation helpers
      isStepValid: (step: number) => {
        const state = get();
        
        switch (step) {
          case 0: // Seleção de criptomoedas
            return state.selectedCoins.length >= 2 && state.selectedCoins.length <= 20;
          case 1: // Configuração de parâmetros
            return !!state.simulationParams.timeframe && !!state.simulationParams.optimizationType;
          case 2: // Configuração de risco
            return state.simulationParams.initialInvestment > 0;
          case 3: // Preview
            return true; // Sempre válido se chegou até aqui
          default:
            return false;
        }
      },

      canProceedToNextStep: () => {
        const state = get();
        return state.isStepValid(state.currentStep);
      },

      canGoToPreviousStep: () => {
        return get().currentStep > 0;
      },

      // Navigation helpers
      nextStep: () => {
        const state = get();
        if (state.canProceedToNextStep() && state.currentStep < 4) {
          set({ currentStep: state.currentStep + 1 });
        }
      },

      previousStep: () => {
        const state = get();
        if (state.canGoToPreviousStep()) {
          set({ currentStep: state.currentStep - 1 });
        }
      },

      goToStep: (step: number) => {
        if (step >= 0 && step <= 4) {
          set({ currentStep: step });
        }
      },

      // Reset helpers
      resetWizard: () => {
        set({
          selectedCoins: [],
          simulationParams: initialState.simulationParams,
          currentStep: 0,
        });
      },

      resetAll: () => {
        set(initialState);
      },
    }),
    {
      name: 'simulation-store',
      partialize: (state) => ({
        selectedCoins: state.selectedCoins,
        simulationParams: state.simulationParams,
        simulationHistory: state.simulationHistory,
      }),
    }
  )
);

// Selectors para performance
export const simulationSelectors = {
  selectedCoins: (state: SimulationState) => state.selectedCoins,
  simulationParams: (state: SimulationState) => state.simulationParams,
  currentSimulation: (state: SimulationState) => state.currentSimulation,
  simulationHistory: (state: SimulationState) => state.simulationHistory,
  isWizardOpen: (state: SimulationState) => state.isWizardOpen,
  currentStep: (state: SimulationState) => state.currentStep,
  selectedCoinsCount: (state: SimulationState) => state.selectedCoins.length,
  totalInvestment: (state: SimulationState) => state.simulationParams.initialInvestment || 0,
  canProceedToNextStep: (state: SimulationState) => state.canProceedToNextStep(),
  canGoToPreviousStep: (state: SimulationState) => state.canGoToPreviousStep(),
}; 