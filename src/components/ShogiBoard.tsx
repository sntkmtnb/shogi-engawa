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
import { getComment, shouldMumble, getTimeBasedGreeting, getReviewComments } from '@/lib/comments';
import { playKomaSound, playCheckSound } from '@/lib/sound';
import ChatArea, { ChatMessage } from '@/components/ChatArea';

interface ShogiBoardProps {
  difficulty: Difficulty;
  onBack: () => void;
}

let chatIdCounter = 0;

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
  const [resigned, setResigned] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState<{
    result: 'win' | 'lose' | 'draw';
    comment: string;
  } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewComments, setReviewComments] = useState<string[]>([]);
  const [visibleReviewCount, setVisibleReviewCount] = useState(0);
  const mumbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playerSide: Player = 'sente';
  const aiSide: Player = 'gote';

  const addChat = useCallback((text: string) => {
    const id = ++chatIdCounter;
    setChatMessages(prev => {
      const next = [...prev, { id, text, timestamp: Date.now() }];
      // Keep max 50 messages
      if (next.length > 50) return next.slice(-50);
      return next;
    });
  }, []);

  // Opening comment - time-based greeting
  useEffect(() => {
    const t = setTimeout(() => addChat(getTimeBasedGreeting()), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop mumble timer on game end
  useEffect(() => {
    if (game.status === 'checkmate' || game.status === 'stalemate' || resigned) {
      if (mumbleTimerRef.current) clearTimeout(mumbleTimerRef.current);
    }
  }, [game.status, resigned]);

  // Review comments fade-in effect
  useEffect(() => {
    if (showReview && visibleReviewCount < reviewComments.length) {
      const t = setTimeout(() => {
        setVisibleReviewCount(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [showReview, visibleReviewCount, reviewComments.length]);

  // AI turn
  const doAITurn = useCallback((currentGame: GameState) => {
    if (currentGame.status !== 'playing' && currentGame.status !== 'check') return;
    if (currentGame.turn !== aiSide) return;

    setThinking(true);
    addChat(getComment('aiThinking'));

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

      playKomaSound();

      if (aiMove.promote) {
        addChat(getComment('promoteByAI'));
      } else {
        addChat(getComment('aiMoved'));
      }

      if (isCheckmate(newGame.board, newGame.captured, playerSide)) {
        newGame.status = 'checkmate';
        newGame.winner = aiSide;
        setTimeout(() => {
          const comment = getComment('gameEndAIWins');
          addChat(comment);
          setGameOverInfo({ result: 'lose', comment });
          setShowGameOver(true);
        }, 500);
      } else if (isStalemate(newGame.board, newGame.captured, playerSide)) {
        newGame.status = 'stalemate';
        setGameOverInfo({ result: 'draw', comment: 'いい勝負やったなぁ！' });
        setShowGameOver(true);
      } else if (isInCheck(newGame.board, playerSide)) {
        newGame.status = 'check';
        setTimeout(() => {
          playCheckSound();
          addChat(getComment('checkGiven'));
        }, 300);
      } else {
        newGame.status = 'playing';
        if (shouldMumble(newGame.moveHistory.length)) {
          setTimeout(() => addChat(getComment('randomMumble')), 2000 + Math.random() * 3000);
        }
      }

      setLastMove({ from: aiMove.from, to: aiMove.to });
      setGame(newGame);
      setThinking(false);
    }, thinkTime);
  }, [aiSide, difficulty, playerSide, addChat]);

  // Player move
  const executePlayerMove = useCallback((move: Move, promote: boolean) => {
    const actualMove = { ...move, promote };
    const result = applyMove(game.board, game.captured, actualMove, playerSide);
    const newGame = cloneGameState(game);
    newGame.board = result.board;
    newGame.captured = result.captured;
    newGame.turn = aiSide;
    newGame.moveHistory.push(actualMove);

    playKomaSound();

    if (promote) {
      addChat(getComment('promoteByPlayer'));
    } else if (move.capture) {
      addChat(getComment('playerCapture'));
    } else if (move.piece === 'rook' || move.piece === 'bishop' || move.piece === 'prook' || move.piece === 'pbishop') {
      addChat(getComment('playerBigPiece'));
    } else if (move.piece === 'pawn') {
      if (Math.random() < 0.4) {
        addChat(getComment('playerPawnPush'));
      } else {
        addChat(getComment('playerMove'));
      }
    } else {
      if (Math.random() < 0.25) {
        addChat(getComment('playerMoveGood'));
      } else {
        addChat(getComment('playerMove'));
      }
    }

    if (isCheckmate(newGame.board, newGame.captured, aiSide)) {
      newGame.status = 'checkmate';
      newGame.winner = playerSide;
      setTimeout(() => {
        const comment = getComment('gameEndPlayerWins');
        addChat(comment);
        setGameOverInfo({ result: 'win', comment });
        setShowGameOver(true);
      }, 500);
    } else if (isStalemate(newGame.board, newGame.captured, aiSide)) {
      newGame.status = 'stalemate';
      setGameOverInfo({ result: 'draw', comment: 'いい勝負やったなぁ！' });
      setShowGameOver(true);
    } else if (isInCheck(newGame.board, aiSide)) {
      newGame.status = 'check';
      setTimeout(() => {
        playCheckSound();
        addChat(getComment('checkReceived'));
      }, 300);
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
  }, [game, playerSide, aiSide, doAITurn, addChat]);

  // Cell click
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

  // Captured piece click
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

  // Resign
  const handleResign = () => {
    setResigned(true);
    setShowResignConfirm(false);
    setSelected(null);
    setSelectedDrop(null);
    setLegalMoves([]);
    const comment = getComment('gameEndAIWins');
    addChat(comment);
    setGameOverInfo({ result: 'lose', comment });
    setShowGameOver(true);
  };

  // Reset
  const handleReset = () => {
    setGame(createInitialGameState());
    setSelected(null);
    setSelectedDrop(null);
    setLegalMoves([]);
    setLastMove(null);
    setShowPromote(null);
    setThinking(false);
    setResigned(false);
    setShowResignConfirm(false);
    setShowGameOver(false);
    setGameOverInfo(null);
    setShowReview(false);
    setReviewComments([]);
    setVisibleReviewCount(0);
    setChatMessages([]);
    if (mumbleTimerRef.current) clearTimeout(mumbleTimerRef.current);
    setTimeout(() => addChat(getTimeBasedGreeting()), 500);
  };

  const getKanjiDisplay = (type: AnyPieceType, owner: Player): string => {
    if (type === 'king' && owner === 'sente') return PIECE_KANJI_SENTE_KING;
    return PIECE_KANJI[type];
  };

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

  // Board size: calculated from CSS using dvh
  // Layout: chat(~15dvh) + goteCaptured(~4dvh) + board + senteCaptured(~4dvh) + controls(~4dvh)
  // Available for board: 100dvh - 15 - 4 - 4 - 4 = ~73dvh, minus some padding
  // Board = min(~65dvh, 100vw - padding)
  const boardSize = 'min(calc(100dvh - 200px), calc(100vw - 16px))';

  return (
    <div
      className="no-scroll select-none flex flex-col"
      style={{ height: '100dvh', maxHeight: '100dvh', overflow: 'hidden' }}
    >
      {/* Chat area - top, compact */}
      <div
        className="flex-shrink-0"
        style={{
          maxHeight: '15dvh',
          minHeight: '56px',
          background: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
        }}
      >
        <ChatArea messages={chatMessages} />
      </div>

      {/* AI captured pieces */}
      <div className="flex-shrink-0 px-2 py-0.5">
        <div className="flex items-center gap-1 min-h-[20px]">
          <span className="text-[10px] text-amber-600 font-bold whitespace-nowrap">△AI</span>
          <div className="flex flex-wrap gap-0.5">
            {capturedPieceTypes.map(pt => {
              const count = game.captured.gote[pt] || 0;
              if (count <= 0) return null;
              return (
                <span key={pt} className="inline-flex items-center bg-amber-100/60 px-1.5 py-0 rounded-full text-xs font-bold text-amber-900">
                  {PIECE_KANJI[pt]}{count > 1 ? `×${count}` : ''}
                </span>
              );
            })}
          </div>
          {thinking && (
            <span className="ml-auto text-[10px] text-blue-600 font-bold animate-pulse">🤔考え中…</span>
          )}
          {game.status === 'check' && !isGameOver && (
            <span className="ml-auto text-[10px] text-yellow-700 font-bold">⚠️王手</span>
          )}
        </div>
      </div>

      {/* Board - center, flex-1 */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-1">
        <div className="relative">
          {/* Column numbers */}
          <div className="flex ml-5 mr-3" style={{ width: boardSize }}>
            {colNumbers.map((n, i) => (
              <div key={i} className="flex-1 text-center text-base md:text-lg text-amber-900 font-bold" style={{ background: 'rgba(222,184,135,0.3)', borderRadius: '2px' }}>
                {n}
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="board-texture rounded-lg shadow-lg border-2 border-amber-900/40">
              <div
                className="grid grid-cols-9 relative"
                style={{ width: boardSize, height: boardSize }}
              >
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
                              style={{ fontSize: `calc(${boardSize} / 9 * 0.5)` }}
                            >
                              {getKanjiDisplay(cell.type, cell.owner)}
                            </span>
                          </div>
                        )}
                        {isLegal && !cell && (
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500/50 border border-green-600/30" />
                        )}
                        {isLegal && cell && (
                          <div className="absolute inset-0 bg-red-400/30 pointer-events-none" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Row labels */}
            <div className="flex flex-col ml-1 mr-2" style={{ height: boardSize }}>
              {rowLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center text-base md:text-lg text-amber-900 font-bold"
                  style={{ background: 'rgba(222,184,135,0.3)', borderRadius: '2px' }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player captured pieces */}
      <div className="flex-shrink-0 px-2 py-0.5">
        <div className="flex items-center gap-1 min-h-[24px]">
          <span className="text-[10px] text-amber-600 font-bold whitespace-nowrap">▲自分</span>
          <div className="flex flex-wrap gap-0.5">
            {capturedPieceTypes.map(pt => {
              const count = game.captured.sente[pt] || 0;
              if (count <= 0) return null;
              return (
                <button
                  key={pt}
                  onClick={() => handleCapturedClick(pt)}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold transition-all active:scale-95
                    ${selectedDrop === pt
                      ? 'bg-yellow-400 text-amber-900 shadow-md'
                      : 'bg-amber-100/70 text-amber-900'
                    }`}
                >
                  {PIECE_KANJI[pt]}{count > 1 ? `×${count}` : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control bar - bottom, compact icons */}
      <div className="flex-shrink-0 flex items-center justify-center gap-8 px-4 py-1 pb-[calc(4px+env(safe-area-inset-bottom,0px))]">
        <button
          onClick={onBack}
          className="text-amber-700/60 hover:text-amber-800 text-lg active:scale-90 transition-all p-1.5"
          title="戻る"
        >
          ←
        </button>
        <button
          onClick={handleReset}
          className="text-amber-700/60 hover:text-amber-800 text-lg active:scale-90 transition-all p-1.5"
          title="最初から"
        >
          🔄
        </button>
        {!isGameOver && (
          <button
            onClick={() => setShowResignConfirm(true)}
            className="text-amber-700/60 hover:text-red-600 text-lg active:scale-90 transition-all p-1.5"
            title="投了"
          >
            🏳️
          </button>
        )}
      </div>

      {/* ===== Game Over Popup ===== */}
      {showGameOver && gameOverInfo && (
        <div className="game-over-overlay">
          <div className="game-over-modal" style={{ maxHeight: '85dvh', overflowY: 'auto' }}>
            {!showReview ? (
              <>
                {gameOverInfo.result === 'win' && (
                  <>
                    <div className="text-5xl mb-3">🎉</div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">
                      おめでとうございます！
                    </h2>
                    <p className="text-base text-amber-700 mb-1">見事な勝利です！</p>
                  </>
                )}
                {gameOverInfo.result === 'lose' && (
                  <>
                    <div className="text-5xl mb-3">😤</div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">
                      残念！
                    </h2>
                    <p className="text-base text-amber-700 mb-1">次は勝てるはず…！</p>
                  </>
                )}
                {gameOverInfo.result === 'draw' && (
                  <>
                    <div className="text-5xl mb-3">🤝</div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">
                      いい勝負！
                    </h2>
                  </>
                )}

                {/* Gen-san's comment */}
                <div className="flex items-start gap-2 mt-3 mb-5 text-left bg-amber-50/60 rounded-xl p-3">
                  <div className="chat-avatar flex-shrink-0">源</div>
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    {gameOverInfo.comment}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const comments = getReviewComments(
                        gameOverInfo.result === 'win',
                        game.moveHistory.length
                      );
                      setReviewComments(comments);
                      setVisibleReviewCount(1);
                      setShowReview(true);
                    }}
                    className="w-full btn-ios bg-amber-100/80 text-amber-800 text-base font-bold py-3 border border-amber-300/40 active:scale-95"
                  >
                    🍵 感想戦を見る
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-base font-bold py-3 active:scale-95"
                    >
                      🔄 もう一局
                    </button>
                    <button
                      onClick={onBack}
                      className="flex-1 btn-ios bg-white/60 text-amber-800 text-base font-bold py-3 border border-amber-200/40 active:scale-95"
                    >
                      戻る
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2">🍵</div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">感想戦</h2>

                <div className="flex flex-col gap-3 mb-5">
                  {reviewComments.slice(0, visibleReviewCount).map((comment, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-left bg-amber-50/60 rounded-xl p-3"
                      style={{
                        animation: 'chatMsgIn 0.5s ease-out',
                      }}
                    >
                      <div className="chat-avatar flex-shrink-0">源</div>
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        {comment}
                      </p>
                    </div>
                  ))}
                  {visibleReviewCount < reviewComments.length && (
                    <div className="text-center text-amber-600 text-xs animate-pulse">…</div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-base font-bold py-3 active:scale-95"
                  >
                    🔄 もう一局
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 btn-ios bg-white/60 text-amber-800 text-base font-bold py-3 border border-amber-200/40 active:scale-95"
                  >
                    戻る
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Resign confirm */}
      {showResignConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="game-over-modal">
            <p className="text-xl font-bold text-amber-900 text-center mb-2">
              投了しますか？
            </p>
            <p className="text-sm text-amber-600 text-center mb-5">
              AIの勝ちになります
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResign}
                className="flex-1 btn-ios bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-3 active:scale-95"
              >
                投了
              </button>
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 btn-ios bg-white/60 text-gray-700 text-lg font-bold py-3 border border-gray-200/40 active:scale-95"
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
          <div className="game-over-modal">
            <p className="text-xl font-bold text-amber-900 text-center mb-5">
              成りますか？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => showPromote.callback(true)}
                className="flex-1 btn-ios bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-3 active:scale-95"
              >
                成る
              </button>
              <button
                onClick={() => showPromote.callback(false)}
                className="flex-1 btn-ios bg-white/60 text-gray-700 text-lg font-bold py-3 border border-gray-200/40 active:scale-95"
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
