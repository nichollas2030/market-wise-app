import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/ui";
import { CryptoItem } from "../CryptoItem";
import type { CryptoAsset } from "../../shared/api/types";
import {
  Search,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import SearchLoading from "../SearchLoading";

interface SearchResultsProps {
  cryptos: CryptoAsset[];
  searchQuery: string;
  loading?: boolean;
}

type SortField = "name" | "price" | "marketCap" | "change" | "volume";
type SortOrder = "asc" | "desc";

const SearchResults: React.FC<SearchResultsProps> = ({
  cryptos,
  searchQuery,
  loading = false,
}) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Estatísticas dos resultados
  const stats = useMemo(() => {
    const total = cryptos.length;
    const rising = cryptos.filter(
      (c) => parseFloat(c.changePercent24Hr) > 0
    ).length;
    const falling = cryptos.filter(
      (c) => parseFloat(c.changePercent24Hr) < 0
    ).length;
    const stable = cryptos.filter((c) => {
      const change = parseFloat(c.changePercent24Hr);
      return change >= -1 && change <= 1;
    }).length;

    return { total, rising, falling, stable };
  }, [cryptos]);

  // Criptomoedas ordenadas
  const sortedCryptos = useMemo(() => {
    return [...cryptos].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.priceUsd);
          bValue = parseFloat(b.priceUsd);
          break;
        case "marketCap":
          aValue = parseFloat(a.marketCapUsd);
          bValue = parseFloat(b.marketCapUsd);
          break;
        case "change":
          aValue = parseFloat(a.changePercent24Hr);
          bValue = parseFloat(b.changePercent24Hr);
          break;
        case "volume":
          aValue = parseFloat(a.volumeUsd24Hr);
          bValue = parseFloat(b.volumeUsd24Hr);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [cryptos, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <Card variant="glass" className="w-full">
        <CardContent className="p-4 sm:p-6">
          <SearchLoading searchQuery={searchQuery} />
        </CardContent>
      </Card>
    );
  }

  if (!searchQuery.trim()) {
    return null;
  }

  if (cryptos.length === 0) {
    return (
      <Card variant="glass" className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg text-gradient-primary">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No results found
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              No cryptocurrencies found matching "{searchQuery}"
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Try searching by name, symbol, or ID
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg text-gradient-primary">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">Search Results for "{searchQuery}"</span>
            <span className="text-xs sm:text-sm text-muted-foreground font-normal flex-shrink-0">
              ({cryptos.length} {cryptos.length === 1 ? "result" : "results"})
            </span>
          </CardTitle>

          {/* Controles de visualização */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="text-xs h-8 sm:h-9 px-2 sm:px-3"
            >
              {viewMode === "list" ? "Grid" : "List"}
            </Button>
          </div>
        </div>

        {/* Estatísticas dos resultados */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-success">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{stats.rising} rising</span>
          </div>
          <div className="flex items-center gap-1 text-danger">
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{stats.falling} falling</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{stats.stable} stable</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Controles de ordenação */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 sm:p-3 glass rounded-lg">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[
              { field: "name" as SortField, label: "Name" },
              { field: "price" as SortField, label: "Price" },
              { field: "marketCap" as SortField, label: "Market Cap" },
              { field: "change" as SortField, label: "Change" },
              { field: "volume" as SortField, label: "Volume" },
            ].map(({ field, label }) => (
              <Button
                key={field}
                variant={sortField === field ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSort(field)}
                className="text-xs h-6 sm:h-7 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
                {sortField === field &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="w-3 h-3 ml-1" />
                  ) : (
                    <SortDesc className="w-3 h-3 ml-1" />
                  ))}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de resultados */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              : "space-y-2 sm:space-y-3"
          }`}
        >
          {sortedCryptos.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CryptoItem crypto={crypto} className="w-full" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
