# Phase 4: Main Pages & Game Hub

⏱️ **Thời gian**: 5-6 giờ  
🎯 **Mục tiêu**: Xây dựng các trang chính: Home, Games Hub, Lobby, Room

---

## 📋 Phase 4 Checklist

- [ ] Home page
- [ ] Games Hub page
- [ ] Lobby page (create/join room)
- [ ] Room page với realtime sync
- [ ] Waiting room UI
- [ ] Player list realtime
- [ ] Room code sharing
- [ ] Navigation flow hoàn chỉnh

---

## Step 4.1: Home Page

```typescript
// app/page.tsx

'use client';

import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/animations/PageTransition';
import { useRouter } from 'next/navigation';
import { Gamepad2, Users, Trophy, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  return (



          {/* Hero Section */}

            {/* Decorative Elements */}



            {/* Content */}





              Vocab Game



              Học từ vựng qua trò chơi - vui và hiệu quả!




              Realtime Multiplayer



          {/* Menu Section */}


              <Button
                size="lg"
                className="w-full flex items-center justify-center gap-3 h-16"
                onClick={() => router.push('/lobby')}
              >


                  Chơi Online
                  Chơi với bạn bè realtime





              <Button
                size="lg"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-16"
                onClick={() => router.push('/games')}
              >


                  Chọn Game
                  Khám phá các trò chơi





              <Button
                size="lg"
                variant="ghost"
                className="w-full flex items-center justify-center gap-3 h-16"
                onClick={() => router.push('/leaderboard')}
              >


                  Bảng Xếp Hạng
                  Xem top người chơi





          {/* Footer */}

            v1.0.0 - Built with ❤️




  );
}
```

---

## Step 4.2: Games Hub Page

```typescript
// app/games/page.tsx

'use client';

import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/animations/PageTransition';
import { Sparkles, Zap, Brain, Target, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  status: 'available' | 'coming-soon';
  route?: string;
}

const games: GameCard[] = [
  {
    id: 'flashcard',
    title: 'Flashcard',
    description: 'Lật thẻ và ghi nhớ từ vựng',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    status: 'coming-soon',
  },
  {
    id: 'multiple-choice',
    title: 'Trắc Nghiệm',
    description: 'Chọn đáp án đúng nhanh nhất',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    status: 'coming-soon',
  },
  {
    id: 'fill-blank',
    title: 'Điền Từ',
    description: 'Hoàn thành câu với từ phù hợp',
    icon: Brain,
    color: 'from-green-500 to-emerald-500',
    status: 'coming-soon',
  },
  {
    id: 'matching',
    title: 'Ghép Đôi',
    description: 'Nối từ với nghĩa tương ứng',
    icon: Target,
    color: 'from-orange-500 to-red-500',
    status: 'coming-soon',
  },
];

export default function GamesPage() {
  return (





          {games.map((game, index) => {
            const Icon = game.icon;

            return (

                <button
                  className="w-full p-6 rounded-2xl shadow-lg bg-white border-2 border-gray-100 hover:border-primary-300 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={game.status === 'coming-soon'}
                >

                    {/* Icon */}




                    {/* Content */}


                        {game.title}
                        {game.status === 'coming-soon' && (


                            Sắp ra mắt

                        )}

                      {game.description}




            );
          })}

          {/* Info Box */}



                💡


                    Đang phát triển


                    Các game mode mới sẽ được cập nhật thường xuyên.
                    Theo dõi để không bỏ lỡ nhé!








  );
}
```

---

## Step 4.3: Lobby Page

```typescript
// app/lobby/page.tsx

'use client';

import { useState } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/animations/PageTransition';
import { Plus, LogIn, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RealtimeService } from '@/lib/firebase/realtimeService';
import { useGameStore } from '@/lib/store/gameStore';
import { generateId } from '@/lib/utils/cn/idGenerator';

export default function LobbyPage() {
  const router = useRouter();
  const { setCurrentPlayer } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const player = {
        id: generateId('player'),
        name: playerName.trim(),
        score: 0,
        isReady: false,
        joinedAt: Date.now(),
      };

      const roomId = await RealtimeService.createRoom(player, {
        maxPlayers: 8,
        questionsCount: 10,
        timePerQuestion: 30,
        difficulty: 'mixed'
      });

      setCurrentPlayer(player);
      router.push(`/room/${roomId}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      setError('Không thể tạo phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    if (!roomCode.trim()) {
      setError('Vui lòng nhập mã phòng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const player = {
        id: generateId('player'),
        name: playerName.trim(),
        score: 0,
        isReady: false,
        joinedAt: Date.now(),
      };

      await RealtimeService.joinRoom(roomCode.trim().toUpperCase(), player);
      setCurrentPlayer(player);
      router.push(`/room/${roomCode.trim().toUpperCase()}`);
    } catch (error: any) {
      console.error('Error joining room:', error);
      setError(error.message || 'Không thể vào phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (





          {/* Player Name Input */}

            <Input
              label="Tên của bạn"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              placeholder="Nhập tên..."
              leftIcon={}
              maxLength={20}
              error={error && !playerName.trim() ? error : ''}
            />


          {/* Create Room */}







                  Tạo Phòng Mới


                  Tạo phòng và mời bạn bè tham gia cùng





              Tạo Phòng



          {/* Join Room */}







                  Vào Phòng


                  Nhập mã phòng để tham gia ngay





              <Input
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="VD: ABC123"
                maxLength={20}
                error={error && !roomCode.trim() ? error : ''}
                className="text-center text-lg font-mono font-bold tracking-wider"
              />



                Vào Phòng




          {/* Error Message */}
          {error && (

              {error}

          )}



  );
}
```

---

## Step 4.4: Room Page (Waiting Room)

```typescript
// app/room/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageTransition } from '@/components/animations/PageTransition';
import { Copy, Check, Crown, Users, Clock } from 'lucide-react';
import { RealtimeService } from '@/lib/firebase/realtimeService';
import { useGameStore } from '@/lib/store/gameStore';
import { Room } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { currentPlayer, setCurrentRoom } = useGameStore();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentPlayer) {
      router.push('/lobby');
      return;
    }

    // Listen to room updates
    const unsubscribe = RealtimeService.listenToRoom(roomId, (roomData) => {
      if (roomData) {
        setRoom(roomData);
        setCurrentRoom(roomData);
        setLoading(false);

        // Redirect if game started
        if (roomData.status === 'playing') {
          router.push(`/game/${roomId}`);
        }
      } else {
        // Room doesn't exist or was deleted
        router.push('/lobby');
      }
    });

    return () => unsubscribe();
  }, [roomId, currentPlayer, router, setCurrentRoom]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = async () => {
    if (!currentPlayer || !room) return;

    const newReadyState = !room.players[currentPlayer.id]?.isReady;
    await RealtimeService.updatePlayerReady(roomId, currentPlayer.id, newReadyState);
  };

  const handleStartGame = async () => {
    if (!currentPlayer || !room) return;

    // Check if all players are ready
    const allReady = Object.values(room.players).every((p) => p.isReady);

    if (!allReady) {
      alert('Chờ tất cả người chơi sẵn sàng!');
      return;
    }

    await RealtimeService.updateGameStatus(roomId, 'playing');
  };

  const handleLeaveRoom = async () => {
    if (!currentPlayer) return;

    await RealtimeService.leaveRoom(roomId, currentPlayer.id);
    router.push('/');
  };

  if (loading) {
    return (



    );
  }

  if (!room || !currentPlayer) {
    return null;
  }

  const isHost = room.hostId === currentPlayer.id;
  const players = Object.values(room.players);
  const allReady = players.every((p) => p.isReady);
  const playerCount = players.length;

  return (





          {/* Room Code Card */}


              Mã Phòng


                  {roomId}


                  {copied ? (

                  ) : (

                  )}



                Chia sẻ mã này với bạn bè




          {/* Room Info */}



              {playerCount}/{room.settings.maxPlayers}
              Người chơi




              {room.settings.questionsCount}
              Câu hỏi



          {/* Players List */}



              Người Chơi




                {players.map((player, index) => (





                        {player.name}
                        {room.hostId === player.id && (

                        )}


                        {player.isReady ? '✅ Sẵn sàng' : '⏳ Chưa sẵn sàng'}



                ))}




          {/* Action Buttons */}

            {isHost ? (

                Bắt Đầu Game

            ) : (

                {room.players[currentPlayer.id]?.isReady ? 'Hủy Sẵn Sàng' : 'Sẵn Sàng'}

            )}


              Rời Phòng



          {/* Instructions */}
          {isHost && !allReady && (


                💡 Chờ tất cả người chơi sẵn sàng trước khi bắt đầu game


          )}



  );
}
```

---

## Step 4.5: Test Navigation Flow

### Test Checklist:

```bash
# Start dev server
npm run dev

# Test flow:
1. ✅ Home page loads
2. ✅ Click "Chơi Online" → Lobby page
3. ✅ Enter name → Create room
4. ✅ Room page loads with room code
5. ✅ Copy room code works
6. ✅ Open another browser/device
7. ✅ Join room with code
8. ✅ See both players in room
9. ✅ Toggle ready status
10. ✅ Host can start game when all ready
11. ✅ Leave room works
```

---

## ✅ Phase 4 Completion Checklist

- [ ] Home page created với hero section
- [ ] Games Hub page với game cards
- [ ] Lobby page với create/join functionality
- [ ] Room page với realtime player sync
- [ ] Room code copy functionality
- [ ] Ready/Unready toggle
- [ ] Host can start game
- [ ] Leave room functionality
- [ ] Navigation flow tested
- [ ] Mobile responsive verified

---

## 🎯 Next Step

➡️ **[Phase 5: Testing & Refinement](./PHASE_5_Testing_Refinement.md)**

Trong Phase 5, chúng ta sẽ:

- Test toàn bộ flow
- Test trên mobile devices
- Fix bugs
- Optimize performance
- Setup Firebase security rules
