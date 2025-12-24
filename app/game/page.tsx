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

export default function GamesPage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chọn Trò Chơi</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Intro Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Khám Phá Các Trò Chơi Học Từ Vựng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn trò chơi yêu thích của bạn để bắt đầu học từ vựng một cách vui
            vẻ và hiệu quả.
          </p>
        </div>

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
                    className={`absolute inset-0 bg-linear-to-r ${game.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
                  />

                  <Card className="relative border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    {/* Gradient Top Bar */}
                    <div className={`h-1 bg-linear-to-r ${game.gradient}`} />

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-3 rounded-xl bg-linear-to-r ${game.gradient} text-white`}
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
                          <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-600">{game.description}</p>

                      {!isLocked && game.players && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>
                            {game.players.toLocaleString()} người chơi
                          </span>
                        </div>
                      )}

                      <Button
                        className="w-full h-11"
                        disabled={isLocked}
                        onClick={() =>
                          isLocked ? null : router.push(`/game/${game.id}`)
                        }
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Sắp Ra Mắt
                          </>
                        ) : (
                          'Chơi Ngay'
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
        <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
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
            🚀 <strong>Các game mode mới đang được phát triển!</strong> Theo dõi
            để không bỏ lỡ những cập nhật sắp tới.
          </p>
        </div>
      </div>
    </div>
  );
}
