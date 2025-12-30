'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  Zap,
  Brain,
  Target,
  Lock,
  ArrowLeft,
  Star,
  PiIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
  CreatePlayer,
  CreateRoom,
  Game,
  Player,
  PrefixEnum,
  Room,
  StorageKeyEnum,
} from '@/lib/types';
import { useCreateRoom } from '@/lib/api/hooks/useRoom';
import { toast } from 'sonner';
import { generateId } from '@/lib/utils/idGenerator';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { serverTimestamp } from 'firebase/database';
import {
  useCreatePlayer,
  usePlayer,
  useUpdatePlayer,
} from '@/lib/api/hooks/usePlayer';
import { useListGame } from '@/lib/api/hooks/useGame';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function GamesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: createRoom, isPending } = useCreateRoom();
  const { mutateAsync: createPlayer, isPending: isCreatingPlayer } =
    useCreatePlayer();
  const [playerId, setPlayerId] = useLocalStorage<string>(
    StorageKeyEnum.CURRENT_PLAYER_ID,
    ''
  );
  const { data: player, isLoading: isLoadingPlayer } = usePlayer(
    playerId || null
  );
  const { data: games = [], isLoading: isLoadingGames } = useListGame();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung Bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  const handleCreateRoom = async (gameId: string) => {
    try {
      const game = games?.find((g) => g.id === gameId);
      if (!game) {
        toast.error('Game không tồn tại.');
        return;
      }

      let currentPlayerId = playerId;

      // Kiểm tra và tạo player nếu chưa có
      if (!player?.id) {
        const hostPlayer: CreatePlayer = {
          name: `Tôi là Host`,
        };
        currentPlayerId = await createPlayer(hostPlayer);
        setPlayerId(currentPlayerId); // Set vào localStorage để lần sau dùng
      } else {
        currentPlayerId = player.id;
      }

      // Dùng currentPlayerId thay vì playerId
      const roomData: CreateRoom = {
        players: { [currentPlayerId]: true },
        status: 'waiting',
        gameId: gameId,
        hostPlayerId: currentPlayerId,
        createdAt: serverTimestamp(),
        gameSettings: game.defaultSettings || {},
      };

      const newRoomId = await createRoom(roomData);
      router.push(`/room/${newRoomId}`);
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const isLoading = isLoadingPlayer || isCreatingPlayer;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Main Content */}
        <Header />
        <div className="max-w-6xl mx-auto px-4 pb-12">
          {/* Games Grid */}
          {!games || games.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Sparkles className="w-10 h-10 mx-auto mb-4 animate-spin-slow" />
              <p className="text-lg">Đang cập nhật các game mode mới...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {games.map((game, index) => {
                const Icon = PiIcon;
                const isLocked = false;

                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`relative group ${
                        isLocked ? 'opacity-75' : ''
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
                      />

                      <Card className="relative border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                        {/* Gradient Top Bar */}
                        <div
                          className={`h-1 bg-gradient-to-r from-green-500 to-emerald-500`}
                        />

                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white`}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <CardTitle className="text-xl">
                                  {game.name}
                                </CardTitle>
                              </div>
                            </div>
                            {isLocked && (
                              <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-gray-600">{game.description}</p>

                          <Button
                            className="w-full h-11"
                            disabled={isLocked || isPending}
                            onClick={() =>
                              isLocked ? null : handleCreateRoom(game.id)
                            }
                          >
                            {isLocked ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Sắp Ra Mắt
                              </>
                            ) : isPending ? (
                              'Đang tạo...'
                            ) : (
                              'Tạo phòng'
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          {/* Info Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Mẹo Học Hiệu Quả
                  </h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Chơi hàng ngày để duy trì streak</li>
                    <li>• Thử tất cả các game mode để phát triển kỹ năng</li>
                    <li>• Cạnh tranh với bạn bè để tăng động lực</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Info */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
            <p className="text-yellow-900">
              🚀 <strong>Các game mode mới đang được phát triển!</strong> Theo
              dõi để không bỏ lỡ những cập nhật sắp tới.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
