'use client';

import { DotLottiePlayer } from '@dotlottie/react-player';

export default function Loading() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-52 h-52">
        <DotLottiePlayer src="/animations/cat_crying.lottie" autoplay loop />
      </div>
      <div className="translate-x-[10px] translate-y-[-90px]">
        <DotLottiePlayer src="/animations/loading_dot.lottie" autoplay loop />
      </div>
    </div>
  );
}
