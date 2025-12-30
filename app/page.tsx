'use client';

import { useRouter } from 'next/navigation';
import { Gamepad2, Users, Trophy, BookOpen, Zap, Globe } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { useEffect } from 'react';
import { seedGames } from '@/lib/seeds/gameSeed/seedDatabase';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    seedGames();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="backgound overflow-hidden flex flex-col items-center justify-center relative">
        <div className="h-[calc(100vh-340px)] w-full relative">
          <div className="fixed w-[250%] right-[-75%] top-[-44px]">
            <DotLottiePlayer src="/animations/chest.json" autoplay loop />
          </div>
        </div>
        <div className="content flex justify-center rounded-t-[46%] bg-white transform -translate-y-[120px] h-[800px] w-[800px]">
          <div className="flex flex-col items-center mt-[60px]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Chào Mừng Bạn
              </h1>
              <p className="text-lg text-gray-600">
                Học từ vựng qua trò chơi vui nhộn và hiệu quả
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full sm:max-w-sm items-center mt-8">
              <Button
                className="w-[80%] h-12 text-base font-semibold bg-[var(--primary-color)] text-white"
                onClick={() => router.push('/join')}
              >
                Tham gia ngay
              </Button>
              <Button
                variant="outline"
                className="w-[80%] h-12 text-base font-semibold border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]"
                onClick={() => router.push('/games')}
              >
                Tạo phòng mới
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
