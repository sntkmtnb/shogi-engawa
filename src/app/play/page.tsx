'use client';

import { useState, useEffect } from 'react';
import { Difficulty } from '@/lib/types';
import ShogiBoard from '@/components/ShogiBoard';

export default function PlayPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const isInGame = difficulty !== null;

  // Signal to layout that we're in a game (hide header/tabs)
  useEffect(() => {
    if (isInGame) {
      document.body.setAttribute('data-game-active', 'true');
    } else {
      document.body.removeAttribute('data-game-active');
    }
    return () => {
      document.body.removeAttribute('data-game-active');
    };
  }, [isInGame]);

  // Game screen - no scroll, full viewport
  if (difficulty) {
    return (
      <ShogiBoard
        difficulty={difficulty}
        onBack={() => {
          setDifficulty(null);
          setShowDifficultyModal(false);
        }}
      />
    );
  }

  // Pre-game: Gen-san intro (scrollable OK)
  return (
    <div className="max-w-lg mx-auto px-5 py-8 md:py-12">
      {/* Gen-san profile card */}
      <div className="ios-card p-6 mb-5 text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
        >
          源
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-amber-900 mb-0.5">
          源さん
        </h1>
        <p className="text-amber-600 text-sm">
          62歳 ・ 元サラリーマン ・ 将棋歴40年
        </p>
      </div>

      {/* Speech bubble */}
      <div className="ios-card p-4 mb-5">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
          >
            源
          </div>
          <div className="bg-amber-50/50 px-3 py-2.5 rounded-2xl rounded-tl-sm text-base text-amber-900 font-medium leading-relaxed">
            よっ、来たな！<br />
            ワシは源さんや。毎日ここで将棋指しとるんや。<br />
            一局付き合ってくれへんか？🍵
          </div>
        </div>
        <p className="text-amber-400 text-xs ml-11 mt-1.5">
          ※ 対局中、源さんがめっちゃ話しかけてきます
        </p>
      </div>

      <button
        onClick={() => setShowDifficultyModal(true)}
        className="w-full btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl font-bold py-4 px-8 shadow-lg active:scale-97"
      >
        🎯 源さんと一局指す
      </button>

      {/* Difficulty selection modal */}
      {showDifficultyModal && (
        <div className="difficulty-overlay" onClick={() => setShowDifficultyModal(false)}>
          <div className="difficulty-modal" onClick={e => e.stopPropagation()}>
            {/* Gen-san asks */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
              >
                源
              </div>
              <div className="bg-amber-50/50 px-3 py-2 rounded-2xl rounded-tl-sm text-sm font-medium text-amber-900">
                ほな、どのくらいの強さでいく？
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setDifficulty('easy')}
                className="w-full btn-ios bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold py-3.5 px-6 shadow-md active:scale-97"
              >
                🌱 やさしい
                <span className="block text-xs mt-0.5 font-normal opacity-80">
                  源さんがボケながら指します
                </span>
              </button>
              <button
                onClick={() => setDifficulty('normal')}
                className="w-full btn-ios bg-gradient-to-r from-amber-600 to-amber-700 text-white text-lg font-bold py-3.5 px-6 shadow-md active:scale-97"
              >
                ⚔️ ふつう
                <span className="block text-xs mt-0.5 font-normal opacity-80">
                  源さんがそこそこ本気で指します
                </span>
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className="w-full btn-ios bg-gradient-to-r from-red-700 to-red-800 text-white text-lg font-bold py-3.5 px-6 shadow-md active:scale-97"
              >
                🔥 つよい
                <span className="block text-xs mt-0.5 font-normal opacity-80">
                  源さん本気モード
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowDifficultyModal(false)}
              className="w-full mt-4 text-amber-600 hover:text-amber-500 text-base font-bold py-2 transition active:scale-95"
            >
              やっぱりやめる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
