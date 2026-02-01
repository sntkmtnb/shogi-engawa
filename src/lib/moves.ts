import {
  Board, Piece, Player, AnyPieceType, PieceType, Position, Move,
  CapturedPieces, isPromoted, canPromote, baseType,
  PROMOTE_MAP, UNPROMOTE_MAP,
} from './types';
import { cloneBoard, cloneCaptured } from './board';

const opponent = (p: Player): Player => (p === 'sente' ? 'gote' : 'sente');

// 方向: 先手は上へ(-1)、後手は下へ(+1)
const forward = (p: Player): number => (p === 'sente' ? -1 : 1);

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 9 && c >= 0 && c < 9;
}

// 駒の移動可能マス（成り前の基本移動）
function getRawMoves(type: AnyPieceType, owner: Player, row: number, col: number): Position[] {
  const f = forward(owner);
  const positions: Position[] = [];

  const add = (r: number, c: number) => {
    if (inBounds(r, c)) positions.push({ row: r, col: c });
  };

  // 成り駒の動き
  if (isPromoted(type)) {
    const base = UNPROMOTE_MAP[type];
    if (base === 'rook') {
      // 龍: 飛車+斜め1マス
      addLineMoves(positions, row, col, [[-1,0],[1,0],[0,-1],[0,1]], 9);
      add(row-1, col-1); add(row-1, col+1);
      add(row+1, col-1); add(row+1, col+1);
      return positions;
    }
    if (base === 'bishop') {
      // 馬: 角+上下左右1マス
      addLineMoves(positions, row, col, [[-1,-1],[-1,1],[1,-1],[1,1]], 9);
      add(row-1, col); add(row+1, col);
      add(row, col-1); add(row, col+1);
      return positions;
    }
    // 成銀、成桂、成香、と金 → 金と同じ動き
    add(row + f, col - 1); add(row + f, col); add(row + f, col + 1);
    add(row, col - 1); add(row, col + 1);
    add(row - f, col);
    return positions;
  }

  switch (type) {
    case 'king':
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0) add(row + dr, col + dc);
      break;
    case 'rook':
      addLineMoves(positions, row, col, [[-1,0],[1,0],[0,-1],[0,1]], 9);
      break;
    case 'bishop':
      addLineMoves(positions, row, col, [[-1,-1],[-1,1],[1,-1],[1,1]], 9);
      break;
    case 'gold':
      add(row + f, col - 1); add(row + f, col); add(row + f, col + 1);
      add(row, col - 1); add(row, col + 1);
      add(row - f, col);
      break;
    case 'silver':
      add(row + f, col - 1); add(row + f, col); add(row + f, col + 1);
      add(row - f, col - 1); add(row - f, col + 1);
      break;
    case 'knight':
      add(row + f * 2, col - 1);
      add(row + f * 2, col + 1);
      break;
    case 'lance':
      addLineMoves(positions, row, col, [[f, 0]], 9);
      break;
    case 'pawn':
      add(row + f, col);
      break;
  }
  return positions;
}

function addLineMoves(positions: Position[], row: number, col: number, dirs: number[][], _max: number) {
  // 走り駒の場合、盤面チェックは後でフィルタするのでここでは全マス追加
  // ただし途中の駒ブロックは getLegalMovesForPiece で処理
  for (const [dr, dc] of dirs) {
    for (let i = 1; i < 9; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (!inBounds(r, c)) break;
      positions.push({ row: r, col: c });
    }
  }
}

// 走り駒の途中ブロック考慮版
function getFilteredLineMoves(
  board: Board, type: AnyPieceType, owner: Player, row: number, col: number
): Position[] {
  const f = forward(owner);
  const positions: Position[] = [];

  const slideDirs: number[][] = [];

  if (isPromoted(type)) {
    const base = UNPROMOTE_MAP[type];
    if (base === 'rook') {
      slideDirs.push([-1,0],[1,0],[0,-1],[0,1]);
      // 斜め1マス
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
        const r = row + dr, c = col + dc;
        if (inBounds(r, c)) {
          const target = board[r][c];
          if (!target || target.owner !== owner) positions.push({ row: r, col: c });
        }
      }
    } else if (base === 'bishop') {
      slideDirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const r = row + dr, c = col + dc;
        if (inBounds(r, c)) {
          const target = board[r][c];
          if (!target || target.owner !== owner) positions.push({ row: r, col: c });
        }
      }
    } else {
      // 成り駒(金動き) - 走り駒ではない
      return getNonSlideMoves(board, type, owner, row, col);
    }
  } else {
    switch (type) {
      case 'rook': slideDirs.push([-1,0],[1,0],[0,-1],[0,1]); break;
      case 'bishop': slideDirs.push([-1,-1],[-1,1],[1,-1],[1,1]); break;
      case 'lance': slideDirs.push([f, 0]); break;
      default:
        return getNonSlideMoves(board, type, owner, row, col);
    }
  }

  for (const [dr, dc] of slideDirs) {
    for (let i = 1; i < 9; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (!inBounds(r, c)) break;
      const target = board[r][c];
      if (target) {
        if (target.owner !== owner) positions.push({ row: r, col: c });
        break;
      }
      positions.push({ row: r, col: c });
    }
  }

  return positions;
}

function getNonSlideMoves(
  board: Board, type: AnyPieceType, owner: Player, row: number, col: number
): Position[] {
  const raw = getRawMoves(type, owner, row, col);
  return raw.filter(({ row: r, col: c }) => {
    const target = board[r][c];
    return !target || target.owner !== owner;
  });
}

// 駒の合法移動先を取得（自分の駒があるマスは除外、走り駒のブロック考慮）
export function getPieceMoves(
  board: Board, owner: Player, row: number, col: number
): Position[] {
  const piece = board[row][col];
  if (!piece || piece.owner !== owner) return [];
  return getFilteredLineMoves(board, piece.type, owner, row, col);
}

// 成りが可能かチェック
export function canPromoteMove(piece: AnyPieceType, owner: Player, fromRow: number, toRow: number): boolean {
  if (!canPromote(piece)) return false;
  if (isPromoted(piece)) return false;
  // 敵陣（相手の1-3段目）
  if (owner === 'sente') {
    return fromRow <= 2 || toRow <= 2;
  } else {
    return fromRow >= 6 || toRow >= 6;
  }
}

// 成りが強制かチェック（行き場のない駒）
export function mustPromote(piece: AnyPieceType, owner: Player, toRow: number): boolean {
  if (owner === 'sente') {
    if (piece === 'pawn' || piece === 'lance') return toRow === 0;
    if (piece === 'knight') return toRow <= 1;
  } else {
    if (piece === 'pawn' || piece === 'lance') return toRow === 8;
    if (piece === 'knight') return toRow >= 7;
  }
  return false;
}

// 王の位置を見つける
export function findKing(board: Board, player: Player): Position | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p && p.type === 'king' && p.owner === player) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

// 王手判定: playerの王が相手から攻撃されているか
export function isInCheck(board: Board, player: Player): boolean {
  const kingPos = findKing(board, player);
  if (!kingPos) return false; // 王がない（理論上ありえないが安全のため）
  const opp = opponent(player);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.owner === opp) {
        const moves = getFilteredLineMoves(board, piece.type, opp, r, c);
        if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

// 指し手を実行（盤面を変更して新しいboardとcapturedを返す）
export function applyMove(
  board: Board, captured: CapturedPieces, move: Move, player: Player
): { board: Board; captured: CapturedPieces } {
  const newBoard = cloneBoard(board);
  const newCaptured = cloneCaptured(captured);

  if (move.from) {
    // 盤上の駒を移動
    const piece = newBoard[move.from.row][move.from.col]!;
    newBoard[move.from.row][move.from.col] = null;

    // 相手の駒を取る
    const target = newBoard[move.to.row][move.to.col];
    if (target) {
      const capturedType = baseType(target.type);
      newCaptured[player][capturedType] = (newCaptured[player][capturedType] || 0) + 1;
    }

    // 成り
    let newType = piece.type;
    if (move.promote && canPromote(piece.type)) {
      newType = PROMOTE_MAP[piece.type as PieceType]!;
    }
    newBoard[move.to.row][move.to.col] = { type: newType, owner: player };
  } else {
    // 持ち駒を打つ
    const dropType = move.dropPiece || (move.piece as PieceType);
    newBoard[move.to.row][move.to.col] = { type: dropType, owner: player };
    newCaptured[player][dropType] = (newCaptured[player][dropType] || 0) - 1;
    if (newCaptured[player][dropType]! <= 0) {
      delete newCaptured[player][dropType];
    }
  }

  return { board: newBoard, captured: newCaptured };
}

// 二歩チェック: その筋に既に味方の歩があるか
function hasPawnInColumn(board: Board, player: Player, col: number): boolean {
  for (let r = 0; r < 9; r++) {
    const p = board[r][col];
    if (p && p.type === 'pawn' && p.owner === player) return true;
  }
  return false;
}

// 打ちの合法手を取得
export function getDropMoves(board: Board, captured: CapturedPieces, player: Player): Move[] {
  const moves: Move[] = [];
  const hand = captured[player];

  for (const pieceType of Object.keys(hand) as PieceType[]) {
    if (!hand[pieceType] || hand[pieceType]! <= 0) continue;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c]) continue; // 既に駒がある

        // 二歩チェック
        if (pieceType === 'pawn' && hasPawnInColumn(board, player, c)) continue;

        // 行き場のない駒チェック
        if (mustPromote(pieceType, player, r)) continue;

        moves.push({
          from: null,
          to: { row: r, col: c },
          piece: pieceType,
          dropPiece: pieceType,
        });
      }
    }
  }
  return moves;
}

// 全合法手取得（王手回避含む）
export function getAllLegalMoves(board: Board, captured: CapturedPieces, player: Player): Move[] {
  const moves: Move[] = [];

  // 盤上の駒の移動
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (!piece || piece.owner !== player) continue;

      const targets = getFilteredLineMoves(board, piece.type, player, r, c);
      for (const to of targets) {
        const from = { row: r, col: c };
        const cp = canPromoteMove(piece.type, player, r, to.row);
        const mp = mustPromote(piece.type, player, to.row);

        if (cp) {
          // 成り
          moves.push({ from, to, piece: piece.type, promote: true, capture: board[to.row][to.col] });
          // 不成（強制成りでなければ）
          if (!mp) {
            moves.push({ from, to, piece: piece.type, promote: false, capture: board[to.row][to.col] });
          }
        } else {
          moves.push({ from, to, piece: piece.type, promote: false, capture: board[to.row][to.col] });
        }
      }
    }
  }

  // 打ち
  const dropMoves = getDropMoves(board, captured, player);
  moves.push(...dropMoves);

  // 王手回避フィルタ：指した後に自分の王が取られない手だけ
  return moves.filter(move => {
    const result = applyMove(board, captured, move, player);
    return !isInCheck(result.board, player);
  });
}

// 詰み判定
export function isCheckmate(board: Board, captured: CapturedPieces, player: Player): boolean {
  if (!isInCheck(board, player)) return false;
  return getAllLegalMoves(board, captured, player).length === 0;
}

// ステイルメイト（合法手なし、王手でない）
export function isStalemate(board: Board, captured: CapturedPieces, player: Player): boolean {
  if (isInCheck(board, player)) return false;
  return getAllLegalMoves(board, captured, player).length === 0;
}
