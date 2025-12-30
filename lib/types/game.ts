import { GameSettings } from "./game-settings";

export interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isActive: boolean;
  defaultSettings: GameSettings;
  createdAt: object;
}

export type CreateGame = Omit<Game, 'id'>;