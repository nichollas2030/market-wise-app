import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  TrendingUp,
  Sun,
  Moon,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import SearchBar from "../../features/search/SearchBar";
import { useCryptoStore, useUIStore } from "../../app/store";
import { useIsMobile } from "../../hooks/use-mobile";
import type { CryptoAsset } from "../../shared/api/types";

interface HeaderProps {
  cryptos?: CryptoAsset[];
  onFilterChange?: (filters: any) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  cryptos = [],
  onFilterChange,
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useCryptoStore();
  const { theme, toggleTheme } = useUIStore();
  const isMobile = useIsMobile();

  // Estados responsivos
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Reset para tela inicial
  const handleHomeClick = () => {
    navigate("/");
    setSearchQuery("");
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
  };

  // Navegar para relatórios
  const handleReportsClick = () => {
    navigate("/reports");
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
  };

  // Abrir simulação de investimentos
  const handleSimulateInvestment = () => {
    navigate("/simulation");
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
  };

  // Alternar tema
  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Toggle search expansion (mobile)
  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    setIsMobileMenuOpen(false);
  };

  // Handler para mudanças de filtro com redirecionamento
  const handleFilterChange = (filters: any) => {
    // Redirecionar para HomePage se não estiver lá
    if (location.pathname !== "/") {
      navigate("/");
    }

    // Aplicar os filtros
    onFilterChange?.(filters);
  };

  // Fechar componentes ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
  }, [location.pathname]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        if (isMobile) {
          setIsSearchExpanded(false);
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
        setIsMobileMenuOpen(false);
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Detectar se está na tela inicial
  const isHomePage = location.pathname === "/";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 ${className}`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 h-14 sm:h-16 lg:h-18">
          {/* Lado Esquerdo - Logo e Navegação */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-shrink-0">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm lg:text-base">
                  ₿
                </span>
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent hidden sm:block">
                <span className="hidden lg:inline">CryptoApp</span>
                <span className="sm:block lg:hidden">Crypto</span>
              </h1>
            </motion.div>

            {/* Botões de Navegação */}
            <Button
              onClick={handleHomeClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 hover:bg-accent/50 transition-colors h-9 sm:h-10 lg:h-11 px-2 sm:px-3 min-h-[44px] touch-manipulation"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm lg:text-base">
                Home
              </span>
            </Button>
            <Button
              onClick={handleReportsClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 hover:bg-accent/50 transition-colors h-9 sm:h-10 lg:h-11 px-2 sm:px-3 min-h-[44px] touch-manipulation"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm lg:text-base">
                Reports
              </span>
            </Button>
            <Button
              onClick={handleSimulateInvestment}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 hover:bg-accent/50 transition-colors h-9 sm:h-10 lg:h-11 px-2 sm:px-3 min-h-[44px] touch-manipulation"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xl:inline text-sm lg:text-base">
                Simulate
              </span>
            </Button>
          </div>

          {/* Direita - SearchBar e Filtro */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div
              className={`transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-2 sm:mx-3 lg:mx-4 ${
                isMobile && !isSearchExpanded
                  ? "max-w-0 opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="w-full flex items-center gap-2" ref={searchRef}>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  cryptos={cryptos}
                  onFilterChange={handleFilterChange}
                  placeholder="Search crypto..."
                  className="w-full"
                />
              </div>
            </div>
            {/* Theme Toggle - sempre visível */}
            <Button
              onClick={handleThemeToggle}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-accent/50 transition-colors h-9 sm:h-10 lg:h-11 w-9 sm:w-10 lg:w-11 min-h-[44px] touch-manipulation"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
              <Button
                onClick={handleHomeClick}
                variant="ghost"
                className="w-full justify-start gap-2 sm:gap-3 h-12 text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Home
              </Button>

              <Button
                onClick={handleReportsClick}
                variant="ghost"
                className="w-full justify-start gap-2 sm:gap-3 h-12 text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                Reports
              </Button>

              <Button
                onClick={handleSimulateInvestment}
                variant="ghost"
                className="w-full justify-start gap-2 sm:gap-3 h-12 text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                Simulate Investment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
