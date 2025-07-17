import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../shared/ui';
import { 
  formatCryptoPrice, 
  formatMarketCap, 
  formatVolume, 
  formatPercent, 
  formatNumber,
  getChangeColorClass,
  getChangeIcon 
} from '../../shared/lib/utils/formatters';
import type { CryptoAsset } from '../../shared/api/types';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Globe, BarChart3 } from 'lucide-react';

interface CryptoDetailProps {
  crypto: CryptoAsset;
  loading?: boolean;
  className?: string;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({ 
  crypto, 
  loading = false, 
  className 
}) => {
  const price = parseFloat(crypto.priceUsd);
  const marketCap = parseFloat(crypto.marketCapUsd);
  const volume = parseFloat(crypto.volumeUsd24Hr);
  const change = parseFloat(crypto.changePercent24Hr);
  const supply = parseFloat(crypto.supply);
  const maxSupply = parseFloat(crypto.maxSupply);
  const vwap = parseFloat(crypto.vwap24Hr);

  const isPositiveChange = change >= 0;
  const supplyPercentage = maxSupply > 0 ? (supply / maxSupply) * 100 : 0;

  if (loading) {
    return (
      <Card variant="glass" className={`h-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-6 bg-muted rounded animate-pulse" />
              <div className="w-20 h-4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                <div className="w-full h-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      className={`w-full max-w-md sm:max-w-2xl mx-auto h-full hover-glow ${className || ''}`}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl mx-auto sm:mx-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              {crypto.symbol.charAt(0)}
            </motion.div>
            <div className="flex flex-col items-center sm:items-start gap-1 w-full">
              <CardTitle className="text-lg sm:text-xl font-bold text-gradient-primary break-words w-full">
                {crypto.name}
              </CardTitle>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 w-full">
                <Badge variant="outline" size="sm" className="text-xs sm:text-sm">
                  #{crypto.rank}
                </Badge>
                <Badge variant="info" size="sm" className="text-xs sm:text-sm">
                  {crypto.symbol}
                </Badge>
              </div>
            </div>
          </div>
          <motion.div
            className="mt-3 sm:mt-0 text-center sm:text-right w-full sm:w-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xl sm:text-2xl font-bold text-gradient-primary">
              {formatCryptoPrice(price)}
            </div>
            <div className={`flex items-center justify-center sm:justify-end gap-1 text-xs sm:text-sm ${getChangeColorClass(change)}`}> 
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4" />
              ) : change < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              {formatPercent(change)}
            </div>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price & Market Data */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                Market Cap
              </div>
              <div className="text-base sm:text-lg font-semibold">
                {formatMarketCap(marketCap)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                24h Volume
              </div>
              <div className="text-base sm:text-lg font-semibold">
                {formatVolume(volume)}
              </div>
            </div>
          </motion.div>
          {/* Supply Information */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              Supply Information
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Circulating Supply</span>
                <span className="font-medium">{formatNumber(supply)}</span>
              </div>
              {maxSupply > 0 && (
                <>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Max Supply</span>
                    <span className="font-medium">{formatNumber(maxSupply)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Supply Percentage</span>
                      <span className="font-medium">{supplyPercentage.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(supplyPercentage, 100)}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
          {/* VWAP & Additional Data */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              Trading Data
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">VWAP (24h)</div>
                <div className="text-sm font-medium">{formatCryptoPrice(vwap)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Price Change</div>
                <div className={`text-sm font-medium ${getChangeColorClass(change)}`}> 
                  {getChangeIcon(change)} {formatPercent(change)}
                </div>
              </div>
            </div>
          </motion.div>
          {/* Explorer Link */}
          {crypto.explorer && (
            <motion.div
              className="pt-4 border-t border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href={crypto.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoDetail; 