import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../shared/ui';
import { formatPercent, formatCryptoPrice } from '../../shared/lib/utils/formatters';
import type { CryptoAsset } from '../../shared/api/types';

interface TopChangesWidgetProps {
  cryptos: CryptoAsset[];
  loading?: boolean;
}

const TopChangesWidget: React.FC<TopChangesWidgetProps> = ({ cryptos, loading }) => {
  const topChanges = [...cryptos]
    .sort((a, b) => Math.abs(parseFloat(b.changePercent24Hr)) - Math.abs(parseFloat(a.changePercent24Hr)))
    .slice(0, 5);

  if (loading) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Top 5 Price Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                  <div className="space-y-1">
                    <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                    <div className="w-20 h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-12 h-6 bg-muted rounded animate-pulse" />
                </div>
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
          🚀 Top 5 Price Changes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topChanges.map((crypto, index) => {
            const change = parseFloat(crypto.changePercent24Hr);
            const isPositive = change >= 0;
            
            return (
              <motion.div
                key={crypto.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-smooth ${
                  isPositive 
                    ? 'bg-success/5 border border-success/20 hover:bg-success/10' 
                    : 'bg-danger/5 border border-danger/20 hover:bg-danger/10'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={index < 2 ? (isPositive ? 'success' : 'danger') : 'outline'}
                    className="min-w-6 h-6 justify-center animate-pulse-glow"
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold text-sm">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                    <p className="text-xs font-medium">{formatCryptoPrice(crypto.priceUsd)}</p>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">
                      {isPositive ? '↗️' : '↘️'}
                    </span>
                    <Badge 
                      variant={isPositive ? 'success' : 'danger'}
                      size="md"
                      pulse={index < 2}
                      className="font-bold"
                    >
                      {formatPercent(change)}
                    </Badge>
                  </div>
                  
                  <motion.div
                    className={`text-xs px-2 py-1 rounded-full ${
                      isPositive 
                        ? 'bg-success/20 text-success' 
                        : 'bg-danger/20 text-danger'
                    }`}
                    animate={{ 
                      scale: index < 2 ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: index < 2 ? Infinity : 0,
                      ease: 'easeInOut' 
                    }}
                  >
                    {Math.abs(change) > 10 ? 'MAJOR MOVE' : 'ACTIVE'}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopChangesWidget;