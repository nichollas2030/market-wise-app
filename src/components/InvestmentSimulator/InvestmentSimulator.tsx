import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, X } from 'lucide-react';
import type { CryptoAsset } from '../../shared/api/types';

interface InvestmentSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  cryptos?: CryptoAsset[];
}

interface SimulationResult {
  initialInvestment: number;
  finalValue: number;
  profit: number;
  profitPercentage: number;
  cryptoName: string;
  cryptoSymbol: string;
  currentPrice: number;
  projectedPrice: number;
}

const InvestmentSimulator: React.FC<InvestmentSimulatorProps> = ({
  isOpen,
  onClose,
  cryptos = []
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState<string>('1000');
  const [timePeriod, setTimePeriod] = useState<string>('30');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const timePeriods = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' }
  ];

  const calculateSimulation = () => {
    if (!selectedCrypto || !investmentAmount) return;

    const crypto = cryptos.find(c => c.id === selectedCrypto);
    if (!crypto) return;

    const amount = parseFloat(investmentAmount);
    const currentPrice = parseFloat(crypto.priceUsd);
    const dailyChange = parseFloat(crypto.changePercent24Hr);
    const days = parseInt(timePeriod);

    // Simulação simples baseada na mudança diária média
    const dailyChangeRate = dailyChange / 100;
    const projectedChangeRate = Math.pow(1 + dailyChangeRate, days);
    const projectedPrice = currentPrice * projectedChangeRate;
    
    const finalValue = amount * projectedChangeRate;
    const profit = finalValue - amount;
    const profitPercentage = (profit / amount) * 100;

    setSimulationResult({
      initialInvestment: amount,
      finalValue,
      profit,
      profitPercentage,
      cryptoName: crypto.name,
      cryptoSymbol: crypto.symbol,
      currentPrice,
      projectedPrice
    });
  };

  useEffect(() => {
    if (selectedCrypto && investmentAmount && timePeriod) {
      calculateSimulation();
    }
  }, [selectedCrypto, investmentAmount, timePeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Investment Simulator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cryptocurrency Selection */}
              <div className="space-y-2">
                <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptos.slice(0, 20).map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{crypto.symbol}</span>
                          <span className="text-muted-foreground">- {crypto.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            ${parseFloat(crypto.priceUsd).toFixed(2)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Investment Amount */}
              <div className="space-y-2">
                <Label htmlFor="investment-amount">Investment Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="investment-amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="1000"
                    className="pl-10"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Time Period */}
              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period</Label>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timePeriods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {period.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <AnimatePresence>
            {simulationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`border-2 ${
                  simulationResult.profit >= 0 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' 
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {simulationResult.profit >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Crypto Info */}
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <h4 className="font-semibold">{simulationResult.cryptoName}</h4>
                        <p className="text-sm text-muted-foreground">{simulationResult.cryptoSymbol}</p>
                      </div>
                      <Badge variant="outline">
                        Current: {formatCurrency(simulationResult.currentPrice)}
                      </Badge>
                    </div>

                    {/* Investment Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Initial Investment</Label>
                        <p className="text-2xl font-bold">{formatCurrency(simulationResult.initialInvestment)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Final Value</Label>
                        <p className="text-2xl font-bold">{formatCurrency(simulationResult.finalValue)}</p>
                      </div>
                    </div>

                    {/* Profit/Loss */}
                    <div className="p-4 bg-background rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-muted-foreground">Profit/Loss</Label>
                          <p className={`text-2xl font-bold ${
                            simulationResult.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(simulationResult.profit)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm text-muted-foreground">Percentage</Label>
                          <p className={`text-2xl font-bold ${
                            simulationResult.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(simulationResult.profitPercentage)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ This is a simplified simulation based on historical data. 
                        Cryptocurrency markets are highly volatile and past performance 
                        does not guarantee future results. Always do your own research 
                        and consider consulting with a financial advisor.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={calculateSimulation}
              disabled={!selectedCrypto || !investmentAmount}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Calculate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentSimulator; 