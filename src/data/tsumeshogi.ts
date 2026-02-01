// 詰将棋問題データ
// 盤面: row 0=1段目(上), row 8=9段目(下), col 0=9筋(左), col 8=1筋(右)
// sente=攻め方(先手), gote=玉方(後手)

export interface TsumeProblem {
  id: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moves: number;
  title: string;
  description: string;
  board: (null | { type: string; owner: 'sente' | 'gote' })[][];
  senteHand: Record<string, number>;
  solution: string[];
}

// 空の9x9盤面を作るヘルパー
function emptyBoard(): (null | { type: string; owner: 'sente' | 'gote' })[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(null));
}

function s(type: string) { return { type, owner: 'sente' as const }; }
function g(type: string) { return { type, owner: 'gote' as const }; }

// ===== 一手詰め（beginner）10問 =====

function problem1(): TsumeProblem {
  // 頭金：1一玉に対して2一金で詰み
  // 玉: 1一(row0,col8)、金を2一(row0,col7)に打つ
  // 壁: 1二歩(row1,col8)で退路なし
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[1][8] = g('pawn');   // 1二歩（退路塞ぎ）
  b[1][7] = s('silver'); // 2二銀（退路塞ぎ）
  return {
    id: 1, difficulty: 'beginner', moves: 1,
    title: '一手詰め #1', description: '持ち駒の金をどこに打てば詰みますか？（頭金の基本）',
    board: b, senteHand: { gold: 1 },
    solution: ['☗2一金'],
  };
}

function problem2(): TsumeProblem {
  // 腹金：2一玉に対して2二金で詰み
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = s('lance');  // 1一香（退路塞ぎ）
  b[1][6] = s('gold');   // 3二金配置用→持ち駒で打つ
  // 3一に逃げられないように
  b[0][6] = s('silver'); // 3一銀
  return {
    id: 2, difficulty: 'beginner', moves: 1,
    title: '一手詰め #2', description: '金をどこに打てば詰みますか？',
    board: b, senteHand: { gold: 1 },
    solution: ['☗2二金'],
  };
}

function problem3(): TsumeProblem {
  // 1一玉、持ち駒に飛車→1二飛で詰み（壁あり）
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][7] = g('pawn');   // 2一歩（退路塞ぎ）
  b[1][7] = s('gold');   // 2二金（退路塞ぎ）
  return {
    id: 3, difficulty: 'beginner', moves: 1,
    title: '一手詰め #3', description: '飛車の力を使って詰ましましょう。',
    board: b, senteHand: { rook: 1 },
    solution: ['☗1二飛'],
  };
}

function problem4(): TsumeProblem {
  // 角打ちの一手詰め
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][6] = s('rook');   // 3一飛（横利き）
  b[2][8] = s('lance');  // 1三香（縦利き）
  return {
    id: 4, difficulty: 'beginner', moves: 1,
    title: '一手詰め #4', description: '角をうまく使って王手しましょう。',
    board: b, senteHand: { bishop: 1 },
    solution: ['☗2二角'],
  };
}

function problem5(): TsumeProblem {
  // 銀打ちの一手詰め
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = s('gold');   // 1一金
  b[1][8] = s('gold');   // 1二金
  return {
    id: 5, difficulty: 'beginner', moves: 1,
    title: '一手詰め #5', description: '銀の動きを思い出して。どこに打てば詰みですか？',
    board: b, senteHand: { silver: 1 },
    solution: ['☗3一銀'],
  };
}

function problem6(): TsumeProblem {
  // 桂打ちの一手詰め
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = s('lance');  // 1一香
  b[0][6] = s('lance');  // 3一香
  b[1][7] = s('gold');   // 2二金（退路塞ぎ）
  return {
    id: 6, difficulty: 'beginner', moves: 1,
    title: '一手詰め #6', description: '桂馬のジャンプで仕留めましょう。',
    board: b, senteHand: { knight: 1 },
    solution: ['☗1三桂'],
  };
}

function problem7(): TsumeProblem {
  // 尻金：1一玉に1二金で詰み
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][7] = s('silver'); // 2一銀（退路塞ぎ）
  b[1][6] = s('gold');   // 3二金（退路塞ぎ）
  return {
    id: 7, difficulty: 'beginner', moves: 1,
    title: '一手詰め #7', description: '金をどこに打ちますか？基本の形です。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗1二金'],
  };
}

function problem8(): TsumeProblem {
  // 飛車成りの一手詰め
  const b = emptyBoard();
  b[0][7] = g('king');    // 2一玉
  b[0][6] = s('gold');    // 3一金
  b[2][8] = s('rook');    // 1三飛→1一飛成で詰み
  return {
    id: 8, difficulty: 'beginner', moves: 1,
    title: '一手詰め #8', description: '飛車を成って詰ましましょう。',
    board: b, senteHand: {},
    solution: ['☗1一飛成'],
  };
}

function problem9(): TsumeProblem {
  // 角成りの一手詰め
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][7] = s('gold');   // 2一金（退路塞ぎ）
  b[1][7] = s('silver'); // 2二銀（退路塞ぎ）
  b[2][6] = s('bishop'); // 3三角→2二は銀がいるので…1二に利かせる
  return {
    id: 9, difficulty: 'beginner', moves: 1,
    title: '一手詰め #9', description: '持ち駒の金で仕留めましょう。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗1二金'],
  };
}

function problem10(): TsumeProblem {
  // 香打ちの一手詰め
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][7] = s('gold');   // 2一金（横退路塞ぎ）
  b[1][7] = s('gold');   // 2二金（斜め退路塞ぎ）
  return {
    id: 10, difficulty: 'beginner', moves: 1,
    title: '一手詰め #10', description: '香車の縦の力で詰ましましょう。',
    board: b, senteHand: { lance: 1 },
    solution: ['☗1三香'],
  };
}

// ===== 三手詰め（intermediate）10問 =====

function problem11(): TsumeProblem {
  // 送りの手筋：1一玉→2一金→同玉→3一金
  const b = emptyBoard();
  b[0][8] = g('king');    // 1一玉
  b[1][7] = s('silver');  // 2二銀（退路塞ぎ）
  b[2][8] = s('lance');   // 1三香（退路塞ぎ）
  return {
    id: 11, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #1', description: '金を連続で打つ「送りの手筋」です。',
    board: b, senteHand: { gold: 2 },
    solution: ['☗2一金', '☖同玉', '☗3一金'],
  };
}

function problem12(): TsumeProblem {
  // 捨て駒の手筋
  const b = emptyBoard();
  b[0][7] = g('king');    // 2一玉
  b[0][6] = g('silver');  // 3一銀
  b[1][6] = s('gold');    // 3二金
  b[2][8] = s('rook');    // 1三飛
  return {
    id: 12, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #2', description: '飛車の利きを活かしましょう。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗1一金', '☖同玉', '☗1三飛成（1一）'],
  };
}

function problem13(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][6] = s('rook');   // 3一飛
  b[2][7] = s('silver'); // 2三銀
  return {
    id: 13, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #3', description: '金を打って追い詰めましょう。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗2一金', '☖同玉', '☗3二銀成'],
  };
}

function problem14(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[1][8] = g('pawn');   // 1二歩
  b[2][6] = s('bishop'); // 3三角
  return {
    id: 14, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #4', description: '角の力を活かして詰ましましょう。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗1一銀', '☖同玉', '☗2二金'],
  };
}

function problem15(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[1][7] = g('gold');   // 2二金
  b[0][6] = s('gold');   // 3一金
  return {
    id: 15, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #5', description: '相手の駒を取りながら詰ましましょう。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗2二金', '☖同玉', '☗3二金'],
  };
}

function problem16(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = g('lance');  // 1一香
  b[1][6] = s('gold');   // 3二金
  return {
    id: 16, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #6', description: '退路を塞いでから王手しましょう。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗1二銀', '☖同香', '☗1一金'],
  };
}

function problem17(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[1][6] = s('gold');   // 3二金
  b[0][5] = s('rook');   // 4一飛
  return {
    id: 17, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #7', description: '飛車と金の連携プレーです。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗2一金', '☖同玉', '☗3一飛成'],
  };
}

function problem18(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');    // 2一玉
  b[0][5] = s('bishop');  // 4一角
  b[1][8] = s('gold');    // 1二金
  return {
    id: 18, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #8', description: '角の利きを見落とさないように。',
    board: b, senteHand: { silver: 1 },
    solution: ['☗3二銀', '☖1一玉', '☗2二銀成'],
  };
}

function problem19(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[1][7] = g('silver'); // 2二銀
  b[2][6] = s('gold');   // 3三金
  return {
    id: 19, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #9', description: '銀を取って追い詰めましょう。',
    board: b, senteHand: { gold: 1 },
    solution: ['☗2二金', '☖同玉', '☗3二金'],
  };
}

function problem20(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = g('knight'); // 1一桂
  b[2][8] = s('lance');  // 1三香
  return {
    id: 20, difficulty: 'intermediate', moves: 3,
    title: '三手詰め #10', description: '持ち駒をうまく使いましょう。',
    board: b, senteHand: { gold: 2 },
    solution: ['☗1一金', '☖同玉', '☗1二金'],
  };
}

// ===== 五手詰め（advanced）7問 =====

function problem21(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');    // 1一玉
  b[0][6] = g('gold');    // 3一金
  b[1][7] = g('pawn');    // 2二歩
  b[2][6] = s('silver');  // 3三銀
  return {
    id: 21, difficulty: 'advanced', moves: 5,
    title: '五手詰め #1', description: '丁寧に追い詰めていきましょう。',
    board: b, senteHand: { gold: 2 },
    solution: ['☗2一金', '☖同玉', '☗3二金', '☖1一玉', '☗2二金'],
  };
}

function problem22(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = g('lance');  // 1一香
  b[0][6] = g('silver'); // 3一銀
  b[2][7] = s('rook');   // 2三飛
  return {
    id: 22, difficulty: 'advanced', moves: 5,
    title: '五手詰め #2', description: '飛車を活用して詰ましましょう。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2二銀', '☖1二玉', '☗1三飛成', '☖同玉', '☗2三金'],
  };
}

function problem23(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[1][6] = g('gold');   // 3二金
  b[0][5] = s('rook');   // 4一飛
  b[2][6] = s('silver'); // 3三銀
  return {
    id: 23, difficulty: 'advanced', moves: 5,
    title: '五手詰め #3', description: '捨て駒の手筋が光ります。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2一金', '☖同玉', '☗3一飛成', '☖同金', '☗2二銀'],
  };
}

function problem24(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = g('silver'); // 1一銀
  b[1][6] = s('gold');   // 3二金
  return {
    id: 24, difficulty: 'advanced', moves: 5,
    title: '五手詰め #4', description: '手順を間違えると詰みません。正確に読みましょう。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗1二銀', '☖同銀', '☗同金', '☖同玉', '☗2二金'],
  };
}

function problem25(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');    // 1一玉
  b[1][7] = g('pawn');    // 2二歩
  b[0][6] = s('gold');    // 3一金
  b[2][8] = s('lance');   // 1三香
  return {
    id: 25, difficulty: 'advanced', moves: 5,
    title: '五手詰め #5', description: '香車の利きを活かしましょう。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2一金', '☖同玉', '☗1二銀', '☖1一玉', '☗2一金'],
  };
}

function problem26(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][5] = s('rook');   // 4一飛
  b[1][6] = s('silver'); // 3二銀
  return {
    id: 26, difficulty: 'advanced', moves: 5,
    title: '五手詰め #6', description: '飛車の横利きを最大限に活用。',
    board: b, senteHand: { gold: 2 },
    solution: ['☗1一金', '☖同玉', '☗2一金', '☖同玉', '☗3一飛成'],
  };
}

function problem27(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[0][6] = g('gold');   // 3一金
  b[1][7] = s('gold');   // 2二金
  b[2][5] = s('bishop'); // 4三角
  return {
    id: 27, difficulty: 'advanced', moves: 5,
    title: '五手詰め #7', description: '角の遠い利きが鍵です。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2一銀', '☖同金', '☗同金', '☖同玉', '☗3二金'],
  };
}

// ===== 七手詰め（advanced）3問 =====

function problem28(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');    // 1一玉
  b[1][7] = g('gold');    // 2二金
  b[0][6] = g('silver');  // 3一銀
  b[2][6] = s('gold');    // 3三金
  b[2][8] = s('lance');   // 1三香
  return {
    id: 28, difficulty: 'advanced', moves: 7,
    title: '七手詰め #1', description: '一手一手、丁寧に読みましょう。長い詰みが見えた時の喜びは格別です。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2一銀', '☖同金', '☗同金', '☖同玉', '☗3二金', '☖1一玉', '☗2二金'],
  };
}

function problem29(): TsumeProblem {
  const b = emptyBoard();
  b[0][7] = g('king');   // 2一玉
  b[0][8] = g('lance');  // 1一香
  b[0][6] = g('gold');   // 3一金
  b[2][7] = s('rook');   // 2三飛
  b[2][6] = s('silver'); // 3三銀
  return {
    id: 29, difficulty: 'advanced', moves: 7,
    title: '七手詰め #2', description: '飛車と銀の連携で追い詰めます。じっくり考えて。',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2二銀', '☖1二玉', '☗1三飛成', '☖同玉', '☗2三金', '☖1二玉', '☗1一銀成'],
  };
}

function problem30(): TsumeProblem {
  const b = emptyBoard();
  b[0][8] = g('king');   // 1一玉
  b[1][7] = g('silver'); // 2二銀
  b[0][5] = s('rook');   // 4一飛
  b[2][6] = s('gold');   // 3三金
  return {
    id: 30, difficulty: 'advanced', moves: 7,
    title: '七手詰め #3', description: 'これが解ければ上級者。全力で考えましょう！',
    board: b, senteHand: { gold: 1, silver: 1 },
    solution: ['☗2一金', '☖同銀', '☗同飛成', '☖同玉', '☗3二銀', '☖1一玉', '☗2二金'],
  };
}

export const TSUME_PROBLEMS: TsumeProblem[] = [
  problem1(), problem2(), problem3(), problem4(), problem5(),
  problem6(), problem7(), problem8(), problem9(), problem10(),
  problem11(), problem12(), problem13(), problem14(), problem15(),
  problem16(), problem17(), problem18(), problem19(), problem20(),
  problem21(), problem22(), problem23(), problem24(), problem25(),
  problem26(), problem27(), problem28(), problem29(), problem30(),
];
