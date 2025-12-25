import { create } from 'zustand';
import { Player } from '../types';

interface UIState {
    currentPlayer: Player | null;
    isLoading: boolean;
    setCurrentPlayer: (player: Player | null) => void;
    setIsLoading: (loading: boolean) => void;
    reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    currentPlayer: null,
    isLoading: false,

    setCurrentPlayer: (player) => set({ currentPlayer: player }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    reset: () => set({
        currentPlayer: null,
        isLoading: false,
    }),
}));
