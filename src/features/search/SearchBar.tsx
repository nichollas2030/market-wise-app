import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Filter,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useCryptoStore } from "../../app/store";
import { useIsMobile } from "../../hooks/use-mobile";
import type { CryptoAsset } from "../../shared/api/types";
import NumberInputStepper from "../../components/ui/NumberInputStepper";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  cryptos?: CryptoAsset[];
  onFilterChange?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  search: string;
  priceRange: [number, number];
  marketCapRange: [number, number];
  changeRange: [number, number];
  category: "all" | "rising" | "falling" | "stable";
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search cryptocurrencies...",
  className,
  cryptos = [],
  onFilterChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    search: value,
    priceRange: [0, 100000],
    marketCapRange: [0, 2000000000000],
    changeRange: [-50, 50],
    category: "all",
  });
  const { searchHistory, addToSearchHistory } = useCryptoStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sugestões populares de criptomoedas
  const popularCryptos = [
    "Bitcoin",
    "Ethereum",
    "Cardano",
    "Solana",
    "Polkadot",
    "Dogecoin",
    "Chainlink",
    "Polygon",
    "Avalanche",
    "Cosmos",
  ];

  // Autocomplete baseado nos dados reais
  const autocompleteSuggestions = useMemo(() => {
    if (!value.trim() || !cryptos.length) return [];

    const query = value.toLowerCase();
    return cryptos
      .filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(query) ||
          crypto.symbol.toLowerCase().includes(query) ||
          crypto.id.toLowerCase().includes(query)
      )
      .slice(0, 8)
      .map((crypto) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: parseFloat(crypto.priceUsd),
        change: parseFloat(crypto.changePercent24Hr),
      }));
  }, [value, cryptos]);

  // Função para redirecionar para HomePage se necessário
  const ensureHomePageNavigation = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSearch = (query: string) => {
    onChange(query);
    if (query.trim()) {
      addToSearchHistory(query);
    }
    setShowSuggestions(false);
    inputRef.current?.blur();

    // Redirecionar para HomePage se não estiver lá
    ensureHomePageNavigation();
  };

  const handleClear = () => {
    onChange("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      handleSearch(value);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);

    // Redirecionar para HomePage se não estiver lá
    ensureHomePageNavigation();
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
    setShowSuggestions(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        if (isMobile) {
          setShowFilters(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Barra de busca principal responsiva */}
      <div className="relative">
        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary z-10">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setFocused(false);
            // Delay to allow clicking on suggestions
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-8 sm:pl-12 pr-16 sm:pr-20 h-9 sm:h-10 lg:h-12 text-sm sm:text-base glass border-2 transition-all duration-300 ${
            focused
              ? "ring-2 sm:ring-4 ring-primary/20 border-primary/50 shadow-lg shadow-primary/20"
              : "border-white/20 hover:border-white/40"
          } ${value ? "bg-white/10" : "bg-white/5"}`}
        />

        {/* Botão de filtros */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFilterToggle}
          className={`absolute right-8 sm:right-12 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 p-0 transition-all z-10 ${
            showFilters ? "bg-primary/20 text-primary" : "hover:bg-white/10"
          }`}
        >
          <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>

        {/* Botão de limpar */}
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 p-0 hover:bg-white/10 z-10"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>

      {/* Painel de filtros responsivo */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`${
              isMobile
                ? "fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
                : "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-white/20 rounded-lg shadow-2xl z-50 p-3 sm:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            }`}
          >
            {/* Header do modal (mobile) */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Conteúdo dos filtros */}
            <div
              className={`space-y-4 ${
                isMobile ? "flex-1 overflow-y-auto p-4" : ""
              }`}
            >
              {!isMobile && (
                <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                </h3>
              )}

              {/* Filtro por categoria */}
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: "all", label: "All", icon: "📊" },
                    { value: "rising", label: "Rising", icon: "📈" },
                    { value: "falling", label: "Falling", icon: "📉" },
                    { value: "stable", label: "Stable", icon: "➡️" },
                  ].map((category) => (
                    <button
                      key={category.value}
                      onClick={() =>
                        handleFilterChange({ category: category.value as any })
                      }
                      className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded text-xs sm:text-sm transition-all border-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 min-h-[44px] touch-manipulation
                        ${
                          filters.category === category.value
                            ? "bg-primary/10 text-primary border-primary"
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-primary/5"
                        }
                      `}
                      aria-pressed={filters.category === category.value}
                    >
                      <span className="text-lg sm:text-xl mb-1">
                        {category.icon}
                      </span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por faixa de preço e variação: só para rising, falling, stable */}
              {(filters.category === "rising" ||
                filters.category === "falling" ||
                filters.category === "stable") && (
                <>
                  {/* Filtro por faixa de preço */}
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Price Range (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <NumberInputStepper
                        value={filters.priceRange[0]}
                        min={0}
                        max={filters.priceRange[1]}
                        step={1}
                        prefix="$"
                        onChange={(val) =>
                          handleFilterChange({
                            priceRange: [val, filters.priceRange[1]],
                          })
                        }
                      />
                      <NumberInputStepper
                        value={filters.priceRange[1]}
                        min={filters.priceRange[0]}
                        step={1}
                        prefix="$"
                        onChange={(val) =>
                          handleFilterChange({
                            priceRange: [filters.priceRange[0], val],
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Filtro por variação */}
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Change Range (%)
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <NumberInputStepper
                        value={filters.changeRange[0]}
                        max={filters.changeRange[1]}
                        step={0.01}
                        suffix="%"
                        onChange={(val) =>
                          handleFilterChange({
                            changeRange: [val, filters.changeRange[1]],
                          })
                        }
                      />
                      <NumberInputStepper
                        value={filters.changeRange[1]}
                        min={filters.changeRange[0]}
                        step={0.01}
                        suffix="%"
                        onChange={(val) =>
                          handleFilterChange({
                            changeRange: [filters.changeRange[0], val],
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Botões de ação (mobile) */}
              {isMobile && (
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const resetFilters = {
                        search: value,
                        priceRange: [0, 100000],
                        marketCapRange: [0, 2000000000000],
                        changeRange: [-50, 50],
                        category: "all",
                      };
                      setFilters(resetFilters);
                      onFilterChange?.(resetFilters);
                      ensureHomePageNavigation();
                    }}
                    className="flex-1 h-12"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 h-12"
                  >
                    Apply Filters
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sugestões melhoradas com autocomplete */}
      <AnimatePresence>
        {showSuggestions && !showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${
              isMobile
                ? "fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
                : "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-white/20 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto"
            }`}
          >
            {/* Header do modal (mobile) */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Results
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Conteúdo das sugestões */}
            <div className={`${isMobile ? "flex-1 overflow-y-auto" : ""}`}>
              {/* Autocomplete baseado na digitação */}
              {autocompleteSuggestions.length > 0 && (
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Sparkles className="w-4 h-4" />
                    Quick Search
                  </div>
                  <div className="space-y-1">
                    {autocompleteSuggestions.map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => handleSearch(crypto.name)}
                        className="w-full text-left px-3 py-2 sm:py-3 rounded hover:bg-white/10 transition-colors group min-h-[44px] touch-manipulation"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center text-xs font-bold text-white">
                              {crypto.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-sm sm:text-base">
                                {crypto.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {crypto.symbol}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatPrice(crypto.price)}
                            </div>
                            <div
                              className={`text-xs ${
                                crypto.change >= 0
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              {formatChange(crypto.change)}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Histórico de busca */}
              {searchHistory.length > 0 && (
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    Recent searches
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 3).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(query)}
                        className="w-full text-left px-3 py-2 sm:py-3 rounded hover:bg-white/10 text-sm sm:text-base transition-colors flex items-center gap-2 min-h-[44px] touch-manipulation"
                      >
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Criptomoedas populares */}
              <div className="p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular cryptocurrencies
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {popularCryptos.map((crypto) => (
                    <button
                      key={crypto}
                      onClick={() => handleSearch(crypto)}
                      className="text-left px-3 py-2 sm:py-3 rounded hover:bg-white/10 text-sm sm:text-base transition-colors flex items-center gap-2 min-h-[44px] touch-manipulation"
                    >
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      {crypto}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
