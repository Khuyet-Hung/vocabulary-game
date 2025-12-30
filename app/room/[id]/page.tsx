'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Copy,
  Check,
  Crown,
  Users,
  Clock,
  ArrowLeft,
  Zap,
  X,
  Download,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDetailRoom } from '@/lib/api/hooks/useRoom';
import { useUIStore } from '@/lib/store/uiStore';
import { Header } from '@/components/layout/Header';
import { toast } from 'sonner';
import { useRoomAndPlayers } from '@/lib/api/hooks/usePlayer';
import LoadingScreen from '@/components/common/loading/LoadingScreen';

export default function RoomWaitingPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params.id as string) || '';

  const [currentPlayerId] = useState('player-1');
  const [copied, setCopied] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const qrRef = useRef<any>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const { data: room, isLoading: isLoadingRoom } = useDetailRoom(roomId);
  console.log('🚀 ~ RoomWaitingPage ~ room:', room);
  const { players: roomWithPlayers, isLoading: isLoadingPlayers } =
    useRoomAndPlayers(roomId);

  // Construct full URL for QR code
  const getQRUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/join?roomId=${roomId}`;
    }
    return '';
  };

  const handleDownloadQR = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `room-${roomId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code đã được tải xuống');
    } else {
      toast.error('Không thể tải mã QR', {
        description: 'Vui lòng thử lại sau',
      });
    }
  };

  const handleShareQR = async () => {
    const qrUrl = getQRUrl();
    const shareText = `Tham gia phòng chơi của tôi: ${qrUrl}`;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mã QR phòng chơi',
          text: shareText,
          url: qrUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    if (room) {
      // updateReady({
      //   roomId: room.id,
      //   playerId: currentPlayerId,
      //   isReady: !room.players.find((p) => p.id === currentPlayerId)?.isReady,
      // });
    }
  };

  const handleStartGame = () => {
    // if (room && Object.values(room.players).every((p) => p.isReady)) {
    //   router.push(`/game/${roomId}`);
    // } else {
    //   alert('Tất cả người chơi phải sẵn sàng!');
    // }
  };

  const handleJoinRoom = () => {
    router.push('/lobby');
  };

  const handleLeaveRoom = () => {
    router.push('/lobby');
  };

  const handleKickPlayer = (playerId: string) => {
    // TODO: Implement kick player from room
    console.log('Kicking player:', playerId);
    // API call to remove player from room
  };

  const openQRModal = () => {
    setShowQRDialog(true);
  };

  const isHost = roomWithPlayers.some(
    (player) => player.id === currentPlayerId
  );
  const allReady = true;
  const isLoading = isLoadingRoom || isLoadingPlayers;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy phòng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content */}
      <Header />
      <div className="px-4 pb-12">
        {/* Room Code Section */}
        <Card className="mb-8 border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex flex-row items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl">Mã phòng</h1>
                <div className="flex items-center gap-2">
                  <div className="text-4xl font-bold text-blue-600 tracking-wider font-mono">
                    {room.id}
                  </div>
                  <button
                    onClick={handleCopyRoomCode}
                    className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
              {/* QR Code */}
              <div className="flex-1 flex justify-end">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={openQRModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Click để phóng to QR"
                  >
                    <QRCodeCanvas
                      ref={qrRef}
                      value={getQRUrl()}
                      size={60}
                      level="H"
                      includeMargin={true}
                    />
                  </button>
                  <p className="text-xs text-gray-500">Scan để tham gia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-row justify-between">
                {/* Người chơi */}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Người chơi</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {roomWithPlayers.length}/{room.gameSettings.maxPlayers}
                    </p>
                  </div>
                </div>
                {/* Câu hỏi */}
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Câu hỏi</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {/* {room.settings.questionsCount} */}
                    </p>
                  </div>
                </div>
                {/* Thời gian/Câu */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Thời gian/Câu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {room.gameSettings.timePerQuestion}s
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Người Chơi Chưa Sẳn sàng</CardTitle>
          </CardHeader>
          <CardContent>
            {roomWithPlayers.length === 0 ? (
              <p className="text-gray-600">
                Chưa có người chơi nào trong phòng.
              </p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {roomWithPlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {player.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {player.id === roomWithPlayers[0].id
                              ? 'Chủ phòng'
                              : 'Người chơi'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* {player.isReady ? (
                          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                            ✓ Sẵn sàng
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-xs font-semibold">
                            Chờ...
                          </span>
                        )} */}
                        {isHost && (
                          <button
                            onClick={() => handleKickPlayer(player.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Kích người chơi này"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* <Button
            onClick={handleToggleReady}
            className="w-full h-12"
            variant={
              playerList.find((p) => p.id === currentPlayerId)?.isReady
                ? 'secondary'
                : 'default'
            }
          >
            {playerList.find((p) => p.id === currentPlayerId)?.isReady
              ? '✓ Bạn sẵn sàng'
              : 'Sẵn sàng'}
          </Button> */}

          {isHost && (
            <Button
              onClick={handleStartGame}
              disabled={!allReady || roomWithPlayers.length === 0}
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

        {/* QR Code Dialog */}
        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mã QR Phòng Chơi</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-6">
              <QRCodeCanvas
                ref={qrCanvasRef}
                value={getQRUrl()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <DialogFooter className="flex gap-3 sm:justify-between">
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Tải xuống
              </Button>
              <Button
                onClick={handleShareQR}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Share2 size={18} />
                Chia sẻ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
