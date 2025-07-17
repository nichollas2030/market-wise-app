import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../shared/ui';
import { formatPercent, formatCryptoPrice } from '../../shared/lib/utils/formatters';
import { CryptoItem } from '../../components/CryptoItem';
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
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            🚀 Top 5 Price Changes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-card/30">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded animate-pulse flex-shrink-0" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="w-12 sm:w-16 h-3 sm:h-4 bg-muted rounded animate-pulse" />
                    <div className="w-16 sm:w-20 h-2 sm:h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right space-y-1 flex-shrink-0 ml-2">
                  <div className="w-12 sm:w-16 h-3 sm:h-4 bg-muted rounded animate-pulse" />
                  <div className="w-10 sm:w-12 h-4 sm:h-6 bg-muted rounded animate-pulse" />
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
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg text-gradient-primary">
          🚀 Top 5 Price Changes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {topChanges.map((crypto, index) => {
            const change = parseFloat(crypto.changePercent24Hr);
            const isPositive = change >= 0;
            
            return (
              <motion.div
                key={crypto.id}
                className="space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <CryptoItem 
                  crypto={crypto} 
                  rank={index + 1}
                  className={`w-full ${
                    isPositive 
                      ? 'bg-success/5 border border-success/20 hover:bg-success/10' 
                      : 'bg-danger/5 border border-danger/20 hover:bg-danger/10'
                  }`}
                />
                
                <motion.div
                  className={`text-xs px-2 py-1 rounded-full text-center ${
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
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopChangesWidget;