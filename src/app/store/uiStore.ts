import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UI Store Interface
interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals
  modals: {
    aiAnalysis: {
      open: boolean;
      cryptoId?: string;
      loading: boolean;
      data?: string;
      error?: string;
    };
    filters: {
      open: boolean;
    };
    cryptoDetail: {
      open: boolean;
      cryptoId?: string;
    };
  };
  
  // Notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>;
  
  // Loading states
  loading: {
    cryptos: boolean;
    analysis: boolean;
    search: boolean;
  };
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  
  setModalData: (modal: keyof UIState['modals'], data: any) => void;
  setModalLoading: (modal: keyof UIState['modals'], loading: boolean) => void;
  setModalError: (modal: keyof UIState['modals'], error?: string) => void;
  
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;
}

// Create the UI store with persistence
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      sidebarCollapsed: false,
      
      modals: {
        aiAnalysis: {
          open: false,
          loading: false,
        },
        filters: {
          open: false,
        },
        cryptoDetail: {
          open: false,
        },
      },
      
      toasts: [],
      
      loading: {
        cryptos: false,
        analysis: false,
        search: false,
      },

      // Theme actions
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // System theme
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', isDark);
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        get().setTheme(newTheme);
      },

      // Sidebar actions
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleSidebar: () => {
        const { sidebarOpen } = get();
        set({ sidebarOpen: !sidebarOpen });
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      // Modal actions
      openModal: (modal, data) => {
        const { modals } = get();
        set({
          modals: {
            ...modals,
            [modal]: {
              ...modals[modal],
              open: true,
              ...(data || {}),
            },
          },
        });
      },

      closeModal: (modal) => {
        const { modals } = get();
        set({
          modals: {
            ...modals,
            [modal]: {
              ...modals[modal],
              open: false,
              loading: false,
              error: undefined,
            },
          },
        });
      },

      closeAllModals: () => {
        const { modals } = get();
        const closedModals = Object.keys(modals).reduce((acc, key) => {
          acc[key as keyof typeof modals] = {
            ...modals[key as keyof typeof modals],
            open: false,
            loading: false,
            error: undefined,
          };
          return acc;
        }, {} as typeof modals);
        
        set({ modals: closedModals });
      },

      setModalData: (modal, data) => {
        const { modals } = get();
        set({
          modals: {
            ...modals,
            [modal]: {
              ...modals[modal],
              ...data,
            },
          },
        });
      },

      setModalLoading: (modal, loading) => {
        const { modals } = get();
        set({
          modals: {
            ...modals,
            [modal]: {
              ...modals[modal],
              loading,
            },
          },
        });
      },

      setModalError: (modal, error) => {
        const { modals } = get();
        set({
          modals: {
            ...modals,
            [modal]: {
              ...modals[modal],
              error,
              loading: false,
            },
          },
        });
      },

      // Toast actions
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto remove toast after duration
        const duration = toast.duration || (toast.type === 'error' ? 5000 : 3000);
        setTimeout(() => {
          get().removeToast(id);
        }, duration);

        return id;
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter(toast => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      // Loading actions
      setLoading: (key, loading) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: loading,
          },
        }));
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);