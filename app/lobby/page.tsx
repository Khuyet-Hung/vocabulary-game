'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, LogIn, User, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chơi Online</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kết Nối Và Chơi Với Bạn Bè
          </h2>
          <p className="text-lg text-gray-600">
            Tạo hoặc tham gia một phòng để bắt đầu chơi realtime cùng những
            người chơi khác
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <Plus className="w-5 h-5 inline-block mr-2" />
            Tạo Phòng
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'join'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <LogIn className="w-5 h-5 inline-block mr-2" />
            Vào Phòng
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Create Room Tab */}
        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Tạo Phòng Mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    Nhập tên của bạn và tạo phòng. Bạn sẽ nhận được mã phòng để
                    chia sẻ với bạn bè.
                  </p>
                </div>

                <Input
                  label="Tên của bạn"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError('');
                  }}
                  placeholder="Nhập tên của bạn..."
                  maxLength={20}
                />

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Điều khoản phòng:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Tối đa 8 người chơi</li>
                          <li>• 10 câu hỏi mỗi ván</li>
                          <li>• 30 giây mỗi câu hỏi</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleCreateRoom}
                  isLoading={loading}
                  loadingText="Đang tạo phòng..."
                  className="w-full h-12"
                >
                  <Plus className="w-5 h-5" />
                  Tạo Phòng
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Join Room Tab */}
        {activeTab === 'join' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Vào Phòng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    Nhập tên của bạn và mã phòng mà bạn bè chia sẻ để tham gia.
                  </p>
                </div>

                <Input
                  label="Tên của bạn"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError('');
                  }}
                  placeholder="Nhập tên của bạn..."
                  maxLength={20}
                />

                <Input
                  label="Mã Phòng"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="VD: ABC123"
                  maxLength={6}
                  helperText="Mã phòng gồm 6 ký tự hoa"
                />

                <Button
                  onClick={handleJoinRoom}
                  isLoading={loading}
                  loadingText="Đang tham gia phòng..."
                  className="w-full h-12"
                  variant="secondary"
                >
                  <LogIn className="w-5 h-5" />
                  Vào Phòng
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-blue-600">1.2K</p>
              <p className="text-xs text-gray-600 mt-2">Phòng Hoạt Động</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-600">8.5K</p>
              <p className="text-xs text-gray-600 mt-2">Người Chơi Online</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-purple-600">45K</p>
              <p className="text-xs text-gray-600 mt-2">Trận Chơi Hôm Nay</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
