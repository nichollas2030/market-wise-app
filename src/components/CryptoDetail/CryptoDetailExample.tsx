import React from 'react';
import { motion } from 'framer-motion';
import { useCryptoAssets } from '../../shared/api';
import { CryptoDetail } from './index';
import { LoadingState } from '../../shared/ui';

const CryptoDetailExample: React.FC = () => {
  const { data: cryptos, isLoading, error } = useCryptoAssets({ limit: 1 });

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

  const bitcoin = cryptos?.[0]; // Bitcoin is usually the first one

  if (!bitcoin) {
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
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gradient-primary mb-8 text-center">
            Crypto Detail Example
          </h1>
          
          <CryptoDetail 
            crypto={bitcoin} 
            className="w-full"
          />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>This is an example of the CryptoDetail component showing detailed KPIs for {bitcoin.name}.</p>
            <p className="mt-2">The component includes price, market cap, volume, supply information, and more.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoDetailExample; 