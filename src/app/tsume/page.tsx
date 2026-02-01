'use client';

import { useState } from 'react';
import Link from 'next/link';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export default function TsumePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
          🧩 毎日の詰将棋
        </h1>
        <p className="text-lg text-amber-800 leading-relaxed">
          毎日コツコツ解いて、<br className="md:hidden" />
          将棋の力と脳の健康を育てましょう。
        </p>
      </div>

      {/* 難易度選択 */}
      <div className="space-y-4 max-w-md mx-auto">
        <button
          onClick={() => setSelectedDifficulty('beginner')}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
        >
          🌱 やさしい（一手詰め）
          <span className="block text-sm mt-1 font-normal opacity-80">
            将棋の基本を確認しよう
          </span>
        </button>

        <button
          onClick={() => setSelectedDifficulty('intermediate')}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
        >
          ⚔️ ふつう（三手詰め）
          <span className="block text-sm mt-1 font-normal opacity-80">
            少し先を読んでみよう
          </span>
        </button>

        <button
          onClick={() => setSelectedDifficulty('advanced')}
          className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
        >
          🔥 むずかしい（五〜七手詰め）
          <span className="block text-sm mt-1 font-normal opacity-80">
            上級者への道
          </span>
        </button>
      </div>

      {/* 来るデータ表示用のプレースホルダー */}
      {selectedDifficulty && (
        <div className="mt-8 text-center">
          <div className="bg-white/60 rounded-2xl p-8 shadow-sm">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">
              まもなく公開
            </h2>
            <p className="text-amber-800">
              詰将棋問題を準備中です。<br />
              もう少しお待ちください。
            </p>
          </div>
          <button
            onClick={() => setSelectedDifficulty(null)}
            className="mt-4 text-amber-700 hover:text-amber-500 text-lg font-bold transition"
          >
            ← 戻る
          </button>
        </div>
      )}

      {/* 脳トレ豆知識 */}
      <div className="mt-12 bg-white/60 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-4">
          🧠 知っていますか？
        </h2>
        <div className="space-y-4 text-base md:text-lg text-amber-900 leading-relaxed">
          <p>
            将棋は<strong>「最高の脳トレ」</strong>と言われています。
            先を読む力、記憶力、判断力を同時に鍛えることができます。
          </p>
          <p>
            東北大学の研究によると、将棋を定期的に指す人は
            <strong>認知機能の低下が緩やかになる</strong>傾向があるそうです。
          </p>
          <p>
            毎日たった<strong>10分の詰将棋</strong>でも、
            脳の健康維持に効果が期待できます。
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-amber-700 hover:text-amber-500 text-lg font-bold transition"
        >
          ← トップに戻る
        </Link>
      </div>
    </div>
  );
}
