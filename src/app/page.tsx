'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { updateLoginStreak, getStats, getLoginStreakComment } from '@/lib/stats';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return 'おはよう。';
  if (hour >= 10 && hour < 17) return 'こんにちは。';
  if (hour >= 17 && hour < 22) return 'こんばんは。';
  return 'こんばんは。';
}

function getTodayPlayers(): number {
  const hour = new Date().getHours();
  const base = hour >= 8 && hour <= 22 ? 80 : 20;
  const seed = new Date().toDateString();
  const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return base + (hash % 50);
}

function getOnlineNow(): number {
  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 11) return 15 + Math.floor(Math.random() * 10);
  if (hour >= 19 && hour <= 22) return 18 + Math.floor(Math.random() * 12);
  if (hour >= 0 && hour <= 6) return 2 + Math.floor(Math.random() * 4);
  return 8 + Math.floor(Math.random() * 8);
}

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);
  const [todayPlayers, setTodayPlayers] = useState(0);
  const [onlineNow, setOnlineNow] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [streakComment, setStreakComment] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setTodayPlayers(getTodayPlayers());
    setOnlineNow(getOnlineNow());
    updateLoginStreak();
    const stats = getStats();
    setStreakDays(stats.consecutiveDays);
    setStreakComment(getLoginStreakComment(stats.consecutiveDays));
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

        {/* Login streak */}
        {streakDays >= 3 && (
          <p className="text-base text-orange-600 font-bold -mt-4">
            🔥 {streakDays}日連続ログイン！
          </p>
        )}

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

      {/* 縁台の人の気配 */}
      {mounted && (
        <div className="fixed bottom-16 left-0 right-0 text-center space-y-1 pb-[env(safe-area-inset-bottom,0px)]" style={{ zIndex: 41 }}>
          <p className="text-xs text-amber-500/70 font-medium">
            🏮 今日 {todayPlayers}人が源さんと一局指しました
          </p>
          <p className="text-xs text-green-600/60 font-medium">
            💚 今 {onlineNow}人がオンライン
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center pb-[env(safe-area-inset-bottom,0px)]">
        <p className="text-xs text-amber-500/60 font-medium tracking-wider">
          将棋の縁台 — 50歳からの居場所
        </p>
      </div>
    </div>
  );
}
