'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  GameState, Player, Position, Move, PieceType, AnyPieceType, Difficulty,
  PIECE_KANJI, PIECE_KANJI_SENTE_KING, canPromote, isPromoted, baseType,
  PROMOTE_MAP,
} from '@/lib/types';
import { createInitialGameState, cloneGameState } from '@/lib/board';
import {
  getPieceMoves, getAllLegalMoves, applyMove, isInCheck,
  isCheckmate, isStalemate, canPromoteMove, mustPromote,
} from '@/lib/moves';
import { getAIMove } from '@/lib/ai';

interface ShogiBoardProps {
  difficulty: Difficulty;
  onBack: () => void;
}

export default function ShogiBoard({ difficulty, onBack }: ShogiBoardProps) {
  const [game, setGame] = useState<GameState>(createInitialGameState());
  const [selected, setSelected] = useState<Position | null>(null);
  const [selectedDrop, setSelectedDrop] = useState<PieceType | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Position | null; to: Position } | null>(null);
  const [showPromote, setShowPromote] = useState<{
    move: Move;
    callback: (promote: boolean) => void;
  } | null>(null);
  const [thinking, setThinking] = useState(false);
  const [message, setMessage] = useState<string>('あなたの番です');

  const playerSide: Player = 'sente';
  const aiSide: Player = 'gote';

  // AI の手番処理
  const doAITurn = useCallback((currentGame: GameState) => {
    if (currentGame.status !== 'playing' && currentGame.status !== 'check') return;
    if (currentGame.turn !== aiSide) return;

    setThinking(true);
    setMessage('AIが考えています...');

    // 少し遅延させてUIを更新
    setTimeout(() => {
      const aiMove = getAIMove(currentGame.board, currentGame.captured, aiSide, difficulty);
      if (!aiMove) {
        setThinking(false);
        return;
      }

      const result = applyMove(currentGame.board, currentGame.captured, aiMove, aiSide);
      const newGame = cloneGameState(currentGame);
      newGame.board = result.board;
      newGame.captured = result.captured;
      newGame.turn = playerSide;
      newGame.moveHistory.push(aiMove);

      // 状態チェック
      if (isCheckmate(newGame.board, newGame.captured, playerSide)) {
        newGame.status = 'checkmate';
        newGame.winner = aiSide;
        setMessage('残念...AIの勝ちです');
      } else if (isStalemate(newGame.board, newGame.captured, playerSide)) {
        newGame.status = 'stalemate';
        setMessage('引き分けです');
      } else if (isInCheck(newGame.board, playerSide)) {
        newGame.status = 'check';
        setMessage('王手！あなたの番です');
      } else {
        newGame.status = 'playing';
        setMessage('あなたの番です');
      }

      setLastMove({ from: aiMove.from, to: aiMove.to });
      setGame(newGame);
      setThinking(false);
    }, 300);
  }, [aiSide, difficulty, playerSide]);

  // プレイヤーの手を処理
  const executePlayerMove = useCallback((move: Move, promote: boolean) => {
    const actualMove = { ...move, promote };
    const result = applyMove(game.board, game.captured, actualMove, playerSide);
    const newGame = cloneGameState(game);
    newGame.board = result.board;
    newGame.captured = result.captured;
    newGame.turn = aiSide;
    newGame.moveHistory.push(actualMove);

    // 状態チェック
    if (isCheckmate(newGame.board, newGame.captured, aiSide)) {
      newGame.status = 'checkmate';
      newGame.winner = playerSide;
      setMessage('おめでとうございます！あなたの勝ちです！🎉');
    } else if (isStalemate(newGame.board, newGame.captured, aiSide)) {
      newGame.status = 'stalemate';
      setMessage('引き分けです');
    } else if (isInCheck(newGame.board, aiSide)) {
      newGame.status = 'check';
      setMessage('王手！');
    } else {
      newGame.status = 'playing';
    }

    setLastMove({ from: move.from, to: move.to });
    setGame(newGame);
    setSelected(null);
    setSelectedDrop(null);
    setLegalMoves([]);
    setShowPromote(null);

    // AIの番
    if (newGame.status === 'playing' || newGame.status === 'check') {
      setTimeout(() => doAITurn(newGame), 100);
    }
  }, [game, playerSide, aiSide, doAITurn]);

  // セルクリック
  const handleCellClick = useCallback((row: number, col: number) => {
    if (thinking) return;
    if (game.turn !== playerSide) return;
    if (game.status === 'checkmate' || game.status === 'stalemate') return;

    const piece = game.board[row][col];

    // 持ち駒からの打ち
    if (selectedDrop) {
      if (piece) return; // 駒がある場所には打てない
      const isLegal = legalMoves.some(m => m.row === row && m.col === col);
      if (!isLegal) {
        setSelectedDrop(null);
        setLegalMoves([]);
        return;
      }
      const move: Move = {
        from: null,
        to: { row, col },
        piece: selectedDrop,
        dropPiece: selectedDrop,
      };
      executePlayerMove(move, false);
      return;
    }

    // 駒選択中 → 移動先クリック
    if (selected) {
      const isLegal = legalMoves.some(m => m.row === row && m.col === col);

      if (isLegal) {
        const selectedPiece = game.board[selected.row][selected.col]!;
        const move: Move = {
          from: selected,
          to: { row, col },
          piece: selectedPiece.type,
          capture: game.board[row][col],
        };

        // 成り判定
        const cp = canPromoteMove(selectedPiece.type, playerSide, selected.row, row);
        const mp = mustPromote(selectedPiece.type, playerSide, row);

        if (mp) {
          executePlayerMove(move, true);
        } else if (cp) {
          // 成り/不成の選択ダイアログ
          setShowPromote({
            move,
            callback: (promote) => executePlayerMove(move, promote),
          });
        } else {
          executePlayerMove(move, false);
        }
        return;
      }

      // 別の自分の駒をクリック
      if (piece && piece.owner === playerSide) {
        setSelected({ row, col });
        const moves = getPieceMoves(game.board, playerSide, row, col);
        // 合法手フィルタ
        const allLegal = getAllLegalMoves(game.board, game.captured, playerSide);
        const filtered = moves.filter(m =>
          allLegal.some(lm => lm.from && lm.from.row === row && lm.from.col === col && lm.to.row === m.row && lm.to.col === m.col)
        );
        setLegalMoves(filtered);
        return;
      }

      // 空マスをクリック → 選択解除
      setSelected(null);
      setLegalMoves([]);
      return;
    }

    // 駒をクリック → 選択
    if (piece && piece.owner === playerSide) {
      setSelected({ row, col });
      const moves = getPieceMoves(game.board, playerSide, row, col);
      const allLegal = getAllLegalMoves(game.board, game.captured, playerSide);
      const filtered = moves.filter(m =>
        allLegal.some(lm => lm.from && lm.from.row === row && lm.from.col === col && lm.to.row === m.row && lm.to.col === m.col)
      );
      setLegalMoves(filtered);
    }
  }, [thinking, game, playerSide, selected, selectedDrop, legalMoves, executePlayerMove]);

  // 持ち駒クリック
  const handleCapturedClick = useCallback((pieceType: PieceType) => {
    if (thinking) return;
    if (game.turn !== playerSide) return;
    if (game.status === 'checkmate' || game.status === 'stalemate') return;

    setSelected(null);
    setSelectedDrop(pieceType);

    // 打てるマスを計算
    const allLegal = getAllLegalMoves(game.board, game.captured, playerSide);
    const dropMoves = allLegal.filter(m => !m.from && m.dropPiece === pieceType);
    setLegalMoves(dropMoves.map(m => m.to));
  }, [thinking, game, playerSide]);

  // リセット
  const handleReset = () => {
    setGame(createInitialGameState());
    setSelected(null);
    setSelectedDrop(null);
    setLegalMoves([]);
    setLastMove(null);
    setShowPromote(null);
    setThinking(false);
    setMessage('あなたの番です');
  };

  // 駒の表示テキスト
  const getKanjiDisplay = (type: AnyPieceType, owner: Player): string => {
    if (type === 'king' && owner === 'sente') return PIECE_KANJI_SENTE_KING;
    return PIECE_KANJI[type];
  };

  const difficultyLabel = difficulty === 'easy' ? 'やさしい' : difficulty === 'normal' ? 'ふつう' : 'つよい';

  // 筋の数字（右から9,8,7...1）
  const colNumbers = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  // 段の漢数字
  const rowLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  const capturedPieceTypes: PieceType[] = ['rook', 'bishop', 'gold', 'silver', 'knight', 'lance', 'pawn'];

  return (
    <div className="no-scroll select-none">
      {/* ステータスバー */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={onBack}
          className="text-amber-800 hover:text-amber-600 text-lg font-bold py-1 px-3 rounded-lg hover:bg-amber-100 transition"
        >
          ← 戻る
        </button>
        <span className="text-sm md:text-base text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold">
          難易度: {difficultyLabel}
        </span>
        <button
          onClick={handleReset}
          className="text-amber-800 hover:text-amber-600 text-lg font-bold py-1 px-3 rounded-lg hover:bg-amber-100 transition"
        >
          🔄 最初から
        </button>
      </div>

      {/* メッセージ */}
      <div className={`text-center text-lg md:text-xl font-bold mb-3 py-2 rounded-lg ${
        game.status === 'checkmate'
          ? game.winner === playerSide
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          : game.status === 'check'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-amber-50 text-amber-800'
      }`}>
        {message}
      </div>

      {/* 後手持ち駒 */}
      <div className="mb-2 p-2 bg-amber-100/80 rounded-lg">
        <div className="text-xs md:text-sm text-amber-700 mb-1 font-bold">
          △ AI の持ち駒
        </div>
        <div className="flex flex-wrap gap-1 min-h-[2rem]">
          {capturedPieceTypes.map(pt => {
            const count = game.captured.gote[pt] || 0;
            if (count <= 0) return null;
            return (
              <span key={pt} className="inline-flex items-center bg-amber-200 px-2 py-1 rounded text-sm md:text-base font-bold text-amber-900">
                {PIECE_KANJI[pt]}{count > 1 ? `×${count}` : ''}
              </span>
            );
          })}
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
              <div className="grid grid-cols-9" style={{ width: 'min(85vw, 450px)', height: 'min(85vw, 450px)' }}>
                {game.board.map((row, r) =>
                  row.map((cell, c) => {
                    const isSelected = selected?.row === r && selected?.col === c;
                    const isLegal = legalMoves.some(m => m.row === r && m.col === c);
                    const isLastMove = lastMove && (
                      (lastMove.to.row === r && lastMove.to.col === c) ||
                      (lastMove.from && lastMove.from.row === r && lastMove.from.col === c)
                    );

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`
                          border border-amber-900/40 flex items-center justify-center relative
                          ${isLegal ? 'cell-highlight' : ''}
                          ${isLastMove ? 'cell-last-move' : ''}
                        `}
                        onClick={() => handleCellClick(r, c)}
                      >
                        {cell && (
                          <div
                            className={`
                              koma w-[85%] h-[85%] flex items-center justify-center
                              ${cell.owner === 'gote' ? 'gote' : ''}
                              ${isSelected ? 'selected' : ''}
                            `}
                          >
                            <span
                              className={`
                                text-amber-950 font-bold leading-none
                                ${isPromoted(cell.type) ? 'text-red-700' : ''}
                              `}
                              style={{ fontSize: 'min(4.5vw, 24px)' }}
                            >
                              {getKanjiDisplay(cell.type, cell.owner)}
                            </span>
                          </div>
                        )}
                        {isLegal && !cell && (
                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500/40" />
                        )}
                      </div>
                    );
                  })
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

      {/* 先手持ち駒 */}
      <div className="mt-2 p-2 bg-amber-100/80 rounded-lg">
        <div className="text-xs md:text-sm text-amber-700 mb-1 font-bold">
          ▲ あなたの持ち駒（タップで打つ）
        </div>
        <div className="flex flex-wrap gap-1 min-h-[2rem]">
          {capturedPieceTypes.map(pt => {
            const count = game.captured.sente[pt] || 0;
            if (count <= 0) return null;
            return (
              <button
                key={pt}
                onClick={() => handleCapturedClick(pt)}
                className={`inline-flex items-center px-3 py-1.5 rounded text-base md:text-lg font-bold transition
                  ${selectedDrop === pt
                    ? 'bg-yellow-400 text-amber-900 shadow-md'
                    : 'bg-amber-200 hover:bg-amber-300 text-amber-900'
                  }`}
              >
                {PIECE_KANJI[pt]}{count > 1 ? `×${count}` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* 成り/不成ダイアログ */}
      {showPromote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4">
            <p className="text-xl font-bold text-amber-900 text-center mb-6">
              成りますか？
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => showPromote.callback(true)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-4 rounded-xl transition active:scale-95"
              >
                成る
              </button>
              <button
                onClick={() => showPromote.callback(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-400 text-white text-xl font-bold py-4 rounded-xl transition active:scale-95"
              >
                不成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
