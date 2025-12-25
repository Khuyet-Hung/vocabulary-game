import { GameSettings, Player } from "./game";

export interface Room {
    id: string;
    hostPlayer: Player;
    players: Player[];
    status: 'waiting' | 'playing' | 'finished';
    gameMode: string;
    settings: GameSettings;
    createdAt: any;
    startedAt?: any;
    finishedAt?: any;
    expiredAt?: any;
}

export type CreateRoom = Omit<Room, 'id' | 'startedAt' | 'finishedAt' | 'expiredAt'>;