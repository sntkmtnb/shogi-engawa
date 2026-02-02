'use client';

import { useState } from 'react';
import { Difficulty } from '@/lib/types';
import ShogiBoard from '@/components/ShogiBoard';

export default function PlayPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [showDifficulty, setShowDifficulty] = useState(false);

  if (!difficulty && !showDifficulty) {
    // おっちゃん紹介画面
    return (
      <div className="max-w-lg mx-auto px-4 py-8 md:py-16">
        {/* 源さんプロフィール */}
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
          >
            源
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-2">
            源さん
          </h1>
          <p className="text-amber-700 text-sm md:text-base">
            62歳 ・ 元サラリーマン ・ 将棋歴40年
          </p>
        </div>

        <div className="bg-white/60 rounded-2xl p-5 mb-6 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
            >
              源
            </div>
            <div
              className="px-3 py-2 rounded-xl rounded-tl-sm text-base font-medium shadow-sm border"
              style={{
                background: '#FFF8E7',
                borderColor: '#D4A76A',
                color: '#5C3A1E',
              }}
            >
              よっ、来たな！<br />
              ワシは源さんや。毎日ここで将棋指しとるんや。<br />
              一局付き合ってくれへんか？🍵
            </div>
          </div>
          <p className="text-amber-700 text-sm ml-12">
            ※ 対局中、源さんがめっちゃ話しかけてきます
          </p>
        </div>

        <button
          onClick={() => setShowDifficulty(true)}
          className="w-full btn-warm bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          🎯 源さんと一局指す
        </button>

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

  if (!difficulty) {
    // 難易度選択
    return (
      <div className="max-w-lg mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
              style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
            >
              源
            </div>
            <div
              className="px-3 py-2 rounded-xl rounded-tl-sm text-base font-medium shadow-sm border"
              style={{
                background: '#FFF8E7',
                borderColor: '#D4A76A',
                color: '#5C3A1E',
              }}
            >
              ほな、どのくらいの強さでいく？
            </div>
          </div>
        </div>

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
              源さんがボケながら指します
            </span>
          </button>
          <button
            onClick={() => setDifficulty('normal')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            ⚔️ ふつう
            <span className="block text-sm mt-1 font-normal opacity-80">
              源さんがそこそこ本気で指します
            </span>
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
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
            className="text-amber-700 hover:text-amber-500 text-lg font-bold transition"
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
