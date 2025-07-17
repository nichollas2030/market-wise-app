import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCryptoAssets } from '../../shared/api';
import { CryptoReportGenerator } from '../../components/CryptoReportGenerator';
import { APIStatus } from '../../components/APIStatus';
import { CryptoItem } from '../../components/CryptoItem';
import { Badge } from '../../shared/ui';
import { Button } from '../../components/ui/button';
import { LoadingState } from '../../shared/ui';
import { ArrowLeft, Home, Check, X, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CryptoAsset } from '../../shared/api/types';
import { ReportModal } from '../../components/ReportModal';
import Header from '../../components/Header';


const ReportGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: cryptos, isLoading, error, refetch } = useCryptoAssets();
  const [selectedCryptos, setSelectedCryptos] = useState<CryptoAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'rising' | 'falling'>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Filter and search cryptos
  const filteredCryptos = useMemo(() => {
    if (!cryptos) return [];
    
    let filtered = cryptos;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(crypto => {
        const change = parseFloat(crypto.changePercent24Hr);
        return filterType === 'rising' ? change > 0 : change < 0;
      });
    }
    
    return filtered.slice(0, 30); // Limit to 30 for performance
  }, [cryptos, searchQuery, filterType]);

  const handleCryptoSelect = (crypto: CryptoAsset) => {
    const isSelected = selectedCryptos.some(c => c.id === crypto.id);
    if (isSelected) {
      setSelectedCryptos(selectedCryptos.filter(c => c.id !== crypto.id));
    } else {
      // Limit to 10 cryptos for optimal API performance
      if (selectedCryptos.length >= 10) {
        alert('Maximum 10 cryptocurrencies can be selected for analysis. Please remove some selections first.');
        return;
      }
      setSelectedCryptos([...selectedCryptos, crypto]);
    }
  };

  const handleClearSelection = () => {
    setSelectedCryptos([]);
  };

  const handleRemoveCrypto = (cryptoId: string) => {
    setSelectedCryptos(selectedCryptos.filter(c => c.id !== cryptoId));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReportGenerated = (report: string) => {
    // Optional: Add any post-generation logic here
    console.log('Report generated successfully');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-danger mb-2">Error Loading Data</h1>
          <p className="text-muted-foreground mb-6">
            Unable to load cryptocurrency data. Please check your connection and try again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => refetch()} variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleGoHome}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <Header />
      
      {/* Page Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Report Generator
              </h1>
            </div>
          </div>
          
          <APIStatus />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <LoadingState text="Loading cryptocurrency data..." size="lg" className="py-20" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Crypto Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gradient-primary">
                  Select Cryptocurrencies ({selectedCryptos.length}/10)
                </h2>
                {selectedCryptos.length > 0 && (
                  <Button
                    onClick={handleClearSelection}
                    variant="outline"
                    size="sm"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === 'rising' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('rising')}
                    className="flex items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    Rising
                  </Button>
                  <Button
                    variant={filterType === 'falling' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('falling')}
                    className="flex items-center gap-1"
                  >
                    <TrendingDown className="w-3 h-3" />
                    Falling
                  </Button>
                </div>
              </div>

              {/* Selected Cryptos Display */}
              <AnimatePresence>
                {selectedCryptos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-medium text-muted-foreground">Selected:</h3>
                    <div className="space-y-2">
                      {selectedCryptos.map((crypto, index) => (
                        <motion.div
                          key={crypto.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="default" size="sm">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="text-sm font-medium">{crypto.name}</div>
                              <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleRemoveCrypto(crypto.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Crypto List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCryptos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No cryptocurrencies found matching your criteria.</p>
                  </div>
                ) : (
                  filteredCryptos.map((crypto, index) => {
                    const isSelected = selectedCryptos.some(c => c.id === crypto.id);
                    return (
                      <motion.div
                        key={crypto.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`relative flex items-center cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleCryptoSelect(crypto)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCryptoSelect(crypto)}
                            onClick={e => e.stopPropagation()}
                            className="form-checkbox h-5 w-5 text-primary border-primary mr-3 ml-2"
                          />
                          <CryptoItem 
                            crypto={crypto} 
                            rank={index + 1}
                            className="rounded-lg flex-1"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Selection Status */}
              <AnimatePresence>
                {selectedCryptos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-lg bg-success/10 border border-success/20"
                  >
                    <div className="flex items-center gap-2 text-success">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">
                        {selectedCryptos.length} cryptocurrency{selectedCryptos.length > 1 ? 'ies' : 'y'} selected
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Ready to generate AI analysis report
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Report Generator */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gradient-primary">
                AI Report Generator
              </h2>
              
              <Button
                onClick={() => setIsReportModalOpen(true)}
                disabled={selectedCryptos.length === 0}
                className={`w-full ${selectedCryptos.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                size="lg"
              >
                Generate AI Report
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <ReportModal
        cryptos={selectedCryptos}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default ReportGeneratorPage; 