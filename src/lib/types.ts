// 将棋の型定義

export type Player = 'sente' | 'gote'; // 先手(下) / 後手(上)

export type PieceType =
  | 'king'   // 王/玉
  | 'rook'   // 飛
  | 'bishop' // 角
  | 'gold'   // 金
  | 'silver' // 銀
  | 'knight' // 桂
  | 'lance'  // 香
  | 'pawn';  // 歩

export type PromotedPieceType =
  | 'prook'   // 龍（成飛）
  | 'pbishop' // 馬（成角）
  | 'psilver' // 成銀
  | 'pknight' // 成桂
  | 'plance'  // 成香
  | 'ppawn';  // と

export type AnyPieceType = PieceType | PromotedPieceType;

export interface Piece {
  type: AnyPieceType;
  owner: Player;
}

// Board[row][col] - row 0=上(後手陣), row 8=下(先手陣)
// col 0=左(9筋), col 8=右(1筋)  ← 表示は右から左
export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position | null; // null = 持ち駒から打つ
  to: Position;
  piece: AnyPieceType;
  promote?: boolean;
  capture?: Piece | null;
  dropPiece?: PieceType; // 打ちの場合の駒種
}

export type CapturedPieces = Record<Player, Partial<Record<PieceType, number>>>;

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameState {
  board: Board;
  turn: Player;
  captured: CapturedPieces;
  moveHistory: Move[];
  status: 'playing' | 'check' | 'checkmate' | 'stalemate';
  winner: Player | null;
}

// 駒の日本語表示マッピング
export const PIECE_KANJI: Record<AnyPieceType, string> = {
  king: '王',
  rook: '飛',
  bishop: '角',
  gold: '金',
  silver: '銀',
  knight: '桂',
  lance: '香',
  pawn: '歩',
  prook: '龍',
  pbishop: '馬',
  psilver: '全',
  pknight: '圭',
  plance: '杏',
  ppawn: 'と',
};

// 先手の王は「玉」
export const PIECE_KANJI_SENTE_KING = '玉';

// 成れる駒のマッピング
export const PROMOTE_MAP: Partial<Record<AnyPieceType, PromotedPieceType>> = {
  rook: 'prook',
  bishop: 'pbishop',
  silver: 'psilver',
  knight: 'pknight',
  lance: 'plance',
  pawn: 'ppawn',
};

// 成り駒→元の駒
export const UNPROMOTE_MAP: Record<PromotedPieceType, PieceType> = {
  prook: 'rook',
  pbishop: 'bishop',
  psilver: 'silver',
  pknight: 'knight',
  plance: 'lance',
  ppawn: 'pawn',
};

export const PIECE_VALUES: Record<AnyPieceType, number> = {
  pawn: 1,
  lance: 3,
  knight: 4,
  silver: 5,
  gold: 6,
  bishop: 8,
  rook: 10,
  king: 0, // 王は特別
  ppawn: 7,
  plance: 6,
  pknight: 6,
  psilver: 6,
  prook: 13,
  pbishop: 11,
};

export function isPromoted(type: AnyPieceType): type is PromotedPieceType {
  return type.startsWith('p') && type !== 'pawn';
}

export function canPromote(type: AnyPieceType): boolean {
  return type in PROMOTE_MAP;
}

export function baseType(type: AnyPieceType): PieceType {
  if (isPromoted(type)) return UNPROMOTE_MAP[type];
  return type as PieceType;
}
