'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TSUME_PROBLEMS, TsumeProblem } from '@/data/tsumeshogi';
import TsumeBoardView from '@/components/TsumeBoardView';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

function getSolvedIds(): number[] {
  try {
    const raw = localStorage.getItem('tsume-solved');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

function markSolved(problemId: number) {
  const solved = getSolvedIds();
  if (!solved.includes(problemId)) {
    solved.push(problemId);
    localStorage.setItem('tsume-solved', JSON.stringify(solved));
  }
}

export default function TsumePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number | null>(null);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSolvedIds(getSolvedIds());
    setMounted(true);
  }, []);

  const filteredProblems = useMemo(() => {
    if (!selectedDifficulty) return [];
    return TSUME_PROBLEMS.filter(p => p.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const totalProblems = TSUME_PROBLEMS.length;
  const totalSolved = solvedIds.length;
  const allClear = totalSolved >= totalProblems && totalProblems > 0;

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

  const handleSolved = useCallback((problemId: number) => {
    markSolved(problemId);
    setSolvedIds(getSolvedIds());
  }, []);

  // Count solved per difficulty
  const solvedCount = (d: Difficulty) => {
    const problems = TSUME_PROBLEMS.filter(p => p.difficulty === d);
    return problems.filter(p => solvedIds.includes(p.id)).length;
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
          isSolved={solvedIds.includes(problem.id)}
          onSolved={() => handleSolved(problem.id)}
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
        {/* Progress display */}
        {mounted && totalSolved > 0 && (
          <div className="mt-3">
            <span className="inline-block bg-amber-100/80 text-amber-800 font-bold text-sm px-4 py-1.5 rounded-full">
              ✅ {totalSolved}/{totalProblems}問 クリア
            </span>
          </div>
        )}
        {/* All clear message */}
        {allClear && (
          <div className="mt-3 ios-card p-4 bg-gradient-to-r from-amber-50 to-orange-50 animate-springIn">
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
              >
                源
              </div>
              <p className="text-sm text-amber-900 font-bold">
                「全問正解か！お前さんやるなぁ」
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Difficulty selection */}
      {!selectedDifficulty && (
        <>
          <div className="space-y-4 max-w-md mx-auto">
            {([
              { key: 'beginner' as Difficulty, label: '初級 — やさしい（一手詰め）', sub: '将棋の基本を確認しよう', gradient: 'from-amber-500 to-amber-600' },
              { key: 'intermediate' as Difficulty, label: '中級 — ふつう（三手詰め）', sub: '少し先を読んでみよう', gradient: 'from-amber-600 to-amber-700' },
              { key: 'advanced' as Difficulty, label: '上級 — むずかしい（五〜七手詰め）', sub: '上級者への道', gradient: 'from-amber-700 to-amber-800' },
            ]).map(({ key, label, sub, gradient }) => {
              const total = TSUME_PROBLEMS.filter(p => p.difficulty === key).length;
              const solved = solvedCount(key);
              return (
                <button
                  key={key}
                  onClick={() => handleSelectDifficulty(key)}
                  className={`w-full btn-ios bg-gradient-to-r ${gradient} text-white text-xl md:text-2xl font-bold py-5 px-8 shadow-lg active:scale-97 relative`}
                >
                  {label}
                  <span className="block text-sm mt-1 font-normal opacity-80">
                    {sub}（{total}問）
                    {mounted && solved > 0 && (
                      <span className="ml-1">— ✅ {solved}問クリア</span>
                    )}
                  </span>
                </button>
              );
            })}
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
            {/* Difficulty progress */}
            {mounted && (
              <p className="text-sm text-amber-600 mt-2 font-bold">
                ✅ {solvedCount(selectedDifficulty)}/{filteredProblems.length}問 クリア
              </p>
            )}
          </div>

          <div className="space-y-3">
            {filteredProblems.map((problem, index) => {
              const isSolved = solvedIds.includes(problem.id);
              return (
                <button
                  key={problem.id}
                  onClick={() => handleSelectProblem(index)}
                  className={`w-full text-left ios-card hover:bg-white/90 p-4 md:p-5 transition-all active:scale-[0.99] ${
                    isSolved ? 'border-green-300/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-amber-900">
                        {isSolved && <span className="text-green-600 mr-1">✅</span>}
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
