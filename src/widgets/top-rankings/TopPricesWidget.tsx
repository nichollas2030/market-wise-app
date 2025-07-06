import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../shared/ui';
import { formatCryptoPrice } from '../../shared/lib/utils/formatters';
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👑 Top 5 Highest Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                  <div className="space-y-1">
                    <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                    <div className="w-8 h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
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
          👑 Top 5 Highest Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topPrices.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-smooth"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <Badge 
                  variant={index === 0 ? 'warning' : index === 1 ? 'info' : 'default'}
                  className="min-w-6 h-6 justify-center"
                >
                  {index + 1}
                </Badge>
                <div>
                  <p className="font-semibold text-sm">{crypto.name}</p>
                  <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{formatCryptoPrice(crypto.priceUsd)}</p>
                <Badge 
                  variant={parseFloat(crypto.changePercent24Hr) >= 0 ? 'success' : 'danger'}
                  size="sm"
                >
                  {parseFloat(crypto.changePercent24Hr) >= 0 ? '+' : ''}{parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPricesWidget;