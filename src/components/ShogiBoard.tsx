'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
import { getComment, shouldMumble } from '@/lib/comments';
import ChatBubble, { BubbleMessage } from '@/components/ChatBubble';

interface ShogiBoardProps {
  difficulty: Difficulty;
  onBack: () => void;
}

let bubbleIdCounter = 0;

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
  const [resigned, setResigned] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [bubbles, setBubbles] = useState<BubbleMessage[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mumbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playerSide: Player = 'sente';
  const aiSide: Player = 'gote';

  const addBubble = useCallback((text: string) => {
    const id = ++bubbleIdCounter;
    setBubbles(prev => [...prev.slice(-4), { id, text }]);
  }, []);

  // 対局開始時のコメント
  useEffect(() => {
    const t = setTimeout(() => {
      addBubble(getComment('gameStart'));
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 経過時間タイマー
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 対局終了時にタイマー停止
  useEffect(() => {
    if (game.status === 'checkmate' || game.status === 'stalemate' || resigned) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mumbleTimerRef.current) clearTimeout(mumbleTimerRef.current);
    }
  }, [game.status, resigned]);

  // ランダム独り言タイマー
  const scheduleMumble = useCallback(() => {
    if (mumbleTimerRef.current) clearTimeout(mumbleTimerRef.current);
    const delay = 8000 + Math.random() * 12000;
    mumbleTimerRef.current = setTimeout(() => {
      setBubbles(prev => prev);
      addBubble(getComment('randomMumble'));
    }, delay);
  }, [addBubble]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // AI の手番処理
  const doAITurn = useCallback((currentGame: GameState) => {
    if (currentGame.status !== 'playing' && currentGame.status !== 'check') return;
    if (currentGame.turn !== aiSide) return;

    setThinking(true);
    setMessage('AIが考えています…🤔');
    addBubble(getComment('aiThinking'));

    const thinkTime = 600 + Math.random() * 800;
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

      if (aiMove.promote) {
        addBubble(getComment('promoteByAI'));
      } else {
        addBubble(getComment('aiMoved'));
      }

      if (isCheckmate(newGame.board, newGame.captured, playerSide)) {
        newGame.status = 'checkmate';
        newGame.winner = aiSide;
        setMessage('残念…AIの勝ちです。もう一局いかがですか？');
        setTimeout(() => addBubble(getComment('gameEndAIWins')), 500);
      } else if (isStalemate(newGame.board, newGame.captured, playerSide)) {
        newGame.status = 'stalemate';
        setMessage('引き分けです。いい勝負でした！');
      } else if (isInCheck(newGame.board, playerSide)) {
        newGame.status = 'check';
        setMessage('王手です！落ち着いて考えましょう');
        setTimeout(() => addBubble(getComment('checkGiven')), 300);
      } else {
        newGame.status = 'playing';
        setMessage('あなたの番です。じっくりどうぞ');
        if (shouldMumble(newGame.moveHistory.length)) {
          setTimeout(() => addBubble(getComment('randomMumble')), 2000 + Math.random() * 3000);
        }
      }

      setLastMove({ from: aiMove.from, to: aiMove.to });
      setGame(newGame);
      setThinking(false);
    }, thinkTime);
  }, [aiSide, difficulty, playerSide, addBubble]);

  // プレイヤーの手を処理
  const executePlayerMove = useCallback((move: Move, promote: boolean) => {
    const actualMove = { ...move, promote };
    const result = applyMove(game.board, game.captured, actualMove, playerSide);
    const newGame = cloneGameState(game);
    newGame.board = result.board;
    newGame.captured = result.captured;
    newGame.turn = aiSide;
    newGame.moveHistory.push(actualMove);

    if (promote) {
      addBubble(getComment('promoteByPlayer'));
    } else if (move.capture) {
      addBubble(getComment('playerCapture'));
    } else if (move.piece === 'rook' || move.piece === 'bishop' || move.piece === 'prook' || move.piece === 'pbishop') {
      addBubble(getComment('playerBigPiece'));
    } else if (move.piece === 'pawn') {
      if (Math.random() < 0.4) {
        addBubble(getComment('playerPawnPush'));
      } else {
        addBubble(getComment('playerMove'));
      }
    } else {
      if (Math.random() < 0.25) {
        addBubble(getComment('playerMoveGood'));
      } else {
        addBubble(getComment('playerMove'));
      }
    }

    if (isCheckmate(newGame.board, newGame.captured, aiSide)) {
      newGame.status = 'checkmate';
      newGame.winner = playerSide;
      setMessage('おめでとうございます！見事な勝利です！🎉');
      setTimeout(() => addBubble(getComment('gameEndPlayerWins')), 500);
    } else if (isStalemate(newGame.board, newGame.captured, aiSide)) {
      newGame.status = 'stalemate';
      setMessage('引き分けです。いい勝負でした！');
    } else if (isInCheck(newGame.board, aiSide)) {
      newGame.status = 'check';
      setMessage('王手！いい攻めですね！');
      setTimeout(() => addBubble(getComment('checkReceived')), 300);
    } else {
      newGame.status = 'playing';
    }

    setLastMove({ from: move.from, to: move.to });
    setGame(newGame);
    setSelected(null);
    setSelectedDrop(null);
    setLegalMoves([]);
    setShowPromote(null);

    if (newGame.status === 'playing' || newGame.status === 'check') {
      setTimeout(() => doAITurn(newGame), 100);
    }
  }, [game, playerSide, aiSide, doAITurn, addBubble]);

  // セルクリック
  const handleCellClick = useCallback((row: number, col: number) => {
    if (thinking) return;
    if (game.turn !== playerSide) return;
    if (game.status === 'checkmate' || game.status === 'stalemate' || resigned) return;

    const piece = game.board[row][col];

    if (selectedDrop) {
      if (piece) return;
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

        const cp = canPromoteMove(selectedPiece.type, playerSide, selected.row, row);
        const mp = mustPromote(selectedPiece.type, playerSide, row);

        if (mp) {
          executePlayerMove(move, true);
        } else if (cp) {
          setShowPromote({
            move,
            callback: (promote) => executePlayerMove(move, promote),
          });
        } else {
          executePlayerMove(move, false);
        }
        return;
      }

      if (piece && piece.owner === playerSide) {
        setSelected({ row, col });
        const moves = getPieceMoves(game.board, playerSide, row, col);
        const allLegal = getAllLegalMoves(game.board, game.captured, playerSide);
        const filtered = moves.filter(m =>
          allLegal.some(lm => lm.from && lm.from.row === row && lm.from.col === col && lm.to.row === m.row && lm.to.col === m.col)
        );
        setLegalMoves(filtered);
        return;
      }

      setSelected(null);
      setLegalMoves([]);
      return;
    }

    if (piece && piece.owner === playerSide) {
      setSelected({ row, col });
      const moves = getPieceMoves(game.board, playerSide, row, col);
      const allLegal = getAllLegalMoves(game.board, game.captured, playerSide);
      const filtered = moves.filter(m =>
        allLegal.some(lm => lm.from && lm.from.row === row && lm.from.col === col && lm.to.row === m.row && lm.to.col === m.col)
      );
      setLegalMoves(filtered);
    }
  }, [thinking, game, playerSide, selected, selectedDrop, legalMoves, executePlayerMove, resigned]);

  // 持ち駒クリック
  const handleCapturedClick = useCallback((pieceType: PieceType) => {
    if (thinking) return;
    if (game.turn !== playerSide) return;
    if (game.status === 'checkmate' || game.status === 'stalemate' || resigned) return;

    setSelected(null);
    setSelectedDrop(pieceType);

    const allLegal = getAllLegalMoves(game.board, game.captured, playerSide);
    const dropMoves = allLegal.filter(m => !m.from && m.dropPiece === pieceType);
    setLegalMoves(dropMoves.map(m => m.to));
  }, [thinking, game, playerSide, resigned]);

  // 投了
  const handleResign = () => {
    setResigned(true);
    setMessage('投了しました。お疲れさまでした。');
    setShowResignConfirm(false);
    setSelected(null);
    setSelectedDrop(null);
    setLegalMoves([]);
    addBubble(getComment('gameEndAIWins'));
  };

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
    setElapsedSeconds(0);
    setResigned(false);
    setShowResignConfirm(false);
    setBubbles([]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mumbleTimerRef.current) clearTimeout(mumbleTimerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    setTimeout(() => addBubble(getComment('gameStart')), 500);
  };

  const getKanjiDisplay = (type: AnyPieceType, owner: Player): string => {
    if (type === 'king' && owner === 'sente') return PIECE_KANJI_SENTE_KING;
    return PIECE_KANJI[type];
  };

  const difficultyLabel = difficulty === 'easy' ? 'やさしい' : difficulty === 'normal' ? 'ふつう' : 'つよい';
  const moveCount = game.moveHistory.length;

  const colNumbers = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const rowLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  const capturedPieceTypes: PieceType[] = ['rook', 'bishop', 'gold', 'silver', 'knight', 'lance', 'pawn'];

  const starPositions = [
    { row: 2, col: 6 },
    { row: 5, col: 3 },
    { row: 5, col: 6 },
    { row: 2, col: 3 },
  ];

  const isGameOver = game.status === 'checkmate' || game.status === 'stalemate' || resigned;

  return (
    <div className="no-scroll select-none relative">
      {/* Floating chat bubble - overlays on the board */}
      <ChatBubble messages={bubbles} />

      {/* Status bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={onBack}
          className="text-amber-800 hover:text-amber-600 text-base font-bold py-1.5 px-3 rounded-2xl hover:bg-white/60 transition-all active:scale-95"
        >
          ← 戻る
        </button>
        <span className="game-info-pill text-sm font-bold">
          {difficultyLabel}
        </span>
        <button
          onClick={handleReset}
          className="text-amber-800 hover:text-amber-600 text-base font-bold py-1.5 px-3 rounded-2xl hover:bg-white/60 transition-all active:scale-95"
        >
          🔄 最初から
        </button>
      </div>

      {/* Move count & time */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="game-info-pill">
          📋 {moveCount}手目
        </span>
        <span className="game-info-pill">
          ⏱ {formatTime(elapsedSeconds)}
        </span>
      </div>

      {/* Message */}
      <div className={`text-center text-lg md:text-xl font-bold mb-3 py-2.5 rounded-2xl backdrop-blur-sm ${
        isGameOver
          ? (game.winner === playerSide && !resigned)
            ? 'bg-green-100/80 text-green-800 border border-green-200/60'
            : 'bg-red-50/80 text-red-800 border border-red-200/60'
          : game.status === 'check'
            ? 'bg-yellow-100/80 text-yellow-800 border border-yellow-200/60'
            : thinking
              ? 'bg-blue-50/80 text-blue-800 border border-blue-200/60'
              : 'bg-white/60 text-amber-800 border border-amber-200/40'
      }`}>
        {message}
      </div>

      {/* Gote captured pieces */}
      <div className="mb-2 p-2 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-200/30">
        <div className="text-xs text-amber-600 mb-1 font-bold">
          △ AI の持ち駒
        </div>
        <div className="flex flex-wrap gap-1 min-h-[1.75rem]">
          {capturedPieceTypes.map(pt => {
            const count = game.captured.gote[pt] || 0;
            if (count <= 0) return null;
            return (
              <span key={pt} className="inline-flex items-center bg-amber-100/80 px-2 py-0.5 rounded-full text-sm font-bold text-amber-900">
                {PIECE_KANJI[pt]}{count > 1 ? `×${count}` : ''}
              </span>
            );
          })}
        </div>
      </div>

      {/* Board */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex ml-6 mr-4">
            {colNumbers.map((n, i) => (
              <div key={i} className="flex-1 text-center text-xs md:text-sm text-amber-600 font-bold">
                {n}
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="board-texture rounded-lg shadow-lg border-2 border-amber-900/40 p-0">
              <div className="grid grid-cols-9 relative" style={{ width: 'min(85vw, 450px)', height: 'min(85vw, 450px)' }}>
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
                          border border-amber-900/40 flex items-center justify-center relative aspect-square
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

            <div className="flex flex-col ml-1">
              {rowLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center text-xs md:text-sm text-amber-600 font-bold"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sente captured pieces */}
      <div className="mt-2 p-2 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-200/30">
        <div className="text-xs text-amber-600 mb-1 font-bold">
          ▲ あなたの持ち駒（タップで打つ）
        </div>
        <div className="flex flex-wrap gap-1 min-h-[1.75rem]">
          {capturedPieceTypes.map(pt => {
            const count = game.captured.sente[pt] || 0;
            if (count <= 0) return null;
            return (
              <button
                key={pt}
                onClick={() => handleCapturedClick(pt)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-base font-bold transition-all active:scale-95
                  ${selectedDrop === pt
                    ? 'bg-yellow-400 text-amber-900 shadow-md'
                    : 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-900'
                  }`}
              >
                {PIECE_KANJI[pt]}{count > 1 ? `×${count}` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resign button */}
      {!isGameOver && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowResignConfirm(true)}
            className="text-amber-600/60 hover:text-red-600 text-sm font-bold py-2 px-6 rounded-full border border-amber-200/40 hover:border-red-300 hover:bg-red-50/50 transition-all active:scale-95"
          >
            🏳 投了する
          </button>
        </div>
      )}

      {/* Rematch button */}
      {isGameOver && (
        <div className="mt-4 text-center">
          <button
            onClick={handleReset}
            className="btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-lg font-bold py-3 px-8 shadow-lg active:scale-95"
          >
            🔄 もう一局
          </button>
        </div>
      )}

      {/* Resign confirm dialog */}
      {showResignConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="ios-card p-6 max-w-xs w-full mx-4">
            <p className="text-xl font-bold text-amber-900 text-center mb-2">
              投了しますか？
            </p>
            <p className="text-sm text-amber-600 text-center mb-6">
              AIの勝ちになります
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResign}
                className="flex-1 btn-ios bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-3.5 active:scale-95"
              >
                投了
              </button>
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 btn-ios bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-bold py-3.5 active:scale-95"
              >
                続ける
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote dialog */}
      {showPromote && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="ios-card p-6 max-w-xs w-full mx-4">
            <p className="text-xl font-bold text-amber-900 text-center mb-6">
              成りますか？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => showPromote.callback(true)}
                className="flex-1 btn-ios bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-3.5 active:scale-95"
              >
                成る
              </button>
              <button
                onClick={() => showPromote.callback(false)}
                className="flex-1 btn-ios bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-bold py-3.5 active:scale-95"
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
