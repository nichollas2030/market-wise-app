import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ChevronLeft, ChevronRight, X, Check, Menu } from "lucide-react";
import { useSimulationStore } from "../../app/store/simulationStore";
import { usePortfolioSimulation } from "../../shared/api/hooks/useSimulation";
import { simulationUtils } from "../../shared/api/services/simulationService";
import type { SimulationRequest } from "../../shared/api/types/simulation";

// Import steps
import CoinSelectionStep from "./steps/CoinSelectionStep";
import ParametersStep from "./steps/ParametersStep";
import RiskStep from "./steps/RiskStep";
import PreviewStep from "./steps/PreviewStep";
import ResultsStep from "./steps/ResultsStep";

interface SimulationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimulationWizard: React.FC<SimulationWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedCoins,
    simulationParams,
    currentStep,
    isWizardOpen,
    setWizardOpen,
    setCurrentStep,
    nextStep,
    previousStep,
    canProceedToNextStep,
    canGoToPreviousStep,
    resetWizard,
  } = useSimulationStore() as any;

  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const simulationMutation = usePortfolioSimulation();

  // Steps configuration with mobile-optimized titles
  const steps = [
    {
      id: 0,
      title: "Selecionar Criptomoedas",
      shortTitle: "Criptomoedas",
      description: "Escolha as criptomoedas para sua carteira",
      shortDescription: "Escolha 2-20 criptomoedas",
    },
    {
      id: 1,
      title: "Configurar Parâmetros",
      shortTitle: "Parâmetros",
      description: "Defina o tipo de otimização e período",
      shortDescription: "Tipo de otimização e período",
    },
    {
      id: 2,
      title: "Configurar Risco",
      shortTitle: "Risco",
      description: "Ajuste o investimento e tolerância ao risco",
      shortDescription: "Investimento e tolerância ao risco",
    },
    {
      id: 3,
      title: "Preview",
      shortTitle: "Preview",
      description: "Revise suas configurações",
      shortDescription: "Revise configurações",
    },
    {
      id: 4,
      title: "Resultados",
      shortTitle: "Resultados",
      description: "Visualize a otimização da carteira",
      shortDescription: "Visualize otimização",
    },
  ];

  const handleClose = () => {
    setWizardOpen(false);
    resetWizard();
    setSimulationResult(null);
    setIsProcessing(false);
    setShowMobileMenu(false);
    onClose();
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Executar simulação
      await runSimulation();
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const runSimulation = async () => {
    if (!canProceedToNextStep()) return;

    setIsProcessing(true);

    try {
      const request: SimulationRequest = {
        coins: selectedCoins.map((coin) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
        })),
        dateRange: {
          startDate: new Date(
            Date.now() - 365 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 ano atrás
          endDate: new Date().toISOString(),
        },
        timeframe: simulationParams.timeframe || "daily",
        optimizationType: simulationParams.optimizationType || "sharpe",
        riskTolerance: simulationParams.riskTolerance,
        initialInvestment: simulationParams.initialInvestment || 10000,
      };

      const result = await simulationMutation.mutateAsync(request);
      setSimulationResult(result);
      nextStep();
    } catch (error) {
      console.error("Simulation error:", error);
      // TODO: Mostrar toast de erro
    } finally {
      setIsProcessing(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="
        flex flex-col min-h-0 w-[95vw] max-w-none h-[95vh] max-h-[95vh] overflow-y-auto
        sm:w-[90vw] sm:max-w-4xl sm:h-[98vh] sm:max-h-[98vh] sm:overflow-y-auto
        lg:w-[85vw] lg:max-w-6xl lg:h-[98vh] lg:max-h-[98vh] lg:overflow-y-auto
        xl:w-[80vw] xl:max-w-7xl xl:h-[98vh] xl:max-h-[98vh] xl:overflow-y-auto
        p-0 sm:p-6 
        gap-0 sm:gap-4
        "
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          maxHeight: "98vh",
          overflowY: "auto",
        }}
      >
        {/* Mobile Header - Only visible on mobile */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">
                {currentStepData?.shortTitle}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {currentStepData?.shortDescription}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Header - Fixed */}
        <DialogHeader className="hidden sm:block pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold">
              Simulação de Investimentos
            </DialogTitle>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Passo {currentStep + 1} de {steps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{currentStepData?.title}</span>
            <span>{currentStepData?.description}</span>
          </div>
        </DialogHeader>

        {/* Mobile Progress - Only visible on mobile */}
        <div className="sm:hidden px-4 py-2 bg-muted/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>
              Passo {currentStep + 1} de {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Mobile Step Menu */}
        {showMobileMenu && (
          <div className="sm:hidden border-b bg-muted/30">
            <div className="p-4 space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStep(index);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        index === currentStep
                          ? "bg-primary-foreground text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {step.shortTitle}
                      </div>
                      <div className="text-xs opacity-80 truncate">
                        {step.shortDescription}
                      </div>
                    </div>
                    {index === currentStep && (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area - FLEXIBLE, SCROLLABLE */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full px-4 sm:px-0"
            >
              {currentStep === 0 && <CoinSelectionStep />}
              {currentStep === 1 && <ParametersStep />}
              {currentStep === 2 && <RiskStep />}
              {currentStep === 3 && <PreviewStep />}
              {currentStep === 4 && (
                <ResultsStep result={simulationResult} onClose={handleClose} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation - Fixed Footer on Desktop */}
        {currentStep < 4 && (
          <div
            className="
            flex flex-col sm:flex-row items-stretch sm:items-center justify-between 
            gap-3 sm:gap-2 pt-4 border-t 
            px-4 sm:px-0
            flex-shrink-0 bg-background
            "
            style={{ zIndex: 10 }}
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoToPreviousStep()}
              className="
                flex items-center justify-center gap-2 
                h-12 sm:h-10
                order-2 sm:order-1
              "
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">Voltar</span>
            </Button>

            <div
              className="
              flex flex-col sm:flex-row items-stretch sm:items-center 
              gap-2 
              order-1 sm:order-2
            "
            >
              {currentStep < 3 && (
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="h-12 sm:h-10"
                >
                  <span className="hidden sm:inline">Cancelar</span>
                  <span className="sm:hidden">Cancelar</span>
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={!canProceedToNextStep() || isProcessing}
                className="
                  flex items-center justify-center gap-2 
                  h-12 sm:h-10
                  flex-1 sm:flex-none
                "
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Processando...</span>
                    <span className="sm:hidden">Processando</span>
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <span className="hidden sm:inline">Executar Simulação</span>
                    <span className="sm:hidden">Executar</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Próximo</span>
                    <span className="sm:hidden">Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SimulationWizard;
