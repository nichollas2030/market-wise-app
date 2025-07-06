import type { CryptoAsset, FormattedCrypto } from '../../api/types';

/**
 * Format number as currency with appropriate suffix (K, M, B, T)
 */
export const formatCurrency = (value: string | number, decimals: number = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0.00';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e12) {
    return `$${(num / 1e12).toFixed(decimals)}T`;
  } else if (absNum >= 1e9) {
    return `$${(num / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `$${(num / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `$${(num / 1e3).toFixed(decimals)}K`;
  } else if (absNum >= 1) {
    return `$${num.toFixed(decimals)}`;
  } else {
    // For very small numbers, show more decimals
    return `$${num.toFixed(6)}`;
  }
};

/**
 * Format percentage change with proper sign and color
 */
export const formatPercent = (value: string | number, includeSign: boolean = true): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0.00%';
  
  const sign = includeSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Format large numbers with appropriate suffixes
 */
export const formatNumber = (value: string | number, decimals: number = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e12) {
    return `${(num / 1e12).toFixed(decimals)}T`;
  } else if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  } else {
    return num.toFixed(decimals);
  }
};

/**
 * Format crypto price with dynamic decimal places
 */
export const formatCryptoPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0.00';
  
  if (num >= 1) {
    return `$${num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  } else if (num >= 0.01) {
    return `$${num.toFixed(4)}`;
  } else {
    return `$${num.toFixed(6)}`;
  }
};

/**
 * Format market cap with full expansion
 */
export const formatMarketCap = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0';
  
  return formatCurrency(num, 2);
};

/**
 * Format volume with appropriate scaling
 */
export const formatVolume = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0';
  
  return formatCurrency(num, 1);
};

/**
 * Convert CryptoAsset to FormattedCrypto with all formatted values
 */
export const formatCryptoAsset = (asset: CryptoAsset): FormattedCrypto => {
  const priceNumber = parseFloat(asset.priceUsd);
  const marketCapNumber = parseFloat(asset.marketCapUsd);
  const volumeNumber = parseFloat(asset.volumeUsd24Hr);
  const changeNumber = parseFloat(asset.changePercent24Hr);
  
  return {
    ...asset,
    formattedPrice: formatCryptoPrice(priceNumber),
    formattedMarketCap: formatMarketCap(marketCapNumber),
    formattedVolume: formatVolume(volumeNumber),
    formattedChange: formatPercent(changeNumber),
    isPositiveChange: changeNumber >= 0,
    priceNumber,
    marketCapNumber,
    volumeNumber,
    changeNumber,
  };
};

/**
 * Get color class based on percentage change
 */
export const getChangeColorClass = (change: number): string => {
  if (change > 0) return 'text-success';
  if (change < 0) return 'text-danger';
  return 'text-muted-foreground';
};

/**
 * Get change direction icon
 */
export const getChangeIcon = (change: number): string => {
  if (change > 0) return '↗';
  if (change < 0) return '↘';
  return '→';
};

/**
 * Format time ago from timestamp
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};

/**
 * Debounce function for search and filters
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate rankings from crypto assets
 */
export const generateRankings = (assets: CryptoAsset[]) => {
  return {
    topPrices: [...assets]
      .sort((a, b) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd))
      .slice(0, 5),
    topVolumes: [...assets]
      .sort((a, b) => parseFloat(b.volumeUsd24Hr) - parseFloat(a.volumeUsd24Hr))
      .slice(0, 5),
    topChanges: [...assets]
      .sort((a, b) => Math.abs(parseFloat(b.changePercent24Hr)) - Math.abs(parseFloat(a.changePercent24Hr)))
      .slice(0, 5),
  };
};