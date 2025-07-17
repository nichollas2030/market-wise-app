interface EnvConfig {
  COINCAP_API_KEY: string;
  COINCAP_BASE_URL: string;
  AGENT_FINANCE_BASE_URL: string;
  REQUEST_TIMEOUT: number;
  RETRY_ATTEMPTS: number;
  CACHE_TIME: number;
  STALE_TIME: number;
  MAX_REPORT_SIZE: number;
  ENABLE_DEMO_MODE: boolean;
}

interface LogSafeConfig {
  COINCAP_BASE_URL: string;
  AGENT_FINANCE_BASE_URL: string;
  REQUEST_TIMEOUT: number;
  RETRY_ATTEMPTS: number;
  CACHE_TIME: number;
  STALE_TIME: number;
  MAX_REPORT_SIZE: number;
  ENABLE_DEMO_MODE: boolean;
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvConfig;

  private constructor() {
    this.validateEnvironment();
    this.config = this.loadConfig();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private validateEnvironment(): void {
    const required = [
      'VITE_COINCAP_BASE_URL',
      'VITE_AGENT_FINANCE_BASE_URL'
    ];

    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.error(`Missing required environment variables: ${missing.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  private loadConfig(): EnvConfig {
    return {
      COINCAP_API_KEY: import.meta.env.VITE_COINCAP_API_KEY || '',
      COINCAP_BASE_URL: import.meta.env.VITE_COINCAP_BASE_URL,
      AGENT_FINANCE_BASE_URL: import.meta.env.VITE_AGENT_FINANCE_BASE_URL,
      REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000,
      RETRY_ATTEMPTS: Number(import.meta.env.VITE_RETRY_ATTEMPTS) || 3,
      CACHE_TIME: Number(import.meta.env.VITE_CACHE_TIME) || 300000,
      STALE_TIME: Number(import.meta.env.VITE_STALE_TIME) || 120000,
      MAX_REPORT_SIZE: Number(import.meta.env.VITE_MAX_REPORT_SIZE) || 1048576,
      ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',
    };
  }

  get apiConfig(): EnvConfig {
    return { ...this.config };
  }

  // Método para mascarar chaves em logs
  getLogSafeConfig(): LogSafeConfig {
    return {
      COINCAP_BASE_URL: this.config.COINCAP_BASE_URL,
      AGENT_FINANCE_BASE_URL: this.config.AGENT_FINANCE_BASE_URL,
      REQUEST_TIMEOUT: this.config.REQUEST_TIMEOUT,
      RETRY_ATTEMPTS: this.config.RETRY_ATTEMPTS,
      CACHE_TIME: this.config.CACHE_TIME,
      STALE_TIME: this.config.STALE_TIME,
      MAX_REPORT_SIZE: this.config.MAX_REPORT_SIZE,
      ENABLE_DEMO_MODE: this.config.ENABLE_DEMO_MODE,
      // Não expor a API key
    };
  }

  // Verifica se a API key é válida (não é placeholder)
  hasValidApiKey(): boolean {
    const apiKey = this.config.COINCAP_API_KEY;
    return !!(apiKey && 
             apiKey !== 'your_coincap_api_key_here' && 
             apiKey !== 'CHAVE_DE_API_DO_COINCAP' &&
             apiKey.length > 10);
  }

  // Método para uso em desenvolvimento
  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  // Método para uso em produção
  isProduction(): boolean {
    return import.meta.env.PROD;
  }
}

export const env = EnvironmentManager.getInstance();
export type { EnvConfig, LogSafeConfig };
