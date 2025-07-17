import React from "react";
import { motion } from "framer-motion";
import {
  useSimulationStore,
  OPTIMIZATION_TYPES,
  TIMEFRAME_OPTIONS,
  RISK_TOLERANCE_OPTIONS,
} from "../../../app/store/simulationStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Check,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  AlertTriangle,
  Info,
} from "lucide-react";
import { formatCurrency } from "../../../shared/lib/utils/formatters";

const PreviewStep: React.FC = () => {
  const { selectedCoins, simulationParams } = useSimulationStore();

  const optimizationType = OPTIMIZATION_TYPES.find(
    (t) => t.id === simulationParams.optimizationType
  );
  const timeframe = TIMEFRAME_OPTIONS.find(
    (t) => t.id === simulationParams.timeframe
  );
  const riskTolerance = RISK_TOLERANCE_OPTIONS.find(
    (t) => t.id === simulationParams.riskTolerance
  );

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getRiskColor = (tolerance: string) => {
    switch (tolerance) {
      case "conservative":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "moderate":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "aggressive":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const isConfigurationValid = () => {
    return (
      selectedCoins.length >= 2 &&
      selectedCoins.length <= 20 &&
      simulationParams.initialInvestment &&
      simulationParams.initialInvestment >= 100 &&
      simulationParams.optimizationType &&
      simulationParams.timeframe &&
      simulationParams.riskTolerance
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Preview da Simulação
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Revise suas configurações antes de executar a simulação
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4 flex-1 min-h-0 overflow-y-auto">
        {/* Selected Coins */}
        <Card>
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Criptomoedas Selecionadas ({selectedCoins.length}/20)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex flex-wrap gap-2">
              {selectedCoins.map((coin) => (
                <Badge
                  key={coin.id}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  <span className="truncate max-w-[60px] sm:max-w-[80px]">
                    {coin.symbol}
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Configuration */}
        <Card>
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Configuração de Otimização
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Tipo de Otimização
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{optimizationType?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {optimizationType?.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-1 ${getComplexityColor(
                          optimizationType?.complexity || "low"
                        )}`}
                      >
                        {optimizationType?.complexity === "low"
                          ? "Fácil"
                          : optimizationType?.complexity === "medium"
                          ? "Médio"
                          : "Avançado"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Período de Análise
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{timeframe?.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{timeframe?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {timeframe?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Investimento</h4>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-lg">
                      {formatCurrency(simulationParams.initialInvestment || 0)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Tolerância ao Risco
                  </h4>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        riskTolerance?.id === "conservative"
                          ? "bg-green-100 text-green-600"
                          : riskTolerance?.id === "moderate"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {riskTolerance?.id === "conservative" ? (
                        <Shield className="w-3 h-3" />
                      ) : riskTolerance?.id === "moderate" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {riskTolerance?.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRiskColor(
                          riskTolerance?.id || "moderate"
                        )}`}
                      >
                        {riskTolerance?.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Estimates */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Estimativas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {optimizationType?.estimatedTime}s
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Tempo Estimado
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedCoins.length}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Ativos na Carteira
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {optimizationType?.complexity === "low"
                    ? "Alto"
                    : optimizationType?.complexity === "medium"
                    ? "Médio"
                    : "Baixo"}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Nível de Confiança
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        <Card
          className={
            isConfigurationValid()
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
              : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {isConfigurationValid() ? (
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">
                  {isConfigurationValid()
                    ? "Configuração Válida"
                    : "Configuração Incompleta"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isConfigurationValid()
                    ? "Todas as configurações estão corretas. Você pode prosseguir com a simulação."
                    : "Por favor, complete todas as configurações antes de continuar."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Sobre a Simulação</h4>
              <p className="text-xs text-muted-foreground">
                A simulação usará dados históricos dos últimos 12 meses para
                calcular a otimização da carteira. O processo pode levar alguns
                segundos dependendo da complexidade do algoritmo selecionado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewStep;
