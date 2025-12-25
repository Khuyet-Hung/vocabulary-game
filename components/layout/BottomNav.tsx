'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Gamepad2, Trophy, User, Scan } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DotLottiePlayer } from '@dotlottie/react-player';

const navItems = [
  { icon: Home, label: 'Trang chủ', path: '/' },
  { icon: Gamepad2, label: 'Trò chơi', path: '/games' },
  { icon: null, label: 'Quét', path: '/scan', isCenter: true },
  { icon: Trophy, label: 'Xếp hạng', path: '/leaderboard' },
  { icon: User, label: 'Hồ sơ', path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleScanClick = () => {
    router.push('/scan');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-xl z-30">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? pathname === '/'
              : pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <div key={item.path} className="flex-1 flex justify-around">
              {item.isCenter ? (
                <div className="flex flex-col items-center transform -translate-y-3 text-gray-400 hover:text-gray-600">
                  <div className="p-0.5 bg-white rounded-full shadow-lg">
                    <button
                      onClick={handleScanClick}
                      className="overflow-hidden w-12 h-12 relative flex-1 flex flex-col items-center justify-center gap-1  bg-[var(--primary-color)] text-white rounded-full"
                    >
                      <DotLottiePlayer
                        src="/animations/scan.json"
                        autoplay
                        loop
                        style={{ width: 64, height: 64 }}
                        className="absolute"
                      />
                    </button>
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              ) : (
                <button
                  onClick={() => router.push(item.path)}
                  className={cn(
                    'flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2',
                    'transition-colors duration-200',
                    'touch-target',
                    isActive
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-6 h-6" />}
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
