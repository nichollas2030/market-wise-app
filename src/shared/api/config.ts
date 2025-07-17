import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  COINCAP_BASE_URL: import.meta.env.VITE_COINCAP_BASE_URL || 'https://api.coincap.io/v2',
  AGENT_FINANCE_BASE_URL: import.meta.env.VITE_AGENT_FINANCE_BASE_URL || 'http://localhost:8000',
  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: Number(import.meta.env.VITE_RETRY_ATTEMPTS) || 3,
  CACHE_TIME: Number(import.meta.env.VITE_CACHE_TIME) || 5 * 60 * 1000, // 5 minutes
  STALE_TIME: Number(import.meta.env.VITE_STALE_TIME) || 2 * 60 * 1000, // 2 minutes
} as const;

// CoinCap API Client
const coinCapApiHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

if (import.meta.env.VITE_COINCAP_API_KEY) {
  coinCapApiHeaders['Authorization'] = `Bearer ${import.meta.env.VITE_COINCAP_API_KEY}`;
}

export const coinCapApi = axios.create({
  baseURL: API_CONFIG.COINCAP_BASE_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: coinCapApiHeaders,
});

// AgentFinance API Client
export const agentFinanceApi = axios.create({
  baseURL: API_CONFIG.AGENT_FINANCE_BASE_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptors for error handling
coinCapApi.interceptors.request.use(
  (config) => {
    console.log(`[CoinCap API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[CoinCap API] Request error:', error);
    return Promise.reject(error);
  }
);

coinCapApi.interceptors.response.use(
  (response) => {
    console.log(`[CoinCap API] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[CoinCap API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

agentFinanceApi.interceptors.request.use(
  (config) => {
    console.log(`[AgentFinance API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[AgentFinance API] Request error:', error);
    return Promise.reject(error);
  }
);

agentFinanceApi.interceptors.response.use(
  (response) => {
    console.log(`[AgentFinance API] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[AgentFinance API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);