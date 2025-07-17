import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CoinCapService, AgentFinanceService } from "../services";
import type { CryptoAsset, AIAnalysisState } from "../types";
import { API_CONFIG } from "../config";

// Query Keys
export const CRYPTO_QUERY_KEYS = {
  all: ["crypto"] as const,
  assets: () => [...CRYPTO_QUERY_KEYS.all, "assets"] as const,
  asset: (id: string) => [...CRYPTO_QUERY_KEYS.all, "asset", id] as const,
  history: (id: string) => [...CRYPTO_QUERY_KEYS.all, "history", id] as const,
  search: (query: string) =>
    [...CRYPTO_QUERY_KEYS.all, "search", query] as const,
  analysis: (coinIds: string[]) =>
    [...CRYPTO_QUERY_KEYS.all, "analysis", coinIds] as const,
  health: () => [...CRYPTO_QUERY_KEYS.all, "health"] as const,
  llmProviders: () => [...CRYPTO_QUERY_KEYS.all, "llm-providers"] as const,
} as const;

/**
 * Hook to fetch cryptocurrency assets list
 */
export const useCryptoAssets = (params?: {
  search?: string;
  limit?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: CRYPTO_QUERY_KEYS.assets(),
    queryFn: () =>
      CoinCapService.getAssets({
        search: params?.search,
        limit: params?.limit || 100,
      }),
    staleTime: API_CONFIG.STALE_TIME,
    gcTime: API_CONFIG.CACHE_TIME,
    enabled: params?.enabled !== false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to fetch a single cryptocurrency by ID
 */
export const useCryptoAsset = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: CRYPTO_QUERY_KEYS.asset(id),
    queryFn: () => CoinCapService.getAssetById(id),
    staleTime: API_CONFIG.STALE_TIME,
    gcTime: API_CONFIG.CACHE_TIME,
    enabled: enabled && !!id,
    retry: 2,
  });
};

/**
 * Hook to search cryptocurrencies
 */
export const useCryptoSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: CRYPTO_QUERY_KEYS.search(query),
    queryFn: () => CoinCapService.searchAssets(query),
    staleTime: 30000, // 30 seconds for search results
    gcTime: 60000, // 1 minute cache
    enabled: enabled && query.length > 0,
    retry: 1,
  });
};

/**
 * Hook to fetch cryptocurrency history
 */
export const useCryptoHistory = (
  id: string,
  interval:
    | "m1"
    | "m5"
    | "m15"
    | "m30"
    | "h1"
    | "h2"
    | "h6"
    | "h12"
    | "d1" = "h1",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: CRYPTO_QUERY_KEYS.history(id),
    queryFn: () => CoinCapService.getAssetHistory(id, interval),
    staleTime: 60000, // 1 minute for historical data
    gcTime: 300000, // 5 minutes cache
    enabled: enabled && !!id,
    retry: 1,
  });
};

/**
 * Hook to check AgentFinance API health with LLM providers
 */
export const useAgentFinanceHealth = () => {
  return useQuery({
    queryKey: CRYPTO_QUERY_KEYS.health(),
    queryFn: () => AgentFinanceService.checkHealth(),
    staleTime: 30000, // 30 seconds
    gcTime: 60000, // 1 minute
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook to get available LLM providers
 */
export const useLLMProviders = () => {
  return useQuery({
    queryKey: CRYPTO_QUERY_KEYS.llmProviders(),
    queryFn: () => AgentFinanceService.getAvailableLLMs(),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook for AI crypto analysis mutation with performance tracking
 */
export const useCryptoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coins: CryptoAsset[]) =>
      AgentFinanceService.generateCryptoReport(coins),
    onSuccess: (data, variables) => {
      // Cache the analysis result
      const coinIds = variables.map((coin) => coin.id);
      queryClient.setQueryData(CRYPTO_QUERY_KEYS.analysis(coinIds), {
        report: data.report,
        generationTime: data.generationTime,
        timestamp: Date.now(),
      });
    },
    onError: (error) => {
      console.error("AI Analysis error:", error);
    },
  });
};

/**
 * Hook for single crypto analysis
 */
export const useSingleCryptoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (crypto: CryptoAsset) =>
      AgentFinanceService.analyzeSingleCrypto(crypto),
    onSuccess: (data, variables) => {
      // Cache the analysis result
      queryClient.setQueryData(CRYPTO_QUERY_KEYS.analysis([variables.id]), {
        report: data.report,
        generationTime: data.generationTime,
        timestamp: Date.now(),
      });
    },
    onError: (error) => {
      console.error("Single Crypto Analysis error:", error);
    },
  });
};

/**
 * Hook to refresh crypto data
 */
export const useRefreshCrypto = () => {
  const queryClient = useQueryClient();

  return {
    refreshAssets: () => {
      queryClient.invalidateQueries({ queryKey: CRYPTO_QUERY_KEYS.assets() });
    },
    refreshAsset: (id: string) => {
      queryClient.invalidateQueries({ queryKey: CRYPTO_QUERY_KEYS.asset(id) });
    },
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: CRYPTO_QUERY_KEYS.all });
    },
    refreshHealth: () => {
      queryClient.invalidateQueries({ queryKey: CRYPTO_QUERY_KEYS.health() });
    },
    refreshLLMProviders: () => {
      queryClient.invalidateQueries({
        queryKey: CRYPTO_QUERY_KEYS.llmProviders(),
      });
    },
  };
};

/**
 * Hook para filtrar criptomoedas com filtros avançados
 */
export const useFilteredCryptos = (
  cryptos: CryptoAsset[],
  searchQuery: string,
  filters?: {
    priceRange?: [number, number];
    marketCapRange?: [number, number];
    changeRange?: [number, number];
    category?: "all" | "rising" | "falling" | "stable";
  }
) => {
  return cryptos.filter((crypto) => {
    const price = parseFloat(crypto.priceUsd);
    const marketCap = parseFloat(crypto.marketCapUsd);
    const change = parseFloat(crypto.changePercent24Hr);

    // Filtro de busca por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesName = crypto.name.toLowerCase().includes(query);
      const matchesSymbol = crypto.symbol.toLowerCase().includes(query);
      const matchesId = crypto.id.toLowerCase().includes(query);

      if (!matchesName && !matchesSymbol && !matchesId) {
        return false;
      }
    }

    // Filtro por faixa de preço
    if (filters?.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (price < minPrice || price > maxPrice) {
        return false;
      }
    }

    // Filtro por market cap
    if (filters?.marketCapRange) {
      const [minMarketCap, maxMarketCap] = filters.marketCapRange;
      if (marketCap < minMarketCap || marketCap > maxMarketCap) {
        return false;
      }
    }

    // Filtro por variação
    if (filters?.changeRange) {
      const [minChange, maxChange] = filters.changeRange;
      if (change < minChange || change > maxChange) {
        return false;
      }
    }

    // Filtro por categoria
    if (filters?.category && filters.category !== "all") {
      switch (filters.category) {
        case "rising":
          if (change <= 0) return false;
          break;
        case "falling":
          if (change >= 0) return false;
          break;
        case "stable":
          if (change < -1 || change > 1) return false;
          break;
      }
    }

    return true;
  });
};
