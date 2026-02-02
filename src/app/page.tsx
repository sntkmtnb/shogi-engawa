'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return 'おはよう。';
  if (hour >= 10 && hour < 17) return 'こんにちは。';
  if (hour >= 17 && hour < 22) return 'こんばんは。';
  return 'こんばんは。';
}

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 pb-24 relative">
      {/* Main content - centered */}
      <div
        className="flex flex-col items-center gap-8 transition-opacity duration-700"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        {/* Time-based greeting */}
        <h1 className="text-4xl md:text-6xl font-black text-amber-900 tracking-wider">
          {greeting}
        </h1>

        {/* Sub text */}
        <p className="text-lg md:text-xl text-amber-700 font-medium">
          源さんが待ってるよ。
        </p>

        {/* Big round button */}
        <Link
          href="/play"
          className="group flex flex-col items-center gap-3 mt-4"
        >
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300/60 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 group-hover:shadow-xl group-hover:border-amber-400/60">
            <div className="chat-avatar" style={{ width: '64px', height: '64px', fontSize: '28px' }}>
              源
            </div>
          </div>
          <span className="text-xl md:text-2xl font-bold text-amber-800 tracking-wide">
            一局指す
          </span>
        </Link>

        {/* Tsume link */}
        <Link
          href="/tsume"
          className="text-amber-600 hover:text-amber-500 text-base font-medium transition mt-2"
        >
          詰将棋で肩慣らし →
        </Link>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center pb-[env(safe-area-inset-bottom,0px)]">
        <p className="text-xs text-amber-500/60 font-medium tracking-wider">
          将棋の縁台 — 50歳からの居場所
        </p>
      </div>
    </div>
  );
}
