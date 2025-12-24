# Phase 1: Project Setup & Foundation

⏱️ **Thời gian**: 2-3 giờ  
🎯 **Mục tiêu**: Khởi tạo project, cấu hình Firebase, setup types và folder structure

---

## 📋 Phase 1 Checklist

- [ ] Next.js project created
- [ ] Dependencies installed
- [ ] Firebase project configured
- [ ] Environment variables setup
- [ ] Folder structure created
- [ ] TypeScript types defined
- [ ] Zustand store setup
- [ ] Firebase SDK configured
- [ ] Git initialized
- [ ] First commit pushed

---

## Step 1.1: Khởi Tạo Next.js Project

### 1. Create Project

```bash
# Vào folder projects đã tạo ở Phase 0
cd ~/Documents/projects  # hoặc folder của bạn

# Tạo Next.js project
npx create-next-app@latest vocabulary-game
```

### 2. Configuration Prompts

Chọn options như sau:

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … Yes
✔ What import alias would you like configured? … @/*
```

### 3. Navigate to Project

```bash
cd vocabulary-game
```

### 4. Test Initial Setup

```bash
# Start dev server
npm run dev

# Mở browser: http://localhost:3000
# Nên thấy Next.js welcome page
```

**⚠️ Nếu thấy trang Next.js default = Setup thành công!**

Dừng server: `Ctrl + C`

---

## Step 1.2: Cài Đặt Dependencies

### 1. Core Dependencies

```bash
# Firebase
npm install firebase

# State Management
npm install zustand

# Animation
npm install framer-motion

# UI & Icons
npm install lucide-react

# Utilities
npm install class-variance-authority clsx tailwind-merge
```

### 2. Data Processing

```bash
# CSV parsing (cho Google Sheets)
npm install axios papaparse

# TypeScript types
npm install -D @types/papaparse
```

### 3. Verify Installation

```bash
# Xem package.json
cat package.json

# Hoặc mở file package.json trong VS Code
code package.json
```

**Kiểm tra section "dependencies" có các packages trên**

---

## Step 1.3: Setup Firebase

### 1. Tạo Web App trong Firebase Console

1. Mở Firebase Console: https://console.firebase.google.com
2. Chọn project đã tạo ở Phase 0
3. Click icon `</>` (Add web app)
4. App nickname: `vocabulary-game-web`
5. ❌ Don't check "Also set up Firebase Hosting"
6. Click "Register app"

### 2. Copy Firebase Config

Bạn sẽ thấy config như này:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

**💾 Copy toàn bộ config này - sẽ dùng ngay**

### 3. Enable Realtime Database

1. Trong Firebase Console sidebar: **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Database location: **Singapore** (gần VN nhất)
4. Security rules: **Start in test mode**
5. Click **"Enable"**

⚠️ **Lưu ý**: Test mode cho phép read/write không cần auth - chỉ dùng cho development!

### 4. Copy Database URL

Sau khi tạo, bạn sẽ thấy URL như:
```
https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
```

💾 **Copy URL này**

---

## Step 1.4: Setup Environment Variables

### 1. Tạo File .env.local

```bash
# Tạo file
touch .env.local

# Hoặc
code .env.local  # Mở trong VS Code
```

### 2. Thêm Firebase Config

```env
# .env.local

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**⚠️ Thay thế các giá trị bằng config từ Firebase của bạn!**

### 3. Verify .gitignore

Kiểm tra file `.gitignore` đã có `.env.local`:

```bash
# Xem nội dung .gitignore
cat .gitignore | grep .env
```

Nếu chưa có, thêm vào:

```bash
echo ".env.local" >> .gitignore
```

---

## Step 1.5: Tạo Folder Structure

### 1. Create Folders

```bash
# Library folders
mkdir -p lib/firebase
mkdir -p lib/store
mkdir -p lib/utils
mkdir -p lib/types

# Component folders
mkdir -p components/ui
mkdir -p components/games
mkdir -p components/layout
mkdir -p components/animations

# App folders (pages)
mkdir -p app/lobby
mkdir -p app/game
mkdir -p app/admin
mkdir -p app/room/[id]

# Public folders
mkdir -p public/sounds
mkdir -p public/images
```

### 2. Verify Structure

```bash
# List structure
tree -L 2 .

# Hoặc
ls -R
```

**Kết quả mong đợi:**

```
vocabulary-game/
├── app/
│   ├── lobby/
│   ├── game/
│   ├── admin/
│   └── room/
├── components/
│   ├── ui/
│   ├── games/
│   ├── layout/
│   └── animations/
├── lib/
│   ├── firebase/
│   ├── store/
│   ├── utils/
│   └── types/
├── public/
│   ├── sounds/
│   └── images/
└── ...
```

---

## Step 1.6: Configure Firebase SDK

### 1. Create Firebase Config File

```typescript
// lib/firebase/config.ts

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (chỉ init 1 lần)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

export { app, database };
```

### 2. Test Firebase Connection

Tạo file test:

```typescript
// lib/firebase/test.ts

import { ref, set, get } from 'firebase/database';
import { database } from './config';

export async function testFirebaseConnection() {
  try {
    const testRef = ref(database, 'test');
    await set(testRef, { 
      message: 'Hello from Firebase!',
      timestamp: Date.now()
    });
    
    const snapshot = await get(testRef);
    console.log('Firebase test:', snapshot.val());
    return true;
  } catch (error) {
    console.error('Firebase error:', error);
    return false;
  }
}
```

---

## Step 1.7: Setup TypeScript Types

### 1. Game Types

```typescript
// lib/types/game.ts

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
  players: Record;
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
```

### 2. Index Export

```typescript
// lib/types/index.ts

export * from './game';
```

---

## Step 1.8: Setup Zustand Store

### 1. Game Store

```typescript
// lib/store/gameStore.ts

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

export const useGameStore = create((set) => ({
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
```

### 2. UI Store (cho modal, toast, etc.)

```typescript
// lib/store/uiStore.ts

import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
  
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create((set) => ({
  isModalOpen: false,
  modalContent: null,
  toast: null,
  
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null })
}));
```

---

## Step 1.9: Utility Functions

### 1. Class Name Utility

```typescript
// lib/utils/cn.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2. ID Generator

```typescript
// lib/utils/idGenerator.ts

/**
 * Generate unique ID for players, rooms, etc.
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
}

/**
 * Generate short room code (6 characters, uppercase)
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

---

## Step 1.10: Git Setup & First Commit

### 1. Initialize Git

```bash
git init
```

### 2. Check .gitignore

```bash
cat .gitignore
```

Đảm bảo có:
```
node_modules/
.next/
.env*.local
.DS_Store
*.log
```

### 3. First Commit

```bash
# Stage all files
git add .

# Commit
git commit -m "feat: initial project setup with Next.js, Firebase, and Tailwind"

# Create main branch
git branch -M main
```

### 4. Create GitHub Repo (Optional)

```bash
# Tạo repo trên GitHub UI
# Sau đó:

git remote add origin https://github.com/your-username/vocabulary-game.git
git push -u origin main
```

---

## 🧪 Testing Phase 1

### 1. Test Dev Server

```bash
npm run dev
```

Mở: http://localhost:3000

### 2. Test Firebase Import

Tạo file test:

```typescript
// app/test/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { testFirebaseConnection } from '@/lib/firebase/test';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    testFirebaseConnection().then((success) => {
      setStatus(success ? '✅ Firebase Connected!' : '❌ Firebase Error');
    });
  }, []);

  return (
    
      Firebase Connection Test
      {status}
    
  );
}
```

Mở: http://localhost:3000/test

### 3. Check Console

Trong Browser DevTools Console, nên thấy:
```
Firebase test: { message: "Hello from Firebase!", timestamp: ... }
```

---

## ✅ Phase 1 Completion Checklist

Đảm bảo đã hoàn thành:

- [x] ✅ Next.js project created và chạy được
- [x] ✅ All dependencies installed
- [x] ✅ Firebase project setup
- [x] ✅ Realtime Database enabled
- [x] ✅ Environment variables configured
- [x] ✅ Folder structure created
- [x] ✅ TypeScript types defined
- [x] ✅ Zustand stores setup
- [x] ✅ Firebase SDK configured
- [x] ✅ Git initialized
- [x] ✅ Firebase connection tested

---

## 🚨 Common Issues

### Issue 1: Firebase connection error

```
Error: Firebase: No Firebase App '[DEFAULT]' has been created
```

**Fix:**
- Kiểm tra `.env.local` có đúng format
- Restart dev server: `Ctrl+C` → `npm run dev`
- Clear cache: `rm -rf .next`

### Issue 2: Module not found

```
Module not found: Can't resolve '@/lib/...'
```

**Fix:**
- Kiểm tra `tsconfig.json` có `"@/*": ["./*"]`
- Restart VS Code
- Restart dev server

### Issue 3: Type errors

```
Cannot find module '@/types' or its corresponding type declarations
```

**Fix:**
- Tạo `lib/types/index.ts` export types
- Restart TypeScript server trong VS Code: `Cmd+Shift+P` → "Restart TS Server"

---

## 🎯 Next Step

➡️ **[Phase 2: Core Infrastructure](./PHASE_2_Core_Infrastructure.md)**

Trong Phase 2, chúng ta sẽ:
- Setup Google Sheets import
- Tạo Realtime service
- Configure Tailwind cho mobile
- Tạo game logic utilities