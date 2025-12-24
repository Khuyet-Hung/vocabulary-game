import { 
  ref, 
  onValue, 
  set, 
  push, 
  update, 
  remove, 
  get,
  Unsubscribe 
} from 'firebase/database';
import { database } from './config';
import { Room, Player, GameSettings } from '../types';
import { generateRoomCode } from '../utils/idGenerator';

export class RealtimeService {
  /**
   * Create a new room
   */
  static async createRoom(
    hostPlayer: Player,
    settings: GameSettings
  ): Promise<string> {
    try {
      const roomCode = generateRoomCode();
      const roomRef = ref(database, `rooms/${roomCode}`);
      
      const room: Room = {
        id: roomCode,
        hostId: hostPlayer.id,
        players: { [hostPlayer.id]: hostPlayer },
        status: 'waiting',
        gameMode: 'multiple-choice',
        currentQuestionIndex: 0,
        settings,
        createdAt: Date.now()
      };
      
      await set(roomRef, room);
      return roomCode;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }
  
  /**
   * Join an existing room
   */
  static async joinRoom(roomId: string, player: Player): Promise<boolean> {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await get(roomRef);
      
      if (!snapshot.exists()) {
        throw new Error('Phòng không tồn tại');
      }
      
      const room = snapshot.val() as Room;
      
      // Check room status
      if (room.status !== 'waiting') {
        throw new Error('Phòng đã bắt đầu chơi');
      }
      
      // Check max players
      const playerCount = Object.keys(room.players).length;
      if (playerCount >= room.settings.maxPlayers) {
        throw new Error('Phòng đã đầy');
      }
      
      // Add player to room
      await update(roomRef, {
        [`players/${player.id}`]: player
      });
      
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }
  
  /**
   * Listen to room updates
   */
  static listenToRoom(
    roomId: string,
    callback: (room: Room | null) => void
  ): Unsubscribe {
    const roomRef = ref(database, `rooms/${roomId}`);
    
    return onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as Room);
      } else {
        callback(null);
      }
    });
  }
  
  /**
   * Update player ready status
   */
  static async updatePlayerReady(
    roomId: string,
    playerId: string,
    isReady: boolean
  ): Promise<void> {
    try {
      const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`);
      await update(playerRef, { isReady });
    } catch (error) {
      console.error('Error updating player ready:', error);
      throw error;
    }
  }
  
  /**
   * Update game status
   */
  static async updateGameStatus(
    roomId: string,
    status: Room['status']
  ): Promise<void> {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const updateData: any = { status };
      
      if (status === 'playing') {
        updateData.startedAt = Date.now();
      } else if (status === 'finished') {
        updateData.finishedAt = Date.now();
      }
      
      await update(roomRef, updateData);
    } catch (error) {
      console.error('Error updating game status:', error);
      throw error;
    }
  }
  
  /**
   * Update current question index
   */
  static async updateCurrentQuestion(
    roomId: string,
    questionIndex: number
  ): Promise<void> {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      await update(roomRef, { currentQuestionIndex: questionIndex });
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }
  
  /**
   * Update player score
   */
  static async updatePlayerScore(
    roomId: string,
    playerId: string,
    score: number
  ): Promise<void> {
    try {
      const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`);
      await update(playerRef, { score });
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  }
  
  /**
   * Leave room
   */
  static async leaveRoom(roomId: string, playerId: string): Promise<void> {
    try {
      const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`);
      await remove(playerRef);
      
      // Check if room is empty
      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await get(roomRef);
      
      if (snapshot.exists()) {
        const room = snapshot.val() as Room;
        const remainingPlayers = Object.keys(room.players);
        
        // Delete room if empty
        if (remainingPlayers.length === 0) {
          await remove(roomRef);
        }
        // Transfer host if host left
        else if (room.hostId === playerId) {
          const newHostId = remainingPlayers[0];
          await update(roomRef, { hostId: newHostId });
        }
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }
  
  /**
   * Delete room
   */
  static async deleteRoom(roomId: string): Promise<void> {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      await remove(roomRef);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
}