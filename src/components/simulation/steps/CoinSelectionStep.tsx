import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCryptoAssets } from "../../../shared/api";
import { useSimulationStore } from "../../../app/store/simulationStore";
import { CryptoItem } from "../../CryptoItem";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Search,
  Plus,
  X,
  Check,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { CryptoAsset } from "../../../shared/api/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";

const CoinSelectionStep: React.FC = () => {
  // Hook de dados: garantir limite de 100
  const { data: cryptos, isLoading, error } = useCryptoAssets({ limit: 100 });
  const { selectedCoins, setSelectedCoins } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "rising" | "falling">(
    "all"
  );
  const [panelOpen, setPanelOpen] = useState(false);

  // Filtrar criptomoedas
  const filteredCryptos = useMemo(() => {
    if (!cryptos) return [];

    let filtered = cryptos;

    // Aplicar filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar filtro de tipo
    if (filterType !== "all") {
      filtered = filtered.filter((crypto) => {
        const change = parseFloat(crypto.changePercent24Hr);
        return filterType === "rising" ? change > 0 : change < 0;
      });
    }

    // Remover slice para mostrar todas as criptos disponíveis
    return filtered;
  }, [cryptos, searchQuery, filterType]);

  const handleCoinSelect = (crypto: CryptoAsset) => {
    const isSelected = selectedCoins.some((c) => c.id === crypto.id);
    if (isSelected) {
      setSelectedCoins(selectedCoins.filter((c) => c.id !== crypto.id));
    } else {
      // Limitar a 20 criptomoedas para otimização
      if (selectedCoins.length >= 20) {
        alert(
          "Máximo 20 criptomoedas podem ser selecionadas para simulação. Remova algumas seleções primeiro."
        );
        return;
      }
      setSelectedCoins([...selectedCoins, crypto]);
    }
  };

  const handleRemoveCoin = (cryptoId: string) => {
    setSelectedCoins(selectedCoins.filter((c) => c.id !== cryptoId));
  };

  const handleClearSelection = () => {
    setSelectedCoins([]);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center space-y-4 p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold">Erro ao carregar dados</h3>
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar as criptomoedas. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* Header */}
      <div className="space-y-2 sm:space-y-3 flex-shrink-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Selecionar Criptomoedas
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Escolha entre 2 e 20 criptomoedas para sua carteira otimizada
          </p>
        </div>

        {/* Painel Colapsável Unificado: Selecionadas + Filtros */}
        <div className="mb-2">
          <button
            className={`w-full flex items-center justify-between px-4 sm:px-6 py-2 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors font-medium text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 group`}
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold">
                Criptomoedas Selecionadas
              </span>
              <span className="inline-flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground rounded px-2 py-0.5 ml-2">
                {selectedCoins.length}/20
              </span>
            </span>
            <span className="flex items-center gap-2 text-primary">
              <span className="text-xs font-medium group-hover:underline">
                {panelOpen ? "Recolher" : "Expandir"}
              </span>
              {panelOpen ? (
                <ChevronUp className="w-5 h-5 transition-transform duration-200 rotate-180" />
              ) : (
                <ChevronDown className="w-5 h-5 transition-transform duration-200" />
              )}
            </span>
          </button>
          {panelOpen && (
            <div className="p-4 pt-2 sm:p-6 sm:pt-2 bg-background border-x border-b border-primary/30 rounded-b-lg space-y-3 animate-fade-in">
              {/* Selecionadas */}
              <div className="flex flex-wrap gap-2 max-h-[60px] overflow-y-auto">
                {selectedCoins.map((coin) => (
                  <Badge
                    key={coin.id}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs px-2 py-1"
                  >
                    <span className="truncate max-w-[60px] sm:max-w-[80px]">
                      {coin.symbol}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCoin(coin.id)}
                      className="h-4 w-4 p-0 hover:bg-red-100 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedCoins.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    className="text-xs h-8 w-full sm:w-auto ml-2"
                  >
                    Limpar Tudo
                  </Button>
                )}
              </div>
              {/* Filtros */}
              <div className="flex flex-col gap-2 sm:gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar criptomoedas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 sm:h-10"
                  />
                </div>
                <div className="flex gap-2 mt-0">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                    className="text-xs h-9 flex-1 sm:flex-none"
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filterType === "rising" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("rising")}
                    className="text-xs h-9 text-green-600 flex-1 sm:flex-none"
                  >
                    Subindo
                  </Button>
                  <Button
                    variant={filterType === "falling" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("falling")}
                    className="text-xs h-9 text-red-600 flex-1 sm:flex-none"
                  >
                    Caindo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Crypto List - sempre visível, ocupa todo espaço restante */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-16 sm:h-14 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCryptos.map((crypto) => {
              const isSelected = selectedCoins.some((c) => c.id === crypto.id);

              return (
                <motion.div
                  key={crypto.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 shadow-md"
                        : "bg-card hover:bg-accent/50 border-border"
                    }`}
                    onClick={() => handleCoinSelect(crypto)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CryptoItem crypto={crypto} className="flex-1" />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCoinSelect(crypto);
                        }}
                        className="flex-shrink-0 h-8 w-8 p-0"
                      >
                        {isSelected ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinSelectionStep;
