import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCryptoAssets, useFilteredCryptos } from '../../shared/api';
import { useCryptoStore } from '../../app/store';
import { LoadingState } from '../../shared/ui';

import { APIStatus } from '../../components/APIStatus';
import Header from '../../components/Header';
import SearchResults from '../../components/SearchResults';
import TopPricesWidget from '../../widgets/top-rankings/TopPricesWidget';
import TopVolumesWidget from '../../widgets/top-rankings/TopVolumesWidget';
import TopChangesWidget from '../../widgets/top-rankings/TopChangesWidget';
import { generateRankings } from '../../shared/lib/utils/formatters';
import { Button } from '../../components/ui/button';
import { X } from 'lucide-react';

const HomePage: React.FC = () => {
  const { searchQuery, setSearchQuery, updateRankings } = useCryptoStore();
  const { data: cryptos, isLoading, error } = useCryptoAssets();
  
  // Estado dos filtros avançados
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: [0, 100000] as [number, number],
    marketCapRange: [0, 2000000000000] as [number, number],
    changeRange: [-50, 50] as [number, number],
    category: 'all' as 'all' | 'rising' | 'falling' | 'stable'
  });
  
  // Filtrar criptomoedas baseado na busca e filtros
  const filteredCryptos = useFilteredCryptos(
    cryptos || [], 
    searchQuery, 
    advancedFilters
  );

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
      {/* Header Fixo */}
      <Header 
        cryptos={cryptos || []}
        onFilterChange={(filters) => {
          setAdvancedFilters({
            priceRange: filters.priceRange,
            marketCapRange: filters.marketCapRange,
            changeRange: filters.changeRange,
            category: filters.category
          });
        }}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {isLoading ? (
          <LoadingState text="Loading cryptocurrency data..." size="lg" className="py-12 sm:py-16 lg:py-20" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:space-y-8 lg:space-y-10"
          >
            {/* Search Results or Rankings Section */}
            {(searchQuery || advancedFilters.category !== 'all') ? (
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-primary">
                    {searchQuery 
                      ? `Search Results for "${searchQuery}"`
                      : `${advancedFilters.category.charAt(0).toUpperCase() + advancedFilters.category.slice(1)} Cryptocurrencies`
                    }
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setAdvancedFilters({
                        priceRange: [0, 100000],
                        marketCapRange: [0, 2000000000000],
                        changeRange: [-50, 50],
                        category: 'all'
                      });
                    }}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Clear Filters</span>
                  </Button>
                </div>
                <SearchResults 
                  cryptos={filteredCryptos} 
                  searchQuery={searchQuery || 'filtered'} 
                  loading={isLoading} 
                />
              </section>
            ) : (
              <section>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gradient-primary">Market Rankings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <TopPricesWidget cryptos={cryptos || []} loading={isLoading} />
                  <TopVolumesWidget cryptos={cryptos || []} loading={isLoading} />
                  <TopChangesWidget cryptos={cryptos || []} loading={isLoading} />
                </div>
              </section>
            )}
            {/* Live Status */}
            <section className="text-center">
              <motion.div
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 glass rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Live data • {(searchQuery || advancedFilters.category !== 'all') 
                    ? `${filteredCryptos.length} results` 
                    : `${cryptos?.length || 0} cryptocurrencies`
                  }
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