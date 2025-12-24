# Phase 2: Core Infrastructure

⏱️ **Thời gian**: 3-4 giờ  
🎯 **Mục tiêu**: Xây dựng các service cốt lõi - Google Sheets import, Realtime, Game logic

---

## 📋 Phase 2 Checklist

- [ ] Google Sheets import service
- [ ] Firebase Realtime service
- [ ] Game logic utilities
- [ ] Tailwind mobile configuration
- [ ] Question generator
- [ ] Test services

---

## Step 2.1: Google Sheets Import Service

### 1. Create Sheets Import Service

```typescript
// lib/utils/sheetsImport.ts

import Papa from 'papaparse';

export interface SheetWord {
  word: string;
  meaning: string;
  example?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Convert Google Sheets share URL to CSV export URL
 */
export function convertToCSVUrl(shareUrl: string): string {
  // From: https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
  // To: https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
  
  const sheetIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch) {
    throw new Error('Invalid Google Sheets URL');
  }
  
  const sheetId = sheetIdMatch[1];
  const gidMatch = shareUrl.match(/gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';
  
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

/**
 * Import words from Google Sheets
 */
export async function importFromGoogleSheets(
  sheetUrl: string
): Promise {
  try {
    const csvUrl = convertToCSVUrl(sheetUrl);
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Google Sheets data');
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          const words = results.data.filter((row) => 
            row.word && row.meaning
          );
          resolve(words);
        },
        error: (error) => {
          reject(new Error(`Parse error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error importing from Google Sheets:', error);
    throw error;
  }
}

/**
 * Validate imported words
 */
export function validateWords(words: SheetWord[]): {
  valid: SheetWord[];
  invalid: Array;
} {
  const valid: SheetWord[] = [];
  const invalid: Array = [];
  
  words.forEach((word, index) => {
    if (!word.word || word.word.trim() === '') {
      invalid.push({ row: index + 2, reason: 'Missing word' });
      return;
    }
    
    if (!word.meaning || word.meaning.trim() === '') {
      invalid.push({ row: index + 2, reason: 'Missing meaning' });
      return;
    }
    
    valid.push({
      ...word,
      word: word.word.trim(),
      meaning: word.meaning.trim(),
      example: word.example?.trim(),
      category: word.category?.trim(),
      difficulty: word.difficulty || 'medium'
    });
  });
  
  return { valid, invalid };
}
```

### 2. Create Firebase Words Service

```typescript
// lib/firebase/wordsService.ts

import { ref, set, get, push } from 'firebase/database';
import { database } from './config';
import { SheetWord } from '../utils/sheetsImport';
import { Word } from '../types';

/**
 * Save words to Firebase
 */
export async function saveWordsToFirebase(
  words: SheetWord[],
  category: string = 'default'
): Promise {
  try {
    const wordsRef = ref(database, `words/${category}`);
    
    // Convert to Word format with IDs
    const wordsData: Record = {};
    words.forEach((word) => {
      const id = `word_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      wordsData[id] = {
        id,
        word: word.word,
        meaning: word.meaning,
        example: word.example,
        category: word.category || category,
        difficulty: word.difficulty || 'medium'
      };
    });
    
    await set(wordsRef, wordsData);
  } catch (error) {
    console.error('Error saving words to Firebase:', error);
    throw error;
  }
}

/**
 * Get words from Firebase
 */
export async function getWordsFromFirebase(
  category: string = 'default'
): Promise {
  try {
    const wordsRef = ref(database, `words/${category}`);
    const snapshot = await get(wordsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const wordsData = snapshot.val();
    return Object.values(wordsData);
  } catch (error) {
    console.error('Error getting words from Firebase:', error);
    throw error;
  }
}

/**
 * Get words by difficulty
 */
export async function getWordsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  category: string = 'default'
): Promise {
  const allWords = await getWordsFromFirebase(category);
  return allWords.filter((word) => word.difficulty === difficulty);
}

/**
 * Get random words
 */
export function getRandomWords(words: Word[], count: number): Word[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
```

---

## Step 2.2: Firebase Realtime Service

### 1. Create Realtime Service

```typescript
// lib/firebase/realtimeService.ts

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
  ): Promise {
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
  static async joinRoom(roomId: string, player: Player): Promise {
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
  ): Promise {
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
  ): Promise {
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
  ): Promise {
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
  ): Promise {
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
  static async leaveRoom(roomId: string, playerId: string): Promise {
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
  static async deleteRoom(roomId: string): Promise {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      await remove(roomRef);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
}
```

---

## Step 2.3: Game Logic Utilities

### 1. Question Generator

```typescript
// lib/utils/questionGenerator.ts

import { Word, Question } from '../types';

/**
 * Generate multiple choice question
 */
export function generateMultipleChoiceQuestion(
  targetWord: Word,
  allWords: Word[]
): Question {
  // Get 3 random wrong answers
  const wrongWords = allWords
    .filter((w) => w.id !== targetWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  // Combine with correct answer
  const options = [
    targetWord.meaning,
    ...wrongWords.map((w) => w.meaning)
  ];
  
  // Shuffle options
  const shuffledOptions = options.sort(() => Math.random() - 0.5);
  
  return {
    id: `q_${targetWord.id}`,
    word: targetWord,
    options: shuffledOptions,
    correctAnswer: targetWord.meaning,
    type: 'multiple-choice'
  };
}

/**
 * Generate fill in the blank question
 */
export function generateFillBlankQuestion(word: Word): Question {
  const sentence = word.example || `Use the word "${word.word}" in a sentence.`;
  const blankedSentence = sentence.replace(
    new RegExp(word.word, 'gi'),
    '______'
  );
  
  return {
    id: `q_${word.id}`,
    word: { ...word, example: blankedSentence },
    options: [],
    correctAnswer: word.word,
    type: 'fill-blank'
  };
}

/**
 * Generate flashcard
 */
export function generateFlashcard(word: Word): Question {
  return {
    id: `q_${word.id}`,
    word,
    options: [],
    correctAnswer: word.meaning,
    type: 'flashcard'
  };
}

/**
 * Generate questions based on game mode
 */
export function generateQuestions(
  words: Word[],
  gameMode: string,
  count: number
): Question[] {
  const selectedWords = words.slice(0, count);
  
  switch (gameMode) {
    case 'multiple-choice':
      return selectedWords.map((word) =>
        generateMultipleChoiceQuestion(word, words)
      );
    
    case 'fill-blank':
      return selectedWords
        .filter((word) => word.example)
        .map((word) => generateFillBlankQuestion(word));
    
    case 'flashcard':
      return selectedWords.map((word) => generateFlashcard(word));
    
    default:
      return [];
  }
}
```

### 2. Score Calculator

```typescript
// lib/utils/scoreCalculator.ts

/**
 * Calculate score based on answer time and correctness
 */
export function calculateScore(
  isCorrect: boolean,
  timeLimit: number,
  timeSpent: number
): number {
  if (!isCorrect) return 0;
  
  const baseScore = 100;
  const timeBonus = Math.max(0, ((timeLimit - timeSpent) / timeLimit) * 50);
  
  return Math.round(baseScore + timeBonus);
}

/**
 * Calculate final rank based on score
 */
export function calculateRank(score: number, totalQuestions: number): string {
  const percentage = (score / (totalQuestions * 150)) * 100;
  
  if (percentage >= 90) return 'Xuất sắc';
  if (percentage >= 75) return 'Giỏi';
  if (percentage >= 60) return 'Khá';
  if (percentage >= 50) return 'Trung bình';
  return 'Cần cố gắng';
}
```

---

## Step 2.4: Tailwind Configuration for Mobile

### 1. Update Tailwind Config

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
```

### 2. Global Styles for Mobile

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Mobile optimizations */
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  html {
    -webkit-text-size-adjust: 100%;
    touch-action: manipulation;
  }
  
  body {
    @apply antialiased;
    overscroll-behavior: none;
  }
  
  /* Remove input zoom on iOS */
  input, select, textarea {
    font-size: 16px !important;
  }
}

@layer utilities {
  /* Safe area utilities */
  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
  
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Touch-friendly sizes */
  .touch-target {
    @apply min-h-[44px] min-w-[44px];
  }
  
  /* Prevent text selection */
  .no-select {
    -webkit-user-select: none;
    user-select: none;
  }
}
```

---

## Step 2.5: Test Services

### 1. Create Test Page

```typescript
// app/test-services/page.tsx

'use client';

import { useState } from 'react';
import { 
  importFromGoogleSheets, 
  validateWords 
} from '@/lib/utils/sheetsImport';
import { saveWordsToFirebase, getWordsFromFirebase } from '@/lib/firebase/wordsService';
import { Button } from '@/components/ui/Button';

export default function TestServicesPage() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [status, setStatus] = useState('');
  const [words, setWords] = useState([]);

  const handleImport = async () => {
    try {
      setStatus('Importing...');
      const importedWords = await importFromGoogleSheets(sheetUrl);
      const { valid, invalid } = validateWords(importedWords);
      
      setStatus(`Imported ${valid.length} words, ${invalid.length} invalid`);
      setWords(valid);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleSaveToFirebase = async () => {
    try {
      setStatus('Saving to Firebase...');
      await saveWordsToFirebase(words);
      setStatus('✅ Saved to Firebase!');
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleLoadFromFirebase = async () => {
    try {
      setStatus('Loading from Firebase...');
      const loadedWords = await getWordsFromFirebase();
      setWords(loadedWords);
      setStatus(`✅ Loaded ${loadedWords.length} words from Firebase`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    
      Test Services
      
      
        
          Google Sheets URL:
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        
        
        
          Import from Sheets
          
            Save to Firebase
          
          
            Load from Firebase
          
        
        
        {status && (
          
            {status}
          
        )}
        
        {words.length > 0 && (
          
            Words ({words.length}):
            
              {words.map((word, i) => (
                
                  {word.word} - {word.meaning}
                  {word.example && {word.example}}
                
              ))}
            
          
        )}
      
    
  );
}
```

### 2. Test Instructions

```bash
# Run dev server
npm run dev

# Open test page
# http://localhost:3000/test-services

# Paste your Google Sheets URL (from Phase 0)
# Click "Import from Sheets"
# Click "Save to Firebase"
# Check Firebase Console to see data
```

---

## ✅ Phase 2 Completion Checklist

- [ ] Google Sheets import service working
- [ ] Firebase words service working
- [ ] Realtime service implemented
- [ ] Question generator created
- [ ] Score calculator created
- [ ] Tailwind mobile config updated
- [ ] Test page created
- [ ] Successfully imported and saved words

---

## 🎯 Next Step

➡️ **[Phase 3: UI Components Foundation](./PHASE_3_UI_Components_Foundation.md)**

Trong Phase 3, chúng ta sẽ:
- Tạo các UI components cơ bản
- Layout components (Header, Container)
- Animation wrappers
- Loading & Error states  