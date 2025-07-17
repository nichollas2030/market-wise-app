import React from 'react';
import { motion } from 'framer-motion';
import { useCryptoAssets } from '../../shared/api';
import { CryptoDetail } from './index';
import { LoadingState } from '../../shared/ui';

interface CryptoDetailListProps {
  limit?: number;
  className?: string;
}

const CryptoDetailList: React.FC<CryptoDetailListProps> = ({ 
  limit = 6, 
  className 
}) => {
  const { data: cryptos, isLoading, error } = useCryptoAssets({ limit });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-2">Error Loading Data</h1>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState text="Loading cryptocurrency data..." size="lg" />
      </div>
    );
  }

  if (!cryptos || cryptos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-2">No Data Available</h1>
          <p className="text-muted-foreground">No cryptocurrency data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">
          Cryptocurrency Details
        </h2>
        <p className="text-muted-foreground">
          Detailed KPIs and market information for top cryptocurrencies
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {cryptos.map((crypto, index) => (
          <motion.div
            key={crypto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <CryptoDetail 
              crypto={crypto} 
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Showing {cryptos.length} of the top cryptocurrencies by market cap</p>
      </motion.div>
    </div>
  );
};

export default CryptoDetailList; 