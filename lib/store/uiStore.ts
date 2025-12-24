import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
  
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  toast: null,
  
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null })
}));