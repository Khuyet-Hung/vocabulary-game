'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, LogIn, User, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';

export default function LobbyPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Tạo phòng
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      // TODO: Kết nối với Firebase RealtimeService
      router.push(`/room/${roomCode}`);
    } catch (err: any) {
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
      // Tham gia phòng
      // TODO: Kết nối với Firebase RealtimeService
      router.push(`/room/${roomCode.trim().toUpperCase()}`);
    } catch (err: any) {
      setError('Không thể vào phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color-mix(in_srgb,var(--primary-color)_10%,white)] via-white to-[color-mix(in_srgb,var(--primary-color)_5%,white)]">
      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-180px)] px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Animated Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-[var(--primary-color)] text-white rounded-t-lg">
                <CardTitle className="text-center text-2xl">
                  Tham Gia Trò Chơi
                </CardTitle>
                <p className="text-center text-white/80 text-sm mt-2">
                  Nhập mã phòng và tên của bạn
                </p>
              </CardHeader>

              <CardContent className="pt-6 space-y-5">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Room Code Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <Users className="inline w-4 h-4 mr-2" />
                    Mã Phòng
                  </label>
                  <Input
                    placeholder="VD: A1B2C3"
                    value={roomCode}
                    onChange={(e) => {
                      setRoomCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    disabled={loading}
                    maxLength={6}
                    className="text-center text-lg font-bold tracking-widest uppercase border-2 border-gray-200 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary-color)_20%,transparent)]"
                  />
                </div>

                {/* Player Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <User className="inline w-4 h-4 mr-2" />
                    Tên Hiển Thị
                  </label>
                  <Input
                    placeholder="Nhập tên của bạn"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                    maxLength={20}
                    className="border-2 border-gray-200 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary-color)_20%,transparent)]"
                  />
                </div>

                {/* Join Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleJoinRoom}
                    disabled={loading || !roomCode.trim() || !playerName.trim()}
                    className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all duration-200 text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Vào phòng...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Tham Gia Phòng
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc</span>
                  </div>
                </div>

                {/* Create Room Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => router.push('/games')}
                    variant="outline"
                    className="w-full border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_5%,white)] font-bold py-3 rounded-lg transition-all duration-200 text-base"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Tạo Phòng Mới
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] border border-[color-mix(in_srgb,var(--primary-color)_30%,transparent)] rounded-lg p-4"
          >
            <p className="text-sm text-[color-mix(in_srgb,var(--primary-color)_80%,black)]">
              💡 <span className="font-semibold">Mã phòng</span> là 6 ký tự được
              cấp khi tạo phòng. Hỏi người tạo phòng để lấy mã.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
