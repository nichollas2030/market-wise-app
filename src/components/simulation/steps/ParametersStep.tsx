import React from "react";
import { motion } from "framer-motion";
import {
  useSimulationStore,
  OPTIMIZATION_TYPES,
  TIMEFRAME_OPTIONS,
} from "../../../app/store/simulationStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Clock, Zap, Target, TrendingUp } from "lucide-react";

const ParametersStep: React.FC = () => {
  const { simulationParams, updateParams } = useSimulationStore();

  const handleOptimizationTypeChange = (type: string) => {
    updateParams({ optimizationType: type as any });
  };

  const handleTimeframeChange = (timeframe: string) => {
    updateParams({ timeframe: timeframe as any });
  };

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

  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Configurar Parâmetros
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Escolha o tipo de otimização e o período de análise
        </p>
      </div>

      {/* Optimization Type Selection */}
      <div className="space-y-4 flex-1 min-h-0">
        <div className="flex-1 min-h-0">
          <h3 className="text-base font-medium mb-3">Tipo de Otimização</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 h-full overflow-y-auto">
            {OPTIMIZATION_TYPES.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-fit"
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    simulationParams.optimizationType === type.id
                      ? "ring-2 ring-primary bg-primary/5 border-primary/50"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => handleOptimizationTypeChange(type.id)}
                >
                  <CardHeader className="pb-3 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">
                          {type.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-base truncate">
                            {type.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`text-xs mt-1 ${getComplexityColor(
                              type.complexity
                            )}`}
                          >
                            {type.complexity === "low"
                              ? "Fácil"
                              : type.complexity === "medium"
                              ? "Médio"
                              : "Avançado"}
                          </Badge>
                        </div>
                      </div>
                      {simulationParams.optimizationType === type.id && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                      {type.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Tempo estimado: {type.estimatedTime}s</span>
                      </div>

                      <div className="space-y-1">
                        {type.features.slice(0, 2).map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                        {type.features.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{type.features.length - 2} mais...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeframe Selection */}
        <div>
          <h3 className="text-base font-medium mb-3">Período de Análise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIMEFRAME_OPTIONS.map((timeframe) => (
              <motion.div
                key={timeframe.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    simulationParams.timeframe === timeframe.id
                      ? "ring-2 ring-primary bg-primary/5 border-primary/50"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => handleTimeframeChange(timeframe.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {timeframe.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">
                          {timeframe.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {timeframe.description}
                        </p>
                      </div>
                      {simulationParams.timeframe === timeframe.id && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <h4 className="font-medium text-sm">Otimização Inteligente</h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Nossos algoritmos analisam dados históricos para encontrar a
              melhor combinação de ativos baseada no seu perfil de risco.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
              <h4 className="font-medium text-sm">Performance Histórica</h4>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              A simulação usa dados reais de mercado dos últimos 12 meses para
              calcular retornos e riscos precisos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selected Configuration Summary */}
      {simulationParams.optimizationType && simulationParams.timeframe && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">
              Configuração Selecionada
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {
                  OPTIMIZATION_TYPES.find(
                    (t) => t.id === simulationParams.optimizationType
                  )?.name
                }
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {
                  TIMEFRAME_OPTIONS.find(
                    (t) => t.id === simulationParams.timeframe
                  )?.name
                }
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {
                  OPTIMIZATION_TYPES.find(
                    (t) => t.id === simulationParams.optimizationType
                  )?.estimatedTime
                }
                s
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParametersStep;
