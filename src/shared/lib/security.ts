import DOMPurify from 'dompurify';

/**
 * Sanitiza texto para prevenir XSS
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }).trim();
};

/**
 * Sanitiza conteúdo HTML permitindo apenas tags seguras
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre'],
    ALLOWED_ATTR: [],
  });
};

/**
 * Sanitiza conteúdo de relatório
 */
export const sanitizeReportContent = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  // Remove caracteres perigosos e limita tamanho
  return content
    .replace(/[^\x20-\x7E\n\r\t]/g, '') // Manter apenas caracteres imprimíveis ASCII + quebras de linha + tabs
    .replace(/[<>]/g, '') // Remove caracteres HTML
    .substring(0, parseInt(import.meta.env.VITE_MAX_REPORT_SIZE || '1048576', 10)); // Limite de 1MB
};

/**
 * Valida símbolo de crypto
 */
export const validateCryptoSymbol = (symbol: string): boolean => {
  if (!symbol || typeof symbol !== 'string') return false;
  return /^[A-Z0-9]{1,10}$/.test(symbol.toUpperCase());
};

/**
 * Sanitiza nome de arquivo
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') return 'download';
  
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Apenas caracteres seguros
    .replace(/_{2,}/g, '_') // Remove underscores duplos
    .substring(0, 100) // Limite de tamanho
    .replace(/^_+|_+$/g, ''); // Remove underscores no início/fim
};

/**
 * Download seguro de arquivos
 */
export const downloadFile = (content: string, filename: string): void => {
  try {
    const sanitizedContent = sanitizeReportContent(content);
    const sanitizedFilename = sanitizeFilename(filename);
    
    if (!sanitizedContent || !sanitizedFilename) {
      throw new Error('Invalid content or filename');
    }
    
    const blob = new Blob([sanitizedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Criar link temporário sem manipular DOM diretamente
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizedFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup imediato
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Download failed');
  }
};

/**
 * Valida entrada de dados de crypto
 */
export const validateCryptoData = (crypto: unknown): boolean => {
  if (!crypto || typeof crypto !== 'object') return false;
  
  const cryptoObj = crypto as Record<string, unknown>;
  
  return (
    cryptoObj.symbol &&
    cryptoObj.name &&
    cryptoObj.priceUsd &&
    validateCryptoSymbol(String(cryptoObj.symbol)) &&
    !isNaN(parseFloat(String(cryptoObj.priceUsd)))
  );
};

/**
 * Rate limiting simples
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests = 10, timeWindowMs = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  getTimeToReset(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
  }
}

/**
 * Mascara informações sensíveis para logs
 */
export const maskSensitiveData = (obj: Record<string, unknown>): Record<string, unknown> => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const masked = { ...obj };
  const sensitiveKeys = ['api_key', 'apiKey', 'password', 'secret', 'token', 'authorization'];
  
  for (const key in masked) {
    if (sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    )) {
      masked[key] = '***MASKED***';
    }
  }
  
  return masked;
};

/**
 * Valida URL para prevenir SSRF
 */
export const isValidURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedURL = new URL(url);
    
    // Apenas HTTPS em produção, HTTP permitido em desenvolvimento
    const allowedProtocols = import.meta.env.DEV 
      ? ['https:', 'http:'] 
      : ['https:'];
    
    if (!allowedProtocols.includes(parsedURL.protocol)) return false;
    
    // Bloquear IPs privados em produção
    if (!import.meta.env.DEV) {
      const hostname = parsedURL.hostname;
      
      // Bloquear localhost, IPs privados, etc.
      const blockedPatterns = [
        /^localhost$/i,
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^0\./,
        /^169\.254\./,
        /^::1$/,
        /^fc00:/,
        /^fe80:/
      ];
      
      if (blockedPatterns.some(pattern => pattern.test(hostname))) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Configuração de CSP para headers
 */
export const getCSPDirectives = (): string => {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.coincap.io",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'"
  ];
  
  return directives.join('; ');
};
