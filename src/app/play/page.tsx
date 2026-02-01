'use client';

import { useState } from 'react';
import { Difficulty } from '@/lib/types';
import ShogiBoard from '@/components/ShogiBoard';

export default function PlayPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  if (!difficulty) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 md:py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 text-center mb-8">
          🎯 難易度を選んでください
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => setDifficulty('easy')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            🌱 やさしい
            <span className="block text-sm mt-1 font-normal opacity-80">
              ランダムに手を選びます
            </span>
          </button>
          <button
            onClick={() => setDifficulty('normal')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            ⚔️ ふつう
            <span className="block text-sm mt-1 font-normal opacity-80">
              駒の価値を考えて指します
            </span>
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            🔥 つよい
            <span className="block text-sm mt-1 font-normal opacity-80">
              先読みして指します
            </span>
          </button>
        </div>
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-amber-700 hover:text-amber-500 text-lg font-bold transition"
          >
            ← トップに戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-2 py-3 md:py-6">
      <ShogiBoard difficulty={difficulty} onBack={() => setDifficulty(null)} />
    </div>
  );
}
