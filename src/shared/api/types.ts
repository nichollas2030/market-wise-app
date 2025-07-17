// API Types - Maintaining EXACT structure as specified

// CoinCap API Types
export interface CryptoAsset {
  id: string;              // "bitcoin"
  rank: string;            // "1"
  symbol: string;          // "BTC"
  name: string;            // "Bitcoin"
  supply: string;          // "19500000"
  maxSupply: string;       // "21000000"
  marketCapUsd: string;    // "1250000000000"
  volumeUsd24Hr: string;   // "25000000000"
  priceUsd: string;        // "64123.45"
  changePercent24Hr: string; // "-1.2"
  vwap24Hr: string;        // "63890.12"
  explorer: string;        // URL of explorer
}

export interface CoinCapResponse {
  data: CryptoAsset[];
  timestamp: number;
}

export interface CoinCapSingleResponse {
  data: CryptoAsset;
  timestamp: number;
}

// AgentFinance API Types
export interface AnalysisRequest {
  coins: CryptoAsset[]; // Array with complete structure above
}

export interface AnalysisResponse {
  report: string; // Report in text/markdown format
}

export interface LLMProviderStatus {
  groq: boolean;
  openai: boolean;
  anthropic: boolean;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  llm_providers: LLMProviderStatus;
  timestamp: string;
}

// AI Analysis Types
export interface AIAnalysisState {
  isLoading: boolean;
  report: string | null;
  error: string | null;
  activeLLM: 'groq' | 'openai' | 'anthropic' | null;
  generationTime: number | null;
}

// Utility Types
export interface PriceChangeData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

export interface FormattedCrypto extends CryptoAsset {
  formattedPrice: string;
  formattedMarketCap: string;
  formattedVolume: string;
  formattedChange: string;
  isPositiveChange: boolean;
  priceNumber: number;
  marketCapNumber: number;
  volumeNumber: number;
  changeNumber: number;
}

// Filter Types
export interface CryptoFilters {
  search: string;
  priceRange: [number, number];
  marketCapRange: [number, number];
  changeRange: [number, number];
  rankRange: [number, number];
  onlyFavorites: boolean;
  preset: 'all' | 'rising' | 'falling' | 'stable';
}

// Live Updates Types
export interface LiveUpdateConfig {
  enabled: boolean;
  interval: 15000 | 30000 | 60000 | 300000; // 15s, 30s, 1min, 5min
  backgroundUpdates: boolean;
}

export interface LiveUpdateStats {
  totalAssets: number;
  rising: number;
  falling: number;
  stable: number;
  lastUpdate: number;
  changedAssets: string[]; // Asset IDs that changed
}

// Rankings Types
export interface TopRankings {
  topPrices: CryptoAsset[];
  topVolumes: CryptoAsset[];
  topChanges: CryptoAsset[];
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}