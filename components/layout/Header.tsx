'use client';

import { ArrowLeft, Coins } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  return (
    <header
      className={`sticky top-0 z-40 w-full bg-transparent backdrop-blur-md ${className}`}
    >
      <Button
        variant="link"
        className="px-4 py-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay Lại
      </Button>
    </header>
  );
}
