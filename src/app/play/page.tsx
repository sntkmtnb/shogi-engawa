'use client';

import { useState } from 'react';
import { Difficulty } from '@/lib/types';
import ShogiBoard from '@/components/ShogiBoard';

export default function PlayPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [showDifficulty, setShowDifficulty] = useState(false);

  if (!difficulty && !showDifficulty) {
    return (
      <div className="max-w-lg mx-auto px-5 py-10 md:py-16">
        {/* Gen-san profile card */}
        <div className="ios-card p-6 mb-6 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
          >
            源
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-1">
            源さん
          </h1>
          <p className="text-amber-600 text-sm">
            62歳 ・ 元サラリーマン ・ 将棋歴40年
          </p>
        </div>

        {/* Speech bubble */}
        <div className="ios-card p-5 mb-6">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
            >
              源
            </div>
            <div className="bg-amber-50/80 px-4 py-3 rounded-2xl rounded-tl-sm text-base text-amber-900 font-medium leading-relaxed">
              よっ、来たな！<br />
              ワシは源さんや。毎日ここで将棋指しとるんや。<br />
              一局付き合ってくれへんか？🍵
            </div>
          </div>
          <p className="text-amber-500 text-xs ml-12 mt-2">
            ※ 対局中、源さんがめっちゃ話しかけてきます
          </p>
        </div>

        <button
          onClick={() => setShowDifficulty(true)}
          className="w-full btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
        >
          🎯 源さんと一局指す
        </button>
      </div>
    );
  }

  if (!difficulty) {
    return (
      <div className="max-w-lg mx-auto px-5 py-10 md:py-16">
        {/* Gen-san asks */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
            style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
          >
            源
          </div>
          <div className="bg-amber-50/80 px-4 py-2 rounded-2xl rounded-tl-sm text-base font-medium text-amber-900">
            ほな、どのくらいの強さでいく？
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 text-center mb-8">
          🎯 難易度を選んでください
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => setDifficulty('easy')}
            className="w-full btn-ios bg-gradient-to-r from-green-600 to-green-700 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
          >
            🌱 やさしい
            <span className="block text-sm mt-1 font-normal opacity-80">
              源さんがボケながら指します
            </span>
          </button>
          <button
            onClick={() => setDifficulty('normal')}
            className="w-full btn-ios bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
          >
            ⚔️ ふつう
            <span className="block text-sm mt-1 font-normal opacity-80">
              源さんがそこそこ本気で指します
            </span>
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className="w-full btn-ios bg-gradient-to-r from-red-700 to-red-800 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
          >
            🔥 つよい
            <span className="block text-sm mt-1 font-normal opacity-80">
              源さん本気モード（将棋歴40年の実力）
            </span>
          </button>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowDifficulty(false)}
            className="text-amber-600 hover:text-amber-500 text-lg font-bold transition active:scale-95"
          >
            ← 戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-2 py-3 md:py-6">
      <ShogiBoard difficulty={difficulty} onBack={() => { setDifficulty(null); setShowDifficulty(false); }} />
    </div>
  );
}
