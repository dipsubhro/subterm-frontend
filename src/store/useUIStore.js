import { create } from "zustand";

const useUIStore = create((set, get) => ({
  // Mobile panel visibility
  mobileFilesVisible: false,
  mobileTerminalVisible: false,
  mobileGitHubVisible: false,
  moreMenuOpen: false,

  // Toast notifications
  toast: null, // { message: string, type: 'success' | 'error' }

  // Mobile panel toggle actions
  toggleMobileFiles: () =>
    set((state) => ({
      mobileFilesVisible: !state.mobileFilesVisible,
      mobileTerminalVisible: false,
      mobileGitHubVisible: false,
      moreMenuOpen: false,
    })),

  toggleMobileTerminal: () =>
    set((state) => ({
      mobileTerminalVisible: !state.mobileTerminalVisible,
      mobileFilesVisible: false,
      mobileGitHubVisible: false,
      moreMenuOpen: false,
    })),

  toggleMobileGitHub: () =>
    set((state) => ({
      mobileGitHubVisible: !state.mobileGitHubVisible,
      mobileFilesVisible: false,
      mobileTerminalVisible: false,
      moreMenuOpen: false,
    })),

  closeMobilePanels: () =>
    set({
      mobileFilesVisible: false,
      mobileTerminalVisible: false,
      mobileGitHubVisible: false,
      moreMenuOpen: false,
    }),

  setMobileFilesVisible: (visible) => set({ mobileFilesVisible: visible }),
  setMobileTerminalVisible: (visible) => set({ mobileTerminalVisible: visible }),
  setMobileGitHubVisible: (visible) => set({ mobileGitHubVisible: visible }),

  toggleMoreMenu: () =>
    set((state) => ({ moreMenuOpen: !state.moreMenuOpen })),

  setMoreMenuOpen: (open) => set({ moreMenuOpen: open }),

  // Toast actions
  showToast: (message, type = "success") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));

export default useUIStore;
