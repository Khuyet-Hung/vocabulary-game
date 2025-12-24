export interface Player {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  isReady: boolean;
  joinedAt: number;
}

export interface GameSettings {
  maxPlayers: number;
  questionsCount: number;
  timePerQuestion: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface Room {
  id: string;
  hostId: string;
  players: Record<string, Player>;
  status: 'waiting' | 'playing' | 'finished';
  gameMode: string;
  currentQuestionIndex: number;
  settings: GameSettings;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export interface Word {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  pronunciation?: string;
}

export interface Question {
  id: string;
  word: Word;
  options: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'fill-blank' | 'flashcard' | 'matching';
  timeLimit?: number;
}

export interface GameResult {
  playerId: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeCompleted: number;
}