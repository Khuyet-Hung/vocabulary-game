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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CreateRoom, Player, Room } from '@/lib/types';
import { useCreateRoom } from '@/lib/api/hooks/useRoom';
import { toast } from 'sonner';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  status: 'available' | 'coming-soon';
  difficulty: 'easy' | 'medium' | 'hard';
  players?: number;
}

const games: GameCard[] = [
  {
    id: 'flashcard',
    title: 'Flashcard',
    description: 'Lật thẻ và ghi nhớ từ vựng nhanh chóng',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    status: 'available',
    difficulty: 'easy',
    players: 2340,
  },
  {
    id: 'multiple-choice',
    title: 'Trắc Nghiệm',
    description: 'Chọn đáp án đúng và nâng cao kỹ năng',
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
    status: 'available',
    difficulty: 'medium',
    players: 5120,
  },
  {
    id: 'fill-blank',
    title: 'Điền Từ',
    description: 'Hoàn thành câu với từ phù hợp nhất',
    icon: Brain,
    gradient: 'from-green-500 to-emerald-500',
    status: 'available',
    difficulty: 'hard',
    players: 1890,
  },
  {
    id: 'matching',
    title: 'Ghép Đôi',
    description: 'Nối từ với nghĩa tương ứng nhanh nhất',
    icon: Target,
    gradient: 'from-orange-500 to-red-500',
    status: 'coming-soon',
    difficulty: 'medium',
  },
];

const randomRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export default function GamesPage() {
  const router = useRouter();
  const { mutate: createRoom, isPending } = useCreateRoom();

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
    const id = randomRoomId();
    const hostPlayer: Player = {
      id: id,
      name: `Host_${id}`,
      isHost: true,
      score: 0,
      isReady: false,
      joinedAt: Date.now(),
    };
    const roomData: CreateRoom = {
      players: [hostPlayer],
      status: 'waiting',
      createdAt: Date.now(),
      settings: {
        maxPlayers: 4,
        timeLimitPerGame: 300,
      },
      gameMode: gameId,
    };

    createRoom(roomData, {
      onSuccess: (roomId) => {
        router.push(`/games/${gameId}/rooms/${roomId}`);
      },
      onError: (error) => {
        toast.error(`Lỗi tạo phòng: ${error.message}`);
      },
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Main Content */}
        <Header />
        <div className="max-w-6xl mx-auto px-4 pb-12">
          {/* Games Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {games.map((game, index) => {
              const Icon = game.icon;
              const isLocked = game.status === 'coming-soon';

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`relative group ${isLocked ? 'opacity-75' : ''}`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${game.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
                    />

                    <Card className="relative border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      {/* Gradient Top Bar */}
                      <div
                        className={`h-1 bg-gradient-to-r ${game.gradient}`}
                      />

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-r ${game.gradient} text-white`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {game.title}
                              </CardTitle>
                              {!isLocked && (
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <span
                                    className={`px-2 py-1 rounded-full ${getDifficultyColor(
                                      game.difficulty
                                    )}`}
                                  >
                                    {getDifficultyLabel(game.difficulty)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isLocked && (
                            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{game.description}</p>

                        {!isLocked && game.players && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>
                              {game.players
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                              người chơi
                            </span>
                          </div>
                        )}

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
