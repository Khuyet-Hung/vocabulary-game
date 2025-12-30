import { serverTimestamp } from "firebase/database";
import { CreateGame } from "../../types";

// lib/seed-games.ts
export const GAMES: Record<string, CreateGame> = {
    "word_match": {
        name: 'Word Match',
        description: 'Match words with their meanings in this fun vocabulary game.',
        thumbnail: '/games/word_match.jpg',
        isActive: true,
        defaultSettings: {
            timeLimit: 60,
            difficulty: 'easy',
            maxPlayers: 12,
            minPlayers: 4,
        },
        createdAt: serverTimestamp(),
    }
}