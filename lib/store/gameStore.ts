import { create } from 'zustand';
import { Player, Room } from '../types';

interface GameState {
  // Current player
  currentPlayer: Player | null;
  
  // Current room
  currentRoom: Room | null;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setCurrentPlayer: (player: Player | null) => void;
  setCurrentRoom: (room: Room | null) => void;
  setIsLoading: (loading: boolean) => void;
  updatePlayerScore: (playerId: string, points: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPlayer: null,
  currentRoom: null,
  isLoading: false,
  
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  
  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  updatePlayerScore: (playerId, points) => set((state) => {
    if (!state.currentRoom) return state;
    
    const updatedPlayers = { ...state.currentRoom.players };
    if (updatedPlayers[playerId]) {
      updatedPlayers[playerId].score += points;
    }
    
    return {
      currentRoom: {
        ...state.currentRoom,
        players: updatedPlayers
      }
    };
  }),
  
  resetGame: () => set({
    currentPlayer: null,
    currentRoom: null,
    isLoading: false
  })
}));