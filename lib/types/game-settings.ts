export type GameSettings =
    | WordMatchSettings

interface WordMatchSettings {
    timeLimit: number;
    minPlayers: number;
    maxPlayers: number;
    difficulty: 'easy' | 'medium' | 'hard';
}