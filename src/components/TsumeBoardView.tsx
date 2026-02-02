'use client';

import { useState } from 'react';
import { TsumeProblem } from '@/data/tsumeshogi';
import { PIECE_KANJI, PIECE_KANJI_SENTE_KING, isPromoted, AnyPieceType, type Piece } from '@/lib/types';

interface TsumeBoardViewProps {
  problem: TsumeProblem;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onBack: () => void;
  currentIndex: number;
  totalCount: number;
  isSolved?: boolean;
  onSolved?: () => void;
}

const HAND_PIECE_KANJI: Record<string, string> = {
  rook: '飛',
  bishop: '角',
  gold: '金',
  silver: '銀',
  knight: '桂',
  lance: '香',
  pawn: '歩',
};

export default function TsumeBoardView({
  problem,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onBack,
  currentIndex,
  totalCount,
  isSolved,
  onSolved,
}: TsumeBoardViewProps) {
  const [showSolution, setShowSolution] = useState(false);

  const getKanjiDisplay = (type: AnyPieceType, owner: 'sente' | 'gote'): string => {
    if (type === 'king' && owner === 'sente') return PIECE_KANJI_SENTE_KING;
    return PIECE_KANJI[type];
  };

  const colNumbers = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const rowLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  const starPositions = [
    { row: 2, col: 6 },
    { row: 5, col: 3 },
    { row: 5, col: 6 },
    { row: 2, col: 3 },
  ];

  // 持ち駒の表示用
  const handPieces = Object.entries(problem.senteHand)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({ type, count, kanji: HAND_PIECE_KANJI[type] || type }));

  const handleNext = () => {
    setShowSolution(false);
    onNext?.();
  };

  const handlePrev = () => {
    setShowSolution(false);
    onPrev?.();
  };

  return (
    <div className="select-none">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={onBack}
          className="text-amber-800 hover:text-amber-600 text-lg font-bold py-1 px-3 rounded-lg hover:bg-amber-100 transition"
        >
          ← 一覧
        </button>
        <span className="text-sm md:text-base text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold">
          {currentIndex + 1} / {totalCount}
        </span>
      </div>

      {/* 問題タイトル */}
      <div className="text-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-1">
          {problem.title}
        </h2>
        <p className="text-base md:text-lg text-amber-800 leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* 攻め方の持ち駒（盤の上に表示） */}
      <div className="mb-2 p-2 bg-amber-100/80 rounded-lg">
        <div className="text-xs md:text-sm text-amber-700 mb-1 font-bold">
          ▲ 攻め方の持ち駒
        </div>
        <div className="flex flex-wrap gap-1 min-h-[2rem]">
          {handPieces.length === 0 ? (
            <span className="text-sm text-amber-600">なし</span>
          ) : (
            handPieces.map(({ type, count, kanji }) => (
              <span
                key={type}
                className="inline-flex items-center bg-amber-200 px-3 py-1.5 rounded text-base md:text-lg font-bold text-amber-900"
              >
                {kanji}{count > 1 ? `×${count}` : ''}
              </span>
            ))
          )}
        </div>
      </div>

      {/* 将棋盤 */}
      <div className="flex justify-center">
        <div className="relative">
          {/* 筋番号（上） */}
          <div className="flex ml-6 mr-4">
            {colNumbers.map((n, i) => (
              <div key={i} className="flex-1 text-center text-xs md:text-sm text-amber-700 font-bold">
                {n}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* 盤面 */}
            <div className="board-texture rounded-sm shadow-lg border-2 border-amber-900/50 p-0">
              <div
                className="grid grid-cols-9 relative"
                style={{ width: 'min(88vw, 470px)', height: 'min(88vw, 470px)' }}
              >
                {/* 星印 */}
                {starPositions.map((pos, idx) => {
                  const cellW = 100 / 9;
                  const left = `${(pos.col + 0.5) * cellW}%`;
                  const top = `${(pos.row + 0.5) * cellW}%`;
                  return (
                    <div
                      key={`star-${idx}`}
                      className="board-star"
                      style={{ left, top }}
                    />
                  );
                })}

                {problem.board.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="border border-amber-900/40 flex items-center justify-center relative"
                    >
                      {cell && (
                        <div
                          className={`koma-display w-[85%] h-[85%] flex items-center justify-center ${
                            cell.owner === 'gote' ? 'gote' : ''
                          }`}
                        >
                          <span
                            className={`text-amber-950 font-bold leading-none ${
                              isPromoted(cell.type as AnyPieceType) ? 'text-red-700' : ''
                            }`}
                            style={{ fontSize: 'min(4.8vw, 26px)' }}
                          >
                            {getKanjiDisplay(cell.type as AnyPieceType, cell.owner)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 段ラベル（右） */}
            <div className="flex flex-col ml-1">
              {rowLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center text-xs md:text-sm text-amber-700 font-bold"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 答えを見るボタン / 答え表示 */}
      <div className="mt-5">
        {!showSolution ? (
          <div className="text-center">
            {isSolved && (
              <p className="text-green-600 font-bold text-sm mb-3">✅ クリア済み</p>
            )}
            <button
              onClick={() => {
                setShowSolution(true);
                onSolved?.();
              }}
              className="btn-warm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xl md:text-2xl font-bold py-4 px-10 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              💡 答えを見る
            </button>
          </div>
        ) : (
          <div className="bg-white/70 rounded-2xl p-5 md:p-6 shadow-sm border border-amber-200">
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-3">
              📖 正解手順（{problem.moves}手詰め）
            </h3>
            <div className="text-lg md:text-xl text-amber-900 font-bold leading-loose tracking-wide">
              {problem.solution.join(' → ')}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setShowSolution(false)}
                className="text-amber-700 hover:text-amber-500 text-base font-bold transition"
              >
                答えを隠す
              </button>
              {isSolved && (
                <span className="text-green-600 text-sm font-bold">✅ クリア！</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 前の問題 / 次の問題 */}
      <div className="mt-5 flex gap-4 justify-center">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={`flex-1 max-w-[200px] text-lg md:text-xl font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] ${
            hasPrev
              ? 'bg-amber-200 hover:bg-amber-300 text-amber-900 shadow'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          ← 前の問題
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={`flex-1 max-w-[200px] text-lg md:text-xl font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] ${
            hasNext
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          次の問題 →
        </button>
      </div>
    </div>
  );
}
