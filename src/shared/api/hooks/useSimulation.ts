import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { simulationService, simulationUtils } from '../services/simulationService';
import type { 
  SimulationRequest, 
  SimulationResponse, 
  SimulationHistoryItem 
} from '../types/simulation';

// Query keys para React Query
export const simulationQueryKeys = {
  all: ['simulation'] as const,
  history: () => [...simulationQueryKeys.all, 'history'] as const,
  historyPage: (page: number, limit: number, filters?: any) => 
    [...simulationQueryKeys.history(), page, limit, filters] as const,
  byId: (id: string) => [...simulationQueryKeys.all, 'byId', id] as const,
  health: () => [...simulationQueryKeys.all, 'health'] as const,
};

// Hook para otimização de carteira
export const usePortfolioSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SimulationRequest) => {
      // Validar request antes de enviar
      const errors = simulationUtils.validateSimulationRequest(request);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }
      
      return simulationService.optimizePortfolio(request);
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.history() });
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.byId(data.id) });
      
      // Adicionar ao cache
      queryClient.setQueryData(simulationQueryKeys.byId(data.id), data);
    },
    onError: (error) => {
      console.error('Portfolio simulation error:', error);
    },
  });
};

// Hook para backtesting
export const useBacktestSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SimulationRequest) => {
      // Validar request antes de enviar
      const errors = simulationUtils.validateSimulationRequest(request);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }
      
      return simulationService.runBacktest(request);
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.history() });
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.byId(data.id) });
      
      // Adicionar ao cache
      queryClient.setQueryData(simulationQueryKeys.byId(data.id), data);
    },
    onError: (error) => {
      console.error('Backtest simulation error:', error);
    },
  });
};

// Hook para histórico de simulações
export const useSimulationHistory = (
  page: number = 1,
  limit: number = 10,
  filters?: {
    optimizationType?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) => {
  return useQuery({
    queryKey: simulationQueryKeys.historyPage(page, limit, filters),
    queryFn: () => simulationService.getSimulationHistory(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    retry: (failureCount, error) => {
      // Não tentar novamente para erros de validação
      if (error instanceof Error && error.message.includes('Validation errors')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook para buscar simulação específica
export const useSimulationById = (simulationId: string) => {
  return useQuery({
    queryKey: simulationQueryKeys.byId(simulationId),
    queryFn: () => simulationService.getSimulationById(simulationId),
    enabled: !!simulationId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000,    // 30 minutos
    retry: (failureCount, error) => {
      // Não tentar novamente para erros 404
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook para deletar simulação
export const useDeleteSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (simulationId: string) => simulationService.deleteSimulation(simulationId),
    onSuccess: (_, simulationId) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: simulationQueryKeys.byId(simulationId) });
      // Invalidar histórico
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.history() });
    },
    onError: (error) => {
      console.error('Delete simulation error:', error);
    },
  });
};

// Hook para salvar simulação
export const useSaveSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (simulation: SimulationResponse) => simulationService.saveSimulation(simulation),
    onSuccess: (_, simulation) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.history() });
      queryClient.invalidateQueries({ queryKey: simulationQueryKeys.byId(simulation.id) });
    },
    onError: (error) => {
      console.error('Save simulation error:', error);
    },
  });
};

// Hook para verificar saúde da API
export const useSimulationHealth = () => {
  return useQuery({
    queryKey: simulationQueryKeys.health(),
    queryFn: () => simulationService.checkHealth(),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    retry: (failureCount) => failureCount < 2,
    refetchInterval: 60 * 1000, // Verificar a cada minuto
  });
};

// Hook para validação de request
export const useSimulationValidation = (request: Partial<SimulationRequest>) => {
  return {
    errors: simulationUtils.validateSimulationRequest(request as SimulationRequest),
    isValid: simulationUtils.validateSimulationRequest(request as SimulationRequest).length === 0,
    generateName: () => simulationUtils.generateSimulationName(request as SimulationRequest),
  };
};

// Hook para gerenciar estado de simulação em tempo real
export const useSimulationStatus = (simulationId: string) => {
  const { data: simulation, isLoading, error } = useSimulationById(simulationId);

  return {
    simulation,
    isLoading,
    error,
    isProcessing: simulation?.status === 'processing',
    isCompleted: simulation?.status === 'completed',
    isFailed: simulation?.status === 'failed',
    processingTime: simulation?.processingTime 
      ? simulationUtils.formatProcessingTime(simulation.processingTime)
      : null,
  };
};

// Hook para estatísticas de simulação
export const useSimulationStats = () => {
  const { data: historyData } = useSimulationHistory(1, 1000); // Buscar todas as simulações

  const stats = React.useMemo(() => {
    if (!historyData?.items) return null;

    const items = historyData.items;
    const total = items.length;
    const completed = items.filter(item => item.status === 'completed').length;
    const processing = items.filter(item => item.status === 'processing').length;
    const failed = items.filter(item => item.status === 'failed').length;

    const totalInvestment = items.reduce((sum, item) => sum + item.initialInvestment, 0);
    const avgReturn = items.length > 0 
      ? items.reduce((sum, item) => sum + item.totalReturn, 0) / items.length 
      : 0;

    const optimizationTypes = items.reduce((acc, item) => {
      acc[item.optimizationType] = (acc[item.optimizationType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      processing,
      failed,
      successRate: total > 0 ? (completed / total) * 100 : 0,
      totalInvestment,
      avgReturn,
      optimizationTypes,
    };
  }, [historyData]);

  return { stats, isLoading: !historyData };
}; 