import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../shared/ui";
import { useCryptoAnalysis, useAgentFinanceHealth } from "../../shared/api";
import { Button } from "../../components/ui/button";
import {
  FileText,
  Download,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  BarChart3,
  Info,
  Brain,
  RefreshCw,
} from "lucide-react";
import type { CryptoAsset } from "../../shared/api/types";
import jsPDF from 'jspdf';

interface CryptoReportGeneratorProps {
  selectedCryptos: CryptoAsset[];
  onReportGenerated?: (report: string) => void;
  className?: string;
}

const CryptoReportGenerator: React.FC<CryptoReportGeneratorProps> = ({
  selectedCryptos,
  onReportGenerated,
  className,
}) => {
  const [showReport, setShowReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const { mutate: generateAnalysis, isPending, error } = useCryptoAnalysis();
  const {
    data: healthData,
    isLoading: loadingHealth,
    refetch: refetchHealth,
  } = useAgentFinanceHealth();

  const handleGenerateReport = () => {
    if (!selectedCryptos || selectedCryptos.length === 0) {
      return;
    }

    generateAnalysis(selectedCryptos, {
      onSuccess: (data) => {
        setGeneratedReport(data.report);
        setShowReport(true);
        onReportGenerated?.(data.report);
      },
    });
  };

  // Função para exportar relatório como PDF
  const handleExportPDF = () => {
    if (!generatedReport) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    // Simples: exporta texto puro (pode ser melhorado para HTML futuramente)
    doc.setFontSize(14);
    doc.text(generatedReport, 40, 60, { maxWidth: 515 });
    doc.save('ai-report.pdf');
  };

  const getHealthStatusIcon = () => {
    if (loadingHealth)
      return <Clock className="w-4 h-4 text-muted-foreground" />;
    return healthData?.status === "healthy" ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <XCircle className="w-4 h-4 text-danger" />
    );
  };

  const getHealthStatusText = () => {
    if (loadingHealth) return "Checking...";
    return healthData?.status === "healthy" ? "Healthy" : "Unhealthy";
  };

  const isServiceAvailable = healthData?.status === "healthy";
  const hasSelectedCryptos = selectedCryptos && selectedCryptos.length > 0;

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-primary">
          <FileText className="w-5 h-5" />
          Crypto Report Generator
          <Badge variant="info" size="sm" className="ml-auto">
            AGENTFINANCE
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Service Health Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              Service Status
            </div>
            <Button
              onClick={() => refetchHealth()}
              variant="ghost"
              size="sm"
              disabled={loadingHealth}
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingHealth ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg border">
            {getHealthStatusIcon()}
            <div className="flex-1">
              <div className="text-sm font-medium">{getHealthStatusText()}</div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            Performance
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Speed</div>
                <div className="text-sm font-semibold text-primary">2-5s</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <TrendingUp className="w-4 h-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Fallback</div>
                <div className="text-sm font-semibold text-success">Auto</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cryptos Summary */}
        {hasSelectedCryptos && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              Selected Cryptocurrencies ({selectedCryptos.length})
            </div>

            <div className="space-y-2">
              {selectedCryptos.map((crypto, index) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="text-sm font-medium">{crypto.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${parseFloat(crypto.priceUsd).toLocaleString()}
                    </div>
                    <div
                      className={`text-xs ${
                        parseFloat(crypto.changePercent24Hr) >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {parseFloat(crypto.changePercent24Hr) >= 0 ? "+" : ""}
                      {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Report Button + Export PDF */}
        <div className="space-y-3 flex flex-row items-center gap-2">
          <Button
            onClick={handleGenerateReport}
            disabled={isPending || !isServiceAvailable || !hasSelectedCryptos}
            className={`${!hasSelectedCryptos || !isServiceAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Report...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Report
              </>
            )}
          </Button>
          {/* Botão Exportar PDF */}
          {generatedReport && (
            <Button variant="outline" onClick={handleExportPDF}>
              Export as PDF
            </Button>
          )}
        </div>

          {!isServiceAvailable && !loadingHealth && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning">
                AGENTFINANCE service is not available. Please check the service
                status.
              </span>
            </div>
          )}

          {!hasSelectedCryptos && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-info/10 border border-info/20">
              <Info className="w-4 h-4 text-info" />
              <span className="text-sm text-info">
                Please select at least one cryptocurrency to generate a report.
              </span>
            </div>
          )}
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20"
            >
              <AlertCircle className="w-4 h-4 text-danger" />
              <span className="text-sm text-danger">
                {error.message || "Failed to generate report"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report Display */}
        <AnimatePresence>
          {showReport && generatedReport && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  Generated Report
                </div>
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-card/50 border border-border/50 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none text-foreground">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedReport}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CryptoReportGenerator;
