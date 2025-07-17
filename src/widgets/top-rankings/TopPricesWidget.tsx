import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui';
import { CryptoItem } from '../../components/CryptoItem';
import type { CryptoAsset } from '../../shared/api/types';

interface TopPricesWidgetProps {
  cryptos: CryptoAsset[];
  loading?: boolean;
}

const TopPricesWidget: React.FC<TopPricesWidgetProps> = ({ cryptos, loading }) => {
  const topPrices = [...cryptos]
    .sort((a, b) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd))
    .slice(0, 5);

  if (loading) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            👑 Top 5 Highest Prices
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded animate-pulse flex-shrink-0" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="w-12 sm:w-16 h-3 sm:h-4 bg-muted rounded animate-pulse" />
                    <div className="w-6 sm:w-8 h-2 sm:h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-16 sm:w-20 h-3 sm:h-4 bg-muted rounded animate-pulse flex-shrink-0" />
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
          👑 Top 5 Highest Prices
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {topPrices.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CryptoItem 
                crypto={crypto} 
                rank={index + 1}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPricesWidget;