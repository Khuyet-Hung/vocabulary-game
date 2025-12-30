'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, LogIn, User, Users, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { toast } from 'sonner';
import { useJoinRoom } from '@/lib/api/hooks/useRoom';
import roomsService from '@/lib/api/services/roomService';
import { CreatePlayer, Player, StorageKeyEnum } from '@/lib/types';
import { generateId } from '@/lib/utils/idGenerator';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import {
  useCreatePlayer,
  usePlayer,
  useUpdatePlayer,
} from '@/lib/api/hooks/usePlayer';

export default function LobbyPage() {
  // Hook imports
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [storagePlayerId, setStoragePlayerId] = useLocalStorage<string>(
    StorageKeyEnum.CURRENT_PLAYER_ID,
    ''
  );

  const { data: player, isLoading: isLoadingPlayer } = usePlayer(
    storagePlayerId || null
  );
  const { mutateAsync: joinRoom, isPending, isError } = useJoinRoom();
  const { mutateAsync: createPlayer, isPending: isCreatingPlayer } =
    useCreatePlayer();
  const { mutateAsync: updatePlayer, isPending: isUpdatingPlayer } =
    useUpdatePlayer();

  // Handles
  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      return;
    }

    if (!roomCode.trim()) {
      return;
    }

    try {
      let currentPlayerId = storagePlayerId;

      // Kiểm tra và tạo player nếu chưa có
      if (!player?.id) {
        const hostPlayer: CreatePlayer = {
          name: playerName.trim(),
        };
        currentPlayerId = await createPlayer(hostPlayer);
        setStoragePlayerId(currentPlayerId);
      } else {
        currentPlayerId = await updatePlayer({
          playerId: player.id,
          playerPayload: {
            name: playerName.trim(),
          },
        });
      }

      const roomData = await roomsService.getRoomData(
        roomCode.trim().toUpperCase()
      );
      if (!roomData?.id) {
        toast.error('Phòng không tồn tại', {
          description: 'Vui lòng kiểm tra lại mã phòng',
        });
        return;
      }

      await joinRoom({
        roomId: roomData.id,
        playerId: currentPlayerId,
      });
      router.push(`/room/${roomData.id}`);
    } catch (err: any) {
      console.error('Join room error:', err);
    }
  };

  // useEffects
  useEffect(() => {
    const roomId = searchParams.get('roomId') || '';
    if (roomId) {
      setRoomCode(roomId);
    }
  }, []);

  useEffect(() => {
    if (player?.name) {
      setPlayerName(player.name);
    }
  }, [player?.name]);

  const isLoading = isLoadingPlayer || isPending;

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
                    }}
                    disabled={isLoading}
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
                    }}
                    disabled={isLoading}
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
                    disabled={!roomCode.trim() || !playerName.trim()}
                    className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all duration-200 text-base"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Tham Gia Phòng
                    </div>
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
