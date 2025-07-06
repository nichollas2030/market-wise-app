import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCryptoAssets } from '../../shared/api';
import { useCryptoStore, useUIStore } from '../../app/store';
import { LoadingState } from '../../shared/ui';
import SearchBar from '../../features/search/SearchBar';
import TopPricesWidget from '../../widgets/top-rankings/TopPricesWidget';
import TopVolumesWidget from '../../widgets/top-rankings/TopVolumesWidget';
import TopChangesWidget from '../../widgets/top-rankings/TopChangesWidget';
import { generateRankings } from '../../shared/lib/utils/formatters';

const HomePage: React.FC = () => {
  const { searchQuery, setSearchQuery, updateRankings } = useCryptoStore();
  const { theme, toggleTheme } = useUIStore();
  const { data: cryptos, isLoading, error } = useCryptoAssets();

  useEffect(() => {
    if (cryptos) {
      const rankings = generateRankings(cryptos);
      updateRankings(rankings);
    }
  }, [cryptos, updateRankings]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">₿</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient-primary">CryptoApp</h1>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-80 max-w-md"
              />
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 transition-smooth"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingState text="Loading cryptocurrency data..." size="lg" className="py-20" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Rankings Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gradient-primary">Market Rankings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TopPricesWidget cryptos={cryptos || []} loading={isLoading} />
                <TopVolumesWidget cryptos={cryptos || []} loading={isLoading} />
                <TopChangesWidget cryptos={cryptos || []} loading={isLoading} />
              </div>
            </section>

            {/* Live Status */}
            <section className="text-center">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Live data • {cryptos?.length || 0} cryptocurrencies
                </span>
              </motion.div>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default HomePage;