'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TSUME_PROBLEMS, TsumeProblem } from '@/data/tsumeshogi';
import TsumeBoardView from '@/components/TsumeBoardView';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export default function TsumePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number | null>(null);

  const filteredProblems = useMemo(() => {
    if (!selectedDifficulty) return [];
    return TSUME_PROBLEMS.filter(p => p.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const handleSelectDifficulty = (d: Difficulty) => {
    setSelectedDifficulty(d);
    setSelectedProblemIndex(null);
  };

  const handleSelectProblem = (index: number) => {
    setSelectedProblemIndex(index);
  };

  const handleBackToList = () => {
    setSelectedProblemIndex(null);
  };

  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
    setSelectedProblemIndex(null);
  };

  // 問題詳細表示
  if (selectedDifficulty && selectedProblemIndex !== null && filteredProblems[selectedProblemIndex]) {
    const problem = filteredProblems[selectedProblemIndex];
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        <TsumeBoardView
          problem={problem}
          onNext={selectedProblemIndex < filteredProblems.length - 1 ? () => setSelectedProblemIndex(selectedProblemIndex + 1) : undefined}
          onPrev={selectedProblemIndex > 0 ? () => setSelectedProblemIndex(selectedProblemIndex - 1) : undefined}
          hasNext={selectedProblemIndex < filteredProblems.length - 1}
          hasPrev={selectedProblemIndex > 0}
          onBack={handleBackToList}
          currentIndex={selectedProblemIndex}
          totalCount={filteredProblems.length}
        />
      </div>
    );
  }

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
      {!selectedDifficulty && (
        <>
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={() => handleSelectDifficulty('beginner')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              🌱 やさしい（一手詰め）
              <span className="block text-sm mt-1 font-normal opacity-80">
                将棋の基本を確認しよう（{TSUME_PROBLEMS.filter(p => p.difficulty === 'beginner').length}問）
              </span>
            </button>

            <button
              onClick={() => handleSelectDifficulty('intermediate')}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              ⚔️ ふつう（三手詰め）
              <span className="block text-sm mt-1 font-normal opacity-80">
                少し先を読んでみよう（{TSUME_PROBLEMS.filter(p => p.difficulty === 'intermediate').length}問）
              </span>
            </button>

            <button
              onClick={() => handleSelectDifficulty('advanced')}
              className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              🔥 むずかしい（五〜七手詰め）
              <span className="block text-sm mt-1 font-normal opacity-80">
                上級者への道（{TSUME_PROBLEMS.filter(p => p.difficulty === 'advanced').length}問）
              </span>
            </button>
          </div>

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
        </>
      )}

      {/* 問題リスト */}
      {selectedDifficulty && selectedProblemIndex === null && (
        <div>
          <div className="mb-6">
            <button
              onClick={handleBackToDifficulty}
              className="text-amber-700 hover:text-amber-500 text-lg font-bold transition"
            >
              ← 難易度選択に戻る
            </button>
          </div>

          <div className="mb-6 text-center">
            <span className={`inline-block text-lg md:text-xl font-bold px-5 py-2 rounded-full ${
              selectedDifficulty === 'beginner'
                ? 'bg-green-100 text-green-800'
                : selectedDifficulty === 'intermediate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {selectedDifficulty === 'beginner' && '🌱 やさしい（一手詰め）'}
              {selectedDifficulty === 'intermediate' && '⚔️ ふつう（三手詰め）'}
              {selectedDifficulty === 'advanced' && '🔥 むずかしい（五〜七手詰め）'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredProblems.map((problem, index) => (
              <button
                key={problem.id}
                onClick={() => handleSelectProblem(index)}
                className="w-full text-left bg-white/70 hover:bg-white/90 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] border border-amber-200/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-amber-900">
                      {problem.title}
                    </h3>
                    <p className="text-sm md:text-base text-amber-700 mt-1">
                      {problem.description}
                    </p>
                  </div>
                  <div className="text-amber-500 text-2xl ml-3 flex-shrink-0">
                    ▶
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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
