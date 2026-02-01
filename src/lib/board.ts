import { Board, Piece, CapturedPieces, GameState } from './types';

// 初期盤面を作成
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(null));

  // 後手（上側、row 0-2）
  // 1段目
  board[0][0] = { type: 'lance', owner: 'gote' };
  board[0][1] = { type: 'knight', owner: 'gote' };
  board[0][2] = { type: 'silver', owner: 'gote' };
  board[0][3] = { type: 'gold', owner: 'gote' };
  board[0][4] = { type: 'king', owner: 'gote' };
  board[0][5] = { type: 'gold', owner: 'gote' };
  board[0][6] = { type: 'silver', owner: 'gote' };
  board[0][7] = { type: 'knight', owner: 'gote' };
  board[0][8] = { type: 'lance', owner: 'gote' };
  // 2段目
  board[1][1] = { type: 'rook', owner: 'gote' };
  board[1][7] = { type: 'bishop', owner: 'gote' };
  // 3段目（歩）
  for (let c = 0; c < 9; c++) {
    board[2][c] = { type: 'pawn', owner: 'gote' };
  }

  // 先手（下側、row 6-8）
  // 7段目（歩）
  for (let c = 0; c < 9; c++) {
    board[6][c] = { type: 'pawn', owner: 'sente' };
  }
  // 8段目
  board[7][1] = { type: 'bishop', owner: 'sente' };
  board[7][7] = { type: 'rook', owner: 'sente' };
  // 9段目
  board[8][0] = { type: 'lance', owner: 'sente' };
  board[8][1] = { type: 'knight', owner: 'sente' };
  board[8][2] = { type: 'silver', owner: 'sente' };
  board[8][3] = { type: 'gold', owner: 'sente' };
  board[8][4] = { type: 'king', owner: 'sente' };
  board[8][5] = { type: 'gold', owner: 'sente' };
  board[8][6] = { type: 'silver', owner: 'sente' };
  board[8][7] = { type: 'knight', owner: 'sente' };
  board[8][8] = { type: 'lance', owner: 'sente' };

  return board;
}

export function createInitialCaptured(): CapturedPieces {
  return {
    sente: {},
    gote: {},
  };
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'sente',
    captured: createInitialCaptured(),
    moveHistory: [],
    status: 'playing',
    winner: null,
  };
}

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

export function cloneCaptured(captured: CapturedPieces): CapturedPieces {
  return {
    sente: { ...captured.sente },
    gote: { ...captured.gote },
  };
}

export function cloneGameState(state: GameState): GameState {
  return {
    board: cloneBoard(state.board),
    turn: state.turn,
    captured: cloneCaptured(state.captured),
    moveHistory: [...state.moveHistory],
    status: state.status,
    winner: state.winner,
  };
}
