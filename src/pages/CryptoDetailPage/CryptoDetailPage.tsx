import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCryptoAsset } from '../../shared/api';
import { CryptoDetail } from '../../components/CryptoDetail';
import Header from '../../components/Header';

import { ReportModal } from '../../components/ReportModal';
import { LoadingState } from '../../shared/ui';
import { ArrowLeft, Home, Brain } from 'lucide-react';
import { Button } from '../../components/ui/button';

const CryptoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { data: crypto, isLoading, error } = useCryptoAsset(id || '', !!id);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-danger mb-4">Error Loading Crypto</h1>
            <p className="text-muted-foreground mb-6">
              Unable to load cryptocurrency details. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleGoHome}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingState text="Loading cryptocurrency details..." size="lg" />
        </div>
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">Crypto Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested cryptocurrency could not be found.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleGoHome}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
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
              <span className="text-white font-bold text-sm">{crypto.symbol.charAt(0)}</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {crypto.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Crypto Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CryptoDetail 
              crypto={crypto} 
              className="w-full"
            />
          </motion.div>
          
          {/* AI Analysis Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setIsReportModalOpen(true)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Brain className="w-5 h-5" />
              AI Analysis
            </Button>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {crypto && (
        <ReportModal
          cryptos={[crypto]}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CryptoDetailPage; 