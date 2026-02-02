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

  // Problem detail view
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
    <div className="max-w-2xl mx-auto px-5 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3">
          🧩 毎日の詰将棋
        </h1>
        <p className="text-base text-amber-700 leading-relaxed">
          毎日コツコツ解いて、将棋の力と脳の健康を育てましょう。
        </p>
      </div>

      {/* Difficulty selection */}
      {!selectedDifficulty && (
        <>
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={() => handleSelectDifficulty('beginner')}
              className="w-full btn-ios bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
            >
              初級 — やさしい（一手詰め）
              <span className="block text-sm mt-1 font-normal opacity-80">
                将棋の基本を確認しよう（{TSUME_PROBLEMS.filter(p => p.difficulty === 'beginner').length}問）
              </span>
            </button>

            <button
              onClick={() => handleSelectDifficulty('intermediate')}
              className="w-full btn-ios bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
            >
              中級 — ふつう（三手詰め）
              <span className="block text-sm mt-1 font-normal opacity-80">
                少し先を読んでみよう（{TSUME_PROBLEMS.filter(p => p.difficulty === 'intermediate').length}問）
              </span>
            </button>

            <button
              onClick={() => handleSelectDifficulty('advanced')}
              className="w-full btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97"
            >
              上級 — むずかしい（五〜七手詰め）
              <span className="block text-sm mt-1 font-normal opacity-80">
                上級者への道（{TSUME_PROBLEMS.filter(p => p.difficulty === 'advanced').length}問）
              </span>
            </button>
          </div>

          {/* Brain training info */}
          <div className="mt-10 ios-card p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-4">
              🧠 知っていますか？
            </h2>
            <div className="space-y-3 text-sm md:text-base text-amber-800 leading-relaxed">
              <p>
                将棋は<strong>「最高の脳トレ」</strong>と言われています。
                先を読む力、記憶力、判断力を同時に鍛えることができます。
              </p>
              <p>
                毎日たった<strong>10分の詰将棋</strong>でも、
                脳の健康維持に効果が期待できます。
              </p>
            </div>
          </div>
        </>
      )}

      {/* Problem list */}
      {selectedDifficulty && selectedProblemIndex === null && (
        <div>
          <div className="mb-6">
            <button
              onClick={handleBackToDifficulty}
              className="text-amber-600 hover:text-amber-500 text-base font-bold transition active:scale-95"
            >
              ← 難易度選択に戻る
            </button>
          </div>

          <div className="mb-6 text-center">
            <span className={`inline-block text-base font-bold px-5 py-2 rounded-full ${
              selectedDifficulty === 'beginner'
                ? 'bg-amber-100/80 text-amber-700'
                : selectedDifficulty === 'intermediate'
                  ? 'bg-amber-100/80 text-amber-800'
                  : 'bg-amber-200/80 text-amber-900'
            }`}>
              {selectedDifficulty === 'beginner' && '初級 — やさしい（一手詰め）'}
              {selectedDifficulty === 'intermediate' && '中級 — ふつう（三手詰め）'}
              {selectedDifficulty === 'advanced' && '上級 — むずかしい（五〜七手詰め）'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredProblems.map((problem, index) => (
              <button
                key={problem.id}
                onClick={() => handleSelectProblem(index)}
                className="w-full text-left ios-card hover:bg-white/90 p-4 md:p-5 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-amber-900">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-amber-600 mt-1">
                      {problem.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-xs font-bold bg-amber-100/80 text-amber-700 px-2 py-1 rounded-full">
                      {problem.moves}手
                    </span>
                    <span className="text-amber-400 text-xl">▶</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
