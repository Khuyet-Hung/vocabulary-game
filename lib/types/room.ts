import { GameSettings } from "./game-settings";
import { CreatePlayer, Player } from "./player";

export interface Room {
    id: string;
    players: Record<string, boolean>;
    hostPlayerId: string;
    status: 'waiting' | 'playing' | 'finished';
    gameId: string;
    gameSettings: Record<string, any>;
    createdAt: object;
    startedAt?: object;
    finishedAt?: object;
    expiredAt?: object;
}

export type CreateRoom = Omit<Room, 'id'>;