import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Zap,
  Download,
  Share2,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  formatCurrency,
  formatPercent,
} from "../../../shared/lib/utils/formatters";
import type { SimulationResponse } from "../../../shared/api/types/simulation";

interface ResultsStepProps {
  result: SimulationResponse | null;
  onClose: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ result, onClose }) => {
  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center space-y-4 p-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold">Erro na Simulação</h3>
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar os resultados. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  const { portfolio, riskMetrics, request } = result;
  const { performance, allocations, metrics } = portfolio;

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getRiskColor = (value: number) => {
    if (value <= 0.1) return "text-green-600";
    if (value <= 0.2) return "text-yellow-600";
    return "text-red-600";
  };

  const handleDownloadReport = () => {
    // TODO: Implementar download do relatório
    console.log("Download report");
  };

  const handleShareResults = () => {
    // TODO: Implementar compartilhamento
    console.log("Share results");
  };

  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Resultados da Simulação
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Otimização concluída com sucesso
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            className="flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Baixar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareResults}
            className="flex-1 sm:flex-none"
          >
            <Share2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Compartilhar</span>
            <span className="sm:hidden">Compartilhar</span>
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Retorno Total
                </p>
                <p
                  className={`text-lg sm:text-2xl font-bold ${getPerformanceColor(
                    performance.totalReturn
                  )} truncate`}
                >
                  {formatPercent(performance.totalReturn)}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Retorno Anualizado
                </p>
                <p
                  className={`text-lg sm:text-2xl font-bold ${getPerformanceColor(
                    performance.annualizedReturn
                  )} truncate`}
                >
                  {formatPercent(performance.annualizedReturn)}
                </p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Sharpe Ratio
                </p>
                <p
                  className={`text-lg sm:text-2xl font-bold ${getPerformanceColor(
                    performance.sharpeRatio
                  )} truncate`}
                >
                  {performance.sharpeRatio.toFixed(2)}
                </p>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Max Drawdown
                </p>
                <p
                  className={`text-lg sm:text-2xl font-bold ${getPerformanceColor(
                    -performance.maxDrawdown
                  )} truncate`}
                >
                  {formatPercent(-performance.maxDrawdown)}
                </p>
              </div>
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0 overflow-y-auto">
        {/* Investment Summary */}
        <Card>
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Resumo do Investimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Investimento Inicial
                </p>
                <p className="text-sm sm:text-lg font-semibold truncate">
                  {formatCurrency(metrics.startValue)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Valor Final
                </p>
                <p className="text-sm sm:text-lg font-semibold truncate">
                  {formatCurrency(metrics.endValue)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Lucro Total
                </p>
                <p
                  className={`text-sm sm:text-lg font-semibold ${getPerformanceColor(
                    metrics.totalProfit
                  )} truncate`}
                >
                  {formatCurrency(metrics.totalProfit)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  % de Lucro
                </p>
                <p
                  className={`text-sm sm:text-lg font-semibold ${getPerformanceColor(
                    metrics.profitPercentage
                  )} truncate`}
                >
                  {formatPercent(metrics.profitPercentage)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium">
                  Progresso do Investimento
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {formatPercent(metrics.profitPercentage)}
                </span>
              </div>
              <Progress
                value={Math.max(
                  0,
                  Math.min(100, metrics.profitPercentage * 100)
                )}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Metrics */}
        <Card>
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Métricas de Risco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Volatilidade
                </p>
                <p
                  className={`text-sm sm:text-lg font-semibold ${getRiskColor(
                    performance.volatility
                  )} truncate`}
                >
                  {formatPercent(performance.volatility)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Win Rate
                </p>
                <p className="text-sm sm:text-lg font-semibold text-green-600 truncate">
                  {formatPercent(performance.winRate)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  VaR (95%)
                </p>
                <p
                  className={`text-sm sm:text-lg font-semibold ${getRiskColor(
                    riskMetrics.var95
                  )} truncate`}
                >
                  {formatPercent(riskMetrics.var95)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Beta</p>
                <p className="text-sm sm:text-lg font-semibold truncate">
                  {riskMetrics.beta.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Allocation */}
      <Card>
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Alocação da Carteira
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {allocations.map((allocation) => (
              <div key={allocation.coinId} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {allocation.symbol}
                    </span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {formatPercent(allocation.weight)}
                    </Badge>
                  </div>
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {formatCurrency(allocation.amount)}
                  </span>
                </div>
                <Progress value={allocation.weight * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base">Configuração Utilizada</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground">Otimização</p>
              <p className="font-medium truncate">
                {request.optimizationType.replace("_", " ").toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Período</p>
              <p className="font-medium truncate">
                {request.timeframe.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Criptomoedas</p>
              <p className="font-medium truncate">{request.coins.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button onClick={onClose} className="flex-1 h-12 sm:h-10">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Concluir</span>
          <span className="sm:hidden">Concluir</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadReport}
          className="flex-1 h-12 sm:h-10"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Baixar Relatório</span>
          <span className="sm:hidden">Baixar</span>
        </Button>
      </div>
    </div>
  );
};

export default ResultsStep;
