import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../shared/ui';
import { formatVolume } from '../../shared/lib/utils/formatters';
import type { CryptoAsset } from '../../shared/api/types';

interface TopVolumesWidgetProps {
  cryptos: CryptoAsset[];
  loading?: boolean;
}

const TopVolumesWidget: React.FC<TopVolumesWidgetProps> = ({ cryptos, loading }) => {
  const topVolumes = [...cryptos]
    .sort((a, b) => parseFloat(b.volumeUsd24Hr) - parseFloat(a.volumeUsd24Hr))
    .slice(0, 5);

  const maxVolume = topVolumes.length > 0 ? parseFloat(topVolumes[0].volumeUsd24Hr) : 1;

  if (loading) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Top 5 Trading Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                    <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                </div>
                <div className="w-full h-2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="h-full hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-primary">
          📊 Top 5 Trading Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topVolumes.map((crypto, index) => {
            const volume = parseFloat(crypto.volumeUsd24Hr);
            const percentage = (volume / maxVolume) * 100;
            
            return (
              <motion.div
                key={crypto.id}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="info"
                      size="sm"
                      className="min-w-6 h-6 justify-center"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <span className="font-semibold text-sm">{crypto.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{crypto.symbol}</span>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-primary">{formatVolume(volume)}</p>
                </div>
                
                <div className="relative">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-shimmer" />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Liquidity: High</span>
                  <span>{percentage.toFixed(1)}% of max</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopVolumesWidget;