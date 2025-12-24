'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users, Trophy, BookOpen, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Học Nhanh',
      description: 'Ghi nhớ từ vựng hiệu quả qua trò chơi tương tác',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Chơi Multiplayer',
      description: 'Đấu tranh với bạn bè realtime',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Toàn Cầu',
      description: 'Cạnh tranh với người chơi trên toàn thế giới',
    },
  ];

  const games = [
    { icon: <Gamepad2 className="w-5 h-5" />, title: 'Matching Game' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Flash Cards' },
    { icon: <Trophy className="w-5 h-5" />, title: 'Quiz Battle' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">VocabGame</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/profile')}
          >
            Profile
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-transparent rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Học Từ Vựng{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Thông Qua Trò Chơi
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá cách học từ vựng vui nhộn, hiệu quả và không bao giờ quên.
            Chơi với bạn bè hoặc thách thức cộng đồng toàn cầu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => router.push('/lobby')}
              className="text-lg h-12 px-8"
            >
              <Users className="w-5 h-5" />
              Chơi Online
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/games')}
              className="text-lg h-12 px-8"
            >
              <Gamepad2 className="w-5 h-5" />
              Khám Phá Games
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tại Sao Chọn VocabGame?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Games Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Các Trò Chơi Có Sẵn
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {games.map((game, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {game.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {game.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/games')}
              className="h-12 px-8"
            >
              Xem Tất Cả Trò Chơi
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Bắt Đầu?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Tham gia hàng nghìn người chơi khác và trở thành chuyên gia từ vựng
            ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/lobby')}
              className="h-12 px-8"
            >
              Chơi Ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/leaderboard')}
              className="h-12 px-8 border-white text-gray-900 hover:bg-white"
            >
              <Trophy className="w-5 h-5" />
              Bảng Xếp Hạng
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 VocabGame. Built with ❤️ for language learners</p>
        </div>
      </footer>
    </div>
  );
}
