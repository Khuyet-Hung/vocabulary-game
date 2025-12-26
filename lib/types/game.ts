export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  // avatar?: string;
  isReady: boolean;
  joinedAt: number;
}

export interface GameSettings {
  maxPlayers: number;
  timePerQuestion?: number;
  timeLimitPerGame?: number;
  // questionsCount: number;
  // difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
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