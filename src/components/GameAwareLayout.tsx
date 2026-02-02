'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomTabBar from '@/components/BottomTabBar';

export default function GameAwareLayout({ children }: { children: React.ReactNode }) {
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    // Observe data-game-active attribute on body
    const observer = new MutationObserver(() => {
      setGameActive(document.body.hasAttribute('data-game-active'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-game-active'] });
    // Check initial state
    setGameActive(document.body.hasAttribute('data-game-active'));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Header - hidden during game */}
      {!gameActive && (
        <header className="glass-header sticky top-0 z-30 text-amber-100">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-lg md:text-xl font-bold tracking-wider">
                ▲ 将棋の縁台
              </span>
            </Link>
          </div>
        </header>
      )}

      <main className={`flex-1 ${gameActive ? '' : 'main-content'}`}>
        {children}
      </main>

      {/* Tab bar - hidden during game */}
      {!gameActive && <BottomTabBar />}
    </>
  );
}
