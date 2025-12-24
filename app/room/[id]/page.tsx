'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Copy, Check, Crown, Users, Clock, ArrowLeft, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  avatar?: string;
}

interface Room {
  id: string;
  hostId: string;
  players: Player[];
  status: 'waiting' | 'ready' | 'playing';
  settings: {
    maxPlayers: number;
    questionsCount: number;
    timePerQuestion: number;
    difficulty: string;
  };
  createdAt: number;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params.id as string) || '';

  const [currentPlayerId] = useState('player-1'); // TODO: Lấy từ store
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate loading room data
    setTimeout(() => {
      setRoom({
        id: roomId,
        hostId: currentPlayerId,
        players: [
          { id: currentPlayerId, name: 'Bạn', score: 0, isReady: false },
          { id: 'player-2', name: 'Người chơi 2', score: 0, isReady: false },
        ],
        status: 'waiting',
        settings: {
          maxPlayers: 8,
          questionsCount: 10,
          timePerQuestion: 30,
          difficulty: 'mixed',
        },
        createdAt: Date.now(),
      });
      setLoading(false);
    }, 500);
  }, [roomId, currentPlayerId]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    // TODO: Cập nhật trạng thái ready
  };

  const handleStartGame = () => {
    if (room && room.players.every((p) => p.isReady)) {
      router.push(`/game/${roomId}`);
    } else {
      alert('Tất cả người chơi phải sẵn sàng!');
    }
  };

  const handleLeaveRoom = () => {
    router.push('/lobby');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải phòng...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  const isHost = room.hostId === currentPlayerId;
  const allReady = room.players.every((p) => p.isReady);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLeaveRoom}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Phòng Chơi</h1>
              <p className="text-sm text-gray-500">{room.id}</p>
            </div>
          </div>
          {isHost && (
            <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
              <Crown className="w-4 h-4" />
              Chủ phòng
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Room Code Section */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle>Mã Phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-4xl font-bold text-blue-600 tracking-wider font-mono">
                  {room.id}
                </p>
                <p className="text-gray-600 mt-2">
                  Chia sẻ mã này với bạn bè để tham gia
                </p>
              </div>
              <button
                onClick={handleCopyRoomCode}
                className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <Copy className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Người chơi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {room.players.length}/{room.settings.maxPlayers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Câu hỏi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {room.settings.questionsCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian/Câu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {room.settings.timePerQuestion}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Người Chơi Trong Phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {room.players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {player.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {player.id === room.hostId
                            ? 'Chủ phòng'
                            : 'Người chơi'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {player.isReady ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✓ Sẵn sàng
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                          Chờ...
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleToggleReady}
            className="w-full h-12"
            variant={
              room.players.find((p) => p.id === currentPlayerId)?.isReady
                ? 'secondary'
                : 'default'
            }
          >
            {room.players.find((p) => p.id === currentPlayerId)?.isReady
              ? '✓ Bạn sẵn sàng'
              : 'Sẵn sàng'}
          </Button>

          {isHost && (
            <Button
              onClick={handleStartGame}
              disabled={!allReady || room.players.length === 0}
              className="w-full h-12"
            >
              🚀 Bắt Đầu Trò Chơi
            </Button>
          )}

          <Button
            onClick={handleLeaveRoom}
            variant="outline"
            className="w-full h-12"
          >
            Rời Phòng
          </Button>
        </div>

        {/* Info Message */}
        {!allReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-900 text-sm"
          >
            ⏳ Chờ tất cả người chơi sẵn sàng trước khi bắt đầu
          </motion.div>
        )}
      </div>
    </div>
  );
}
