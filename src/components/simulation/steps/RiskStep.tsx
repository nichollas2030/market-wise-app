import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useSimulationStore,
  RISK_TOLERANCE_OPTIONS,
} from "../../../app/store/simulationStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { Badge } from "../../ui/badge";
import {
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react";
import { formatCurrency } from "../../../shared/lib/utils/formatters";
import { Button } from "../../ui/button";

const RiskStep: React.FC = () => {
  const { simulationParams, updateParams, selectedCoins } =
    useSimulationStore();
  const [investmentInput, setInvestmentInput] = useState(
    simulationParams.initialInvestment?.toString() || "10000"
  );

  const handleInvestmentChange = (value: string) => {
    setInvestmentInput(value);
    const numValue = parseFloat(value) || 0;
    if (numValue > 0) {
      updateParams({ initialInvestment: numValue });
    }
  };

  const handleRiskToleranceChange = (tolerance: string) => {
    updateParams({ riskTolerance: tolerance as any });
  };

  const handleSliderChange = (value: number[]) => {
    const investment = value[0];
    setInvestmentInput(investment.toString());
    updateParams({ initialInvestment: investment });
  };

  const getRiskDescription = (tolerance: string) => {
    switch (tolerance) {
      case "conservative":
        return "Foco em preservação de capital com baixo risco e retornos moderados";
      case "moderate":
        return "Equilíbrio entre risco e retorno, ideal para a maioria dos investidores";
      case "aggressive":
        return "Maximização de retorno com maior tolerância a volatilidade";
      default:
        return "";
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

  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Configurar Risco
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Ajuste o investimento inicial e sua tolerância ao risco
        </p>
      </div>

      {/* Investment Amount Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium mb-3">Valor do Investimento</h3>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Investment Input */}
                <div className="space-y-2">
                  <Label htmlFor="investment" className="text-sm font-medium">
                    Investimento Inicial (USD)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="investment"
                      type="number"
                      value={investmentInput}
                      onChange={(e) => handleInvestmentChange(e.target.value)}
                      className="pl-10 h-12 sm:h-10"
                      placeholder="10000"
                      min="100"
                      step="100"
                    />
                  </div>
                </div>

                {/* Investment Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">$1,000</span>
                    <span className="font-medium">
                      {formatCurrency(parseFloat(investmentInput) || 0)}
                    </span>
                    <span className="text-muted-foreground">$100,000</span>
                  </div>
                  <Slider
                    value={[parseFloat(investmentInput) || 10000]}
                    onValueChange={handleSliderChange}
                    max={100000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2">
                  {[1000, 5000, 10000, 25000, 50000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleInvestmentChange(amount.toString())}
                      className={`text-xs h-8 ${
                        parseFloat(investmentInput) === amount
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Tolerance Section */}
        <div>
          <h3 className="text-base font-medium mb-3">Tolerância ao Risco</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RISK_TOLERANCE_OPTIONS.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    simulationParams.riskTolerance === option.id
                      ? "ring-2 ring-primary bg-primary/5 border-primary/50"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => handleRiskToleranceChange(option.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          option.id === "conservative"
                            ? "bg-green-100 text-green-600"
                            : option.id === "moderate"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {option.id === "conservative" ? (
                          <Shield className="w-4 h-4" />
                        ) : option.id === "moderate" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base mb-1">
                          {option.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {option.description}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRiskColor(option.id)}`}
                        >
                          {option.riskLevel}
                        </Badge>
                      </div>
                      {simulationParams.riskTolerance === option.id && (
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

      {/* Selected Configuration Summary */}
      {simulationParams.riskTolerance && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">Configuração de Risco</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                {formatCurrency(simulationParams.initialInvestment || 0)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {
                  RISK_TOLERANCE_OPTIONS.find(
                    (t) => t.id === simulationParams.riskTolerance
                  )?.name
                }
              </Badge>
              <Badge variant="outline" className="text-xs">
                {
                  RISK_TOLERANCE_OPTIONS.find(
                    (t) => t.id === simulationParams.riskTolerance
                  )?.riskLevel
                }
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {getRiskDescription(simulationParams.riskTolerance)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">
                Sobre Tolerância ao Risco
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Sua tolerância ao risco determina como o algoritmo distribuirá
                os ativos. Perfis conservadores priorizam estabilidade, enquanto
                perfis agressivos buscam maximizar retornos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskStep;
