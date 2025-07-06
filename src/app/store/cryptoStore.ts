import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CryptoAsset, CryptoFilters, LiveUpdateConfig, LiveUpdateStats, TopRankings } from '../../shared/api/types';

// Crypto Store Interface
interface CryptoState {
  // Selected cryptocurrencies
  selectedCryptos: string[];
  favorites: string[];
  
  // Search state
  searchQuery: string;
  searchHistory: string[];
  
  // Filters
  filters: CryptoFilters;
  activeFilters: number;
  
  // Live updates
  liveConfig: LiveUpdateConfig;
  liveStats: LiveUpdateStats;
  changedAssets: Map<string, number>; // assetId -> timestamp
  
  // Rankings cache
  rankings: TopRankings | null;
  
  // Actions
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  setSearchQuery: (query: string) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  updateFilters: (filters: Partial<CryptoFilters>) => void;
  resetFilters: () => void;
  
  updateLiveConfig: (config: Partial<LiveUpdateConfig>) => void;
  updateLiveStats: (stats: Partial<LiveUpdateStats>) => void;
  markAssetChanged: (assetId: string) => void;
  clearChangedAssets: () => void;
  
  updateRankings: (rankings: TopRankings) => void;
  
  selectCrypto: (id: string) => void;
  deselectCrypto: (id: string) => void;
  clearSelection: () => void;
}

// Default values
const defaultFilters: CryptoFilters = {
  search: '',
  priceRange: [0, 100000],
  marketCapRange: [1000000, 2000000000000],
  changeRange: [-50, 50],
  rankRange: [1, 100],
  onlyFavorites: false,
  preset: 'all',
};

const defaultLiveConfig: LiveUpdateConfig = {
  enabled: true,
  interval: 30000, // 30 seconds
  backgroundUpdates: true,
};

const defaultLiveStats: LiveUpdateStats = {
  totalAssets: 0,
  rising: 0,
  falling: 0,
  stable: 0,
  lastUpdate: 0,
  changedAssets: [],
};

// Create the store with persistence
export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedCryptos: [],
      favorites: [],
      searchQuery: '',
      searchHistory: [],
      filters: defaultFilters,
      activeFilters: 0,
      liveConfig: defaultLiveConfig,
      liveStats: defaultLiveStats,
      changedAssets: new Map(),
      rankings: null,

      // Favorites actions
      addToFavorites: (id: string) => {
        const { favorites } = get();
        if (!favorites.includes(id)) {
          set({ favorites: [...favorites, id] });
        }
      },

      removeFromFavorites: (id: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav !== id) });
      },

      toggleFavorite: (id: string) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          get().removeFromFavorites(id);
        } else {
          get().addToFavorites(id);
        }
      },

      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },

      // Search actions
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      addToSearchHistory: (query: string) => {
        const { searchHistory } = get();
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
          const newHistory = [trimmedQuery, ...searchHistory.slice(0, 9)]; // Keep last 10
          set({ searchHistory: newHistory });
        }
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      // Filter actions
      updateFilters: (newFilters: Partial<CryptoFilters>) => {
        const { filters } = get();
        const updatedFilters = { ...filters, ...newFilters };
        
        // Count active filters
        let activeCount = 0;
        if (updatedFilters.search) activeCount++;
        if (updatedFilters.onlyFavorites) activeCount++;
        if (updatedFilters.preset !== 'all') activeCount++;
        
        set({ 
          filters: updatedFilters, 
          activeFilters: activeCount 
        });
      },

      resetFilters: () => {
        set({ 
          filters: defaultFilters, 
          activeFilters: 0 
        });
      },

      // Live update actions
      updateLiveConfig: (config: Partial<LiveUpdateConfig>) => {
        const { liveConfig } = get();
        set({ liveConfig: { ...liveConfig, ...config } });
      },

      updateLiveStats: (stats: Partial<LiveUpdateStats>) => {
        const { liveStats } = get();
        set({ liveStats: { ...liveStats, ...stats } });
      },

      markAssetChanged: (assetId: string) => {
        const { changedAssets } = get();
        const newChangedAssets = new Map(changedAssets);
        newChangedAssets.set(assetId, Date.now());
        set({ changedAssets: newChangedAssets });
      },

      clearChangedAssets: () => {
        set({ changedAssets: new Map() });
      },

      // Rankings actions
      updateRankings: (rankings: TopRankings) => {
        set({ rankings });
      },

      // Selection actions
      selectCrypto: (id: string) => {
        const { selectedCryptos } = get();
        if (!selectedCryptos.includes(id)) {
          set({ selectedCryptos: [...selectedCryptos, id] });
        }
      },

      deselectCrypto: (id: string) => {
        const { selectedCryptos } = get();
        set({ selectedCryptos: selectedCryptos.filter(crypto => crypto !== id) });
      },

      clearSelection: () => {
        set({ selectedCryptos: [] });
      },
    }),
    {
      name: 'crypto-store',
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        liveConfig: state.liveConfig,
        filters: {
          ...state.filters,
          search: '', // Don't persist search query
        },
      }),
    }
  )
);