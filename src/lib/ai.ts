import {
  Board, CapturedPieces, Player, Move, Difficulty,
  AnyPieceType, PIECE_VALUES, isPromoted,
} from './types';
import { getAllLegalMoves, applyMove, isInCheck, isCheckmate } from './moves';

const opponent = (p: Player): Player => (p === 'sente' ? 'gote' : 'sente');

// 盤面評価関数
function evaluate(board: Board, captured: CapturedPieces, player: Player): number {
  let score = 0;

  // 盤上の駒の価値
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type];
      if (piece.owner === player) {
        score += value;
        // 位置ボーナス：前進した駒にボーナス
        if (player === 'sente') {
          score += (8 - r) * 0.1;
        } else {
          score += r * 0.1;
        }
      } else {
        score -= value;
      }
    }
  }

  // 持ち駒の価値（盤上より少し低い）
  for (const pt of Object.keys(captured[player]) as AnyPieceType[]) {
    score += (captured[player] as Record<string, number>)[pt] * PIECE_VALUES[pt] * 0.9;
  }
  const opp = opponent(player);
  for (const pt of Object.keys(captured[opp]) as AnyPieceType[]) {
    score -= (captured[opp] as Record<string, number>)[pt] * PIECE_VALUES[pt] * 0.9;
  }

  // 王手ボーナス
  if (isInCheck(board, opponent(player))) score += 3;

  return score;
}

// ミニマックス+アルファベータ
function minimax(
  board: Board,
  captured: CapturedPieces,
  player: Player,
  aiPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluate(board, captured, aiPlayer);
  }

  const moves = getAllLegalMoves(board, captured, player);

  if (moves.length === 0) {
    if (isCheckmate(board, captured, player)) {
      return isMaximizing ? -10000 + (4 - depth) : 10000 - (4 - depth);
    }
    return 0; // stalemate
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const result = applyMove(board, captured, move, player);
      const eval_ = minimax(result.board, result.captured, opponent(player), aiPlayer, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const result = applyMove(board, captured, move, player);
      const eval_ = minimax(result.board, result.captured, opponent(player), aiPlayer, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// AI手の選択
export function getAIMove(
  board: Board,
  captured: CapturedPieces,
  player: Player,
  difficulty: Difficulty
): Move | null {
  const moves = getAllLegalMoves(board, captured, player);
  if (moves.length === 0) return null;

  switch (difficulty) {
    case 'easy': {
      // ランダム
      return moves[Math.floor(Math.random() * moves.length)];
    }
    case 'normal': {
      // 簡単な評価: 駒を取れる手を優先、それ以外はランダム
      let bestScore = -Infinity;
      let bestMoves: Move[] = [];
      for (const move of moves) {
        let score = Math.random() * 2; // ランダム要素
        if (move.capture) {
          score += PIECE_VALUES[move.capture.type] * 10;
        }
        if (move.promote) score += 5;
        // 王手ボーナス
        const result = applyMove(board, captured, move, player);
        if (isInCheck(result.board, opponent(player))) score += 8;
        if (isCheckmate(result.board, result.captured, opponent(player))) score += 1000;

        if (score > bestScore) {
          bestScore = score;
          bestMoves = [move];
        } else if (score === bestScore) {
          bestMoves.push(move);
        }
      }
      return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
    case 'hard': {
      // ミニマックス（深さ3）
      // 手数を制限して計算量を抑える
      const limitedMoves = moves.length > 30 ? prioritizeMoves(moves, board).slice(0, 30) : moves;

      let bestScore = -Infinity;
      let bestMove = limitedMoves[0];

      for (const move of limitedMoves) {
        const result = applyMove(board, captured, move, player);
        const score = minimax(
          result.board, result.captured, opponent(player), player, 2, -Infinity, Infinity, false
        );
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }
  }
}

// 手の優先順位付け（アルファベータの効率化）
function prioritizeMoves(moves: Move[], board: Board): Move[] {
  return [...moves].sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    if (a.capture) scoreA += PIECE_VALUES[a.capture.type] * 10;
    if (b.capture) scoreB += PIECE_VALUES[b.capture.type] * 10;
    if (a.promote) scoreA += 5;
    if (b.promote) scoreB += 5;
    return scoreB - scoreA;
  });
}
