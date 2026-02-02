import { Difficulty } from '@/lib/types';

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  totalMoves: number;
  hintsUsed: number;
  undosUsed: number;
  firstPlayDate: string;
  lastPlayDate: string;
  consecutiveDays: number;
  lastLoginDate: string;
  difficultyStats: {
    easy: { wins: number; losses: number };
    normal: { wins: number; losses: number };
    hard: { wins: number; losses: number };
  };
}

const STATS_KEY = 'shogi-engawa-stats';

function defaultStats(): PlayerStats {
  const today = new Date().toISOString().split('T')[0];
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalMoves: 0,
    hintsUsed: 0,
    undosUsed: 0,
    firstPlayDate: today,
    lastPlayDate: today,
    consecutiveDays: 1,
    lastLoginDate: today,
    difficultyStats: {
      easy: { wins: 0, losses: 0 },
      normal: { wins: 0, losses: 0 },
      hard: { wins: 0, losses: 0 },
    },
  };
}

export function getStats(): PlayerStats {
  if (typeof window === 'undefined') return defaultStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    const parsed = JSON.parse(raw) as PlayerStats;
    // Ensure all fields exist (migration)
    const def = defaultStats();
    return { ...def, ...parsed, difficultyStats: { ...def.difficultyStats, ...parsed.difficultyStats } };
  } catch {
    return defaultStats();
  }
}

function saveStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage full or unavailable
  }
}

export function recordGame(
  result: 'win' | 'lose' | 'draw',
  difficulty: Difficulty,
  moves: number,
  hintsUsed: number,
  undosUsed: number
): void {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  stats.totalGames++;
  stats.totalMoves += moves;
  stats.hintsUsed += hintsUsed;
  stats.undosUsed += undosUsed;
  stats.lastPlayDate = today;

  if (!stats.firstPlayDate) {
    stats.firstPlayDate = today;
  }

  if (result === 'win') {
    stats.wins++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    stats.difficultyStats[difficulty].wins++;
  } else if (result === 'lose') {
    stats.losses++;
    stats.currentStreak = 0;
    stats.difficultyStats[difficulty].losses++;
  } else {
    stats.draws++;
    // draws don't break streak
  }

  saveStats(stats);
}

export function updateLoginStreak(): void {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  if (stats.lastLoginDate === today) {
    // Already logged in today
    return;
  }

  const lastDate = new Date(stats.lastLoginDate);
  const todayDate = new Date(today);
  const diffMs = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    stats.consecutiveDays++;
  } else if (diffDays > 1) {
    stats.consecutiveDays = 1;
  }

  stats.lastLoginDate = today;
  saveStats(stats);
}

export function getWinRate(stats: PlayerStats): number {
  const total = stats.wins + stats.losses;
  if (total === 0) return 0;
  return Math.round((stats.wins / total) * 100);
}

export function getLoginStreakComment(days: number): string | null {
  if (days >= 30) return '1ヶ月皆勤！ワシより真面目やな笑';
  if (days >= 7) return '1週間毎日来てるやん！もう常連やで';
  if (days >= 3) return `${days}日連続か！ええ調子やな`;
  return null;
}

export function getStatsComment(stats: PlayerStats): string {
  const winRate = getWinRate(stats);

  if (stats.totalGames === 0) {
    return 'まだ一局も指してへんな。さぁ、始めよか！';
  }
  if (stats.totalGames === 1 && stats.wins === 1) {
    return '初勝利おめでとう！この調子でいこか';
  }
  if (stats.wins >= 50) {
    return 'お前さん、もう五十勝やで！ワシの好敵手やな';
  }
  if (stats.wins >= 30) {
    return 'お前さん、もう三十勝超えか。たいしたもんや';
  }
  if (stats.wins >= 10) {
    return 'お前さん、もう10勝目やで！強なったなぁ';
  }
  if (stats.currentStreak >= 5) {
    return `${stats.currentStreak}連勝中か！ワシも本気出さんとあかんな`;
  }
  if (winRate >= 70) {
    return 'お前さん、ここんとこ調子ええなぁ。次は難しい方に挑戦してみぃ';
  }
  if (winRate >= 50) {
    return '五分五分の勝負ができとるな。ええ感じや';
  }
  if (winRate < 30 && stats.totalGames >= 5) {
    return '負けが込んどるなぁ。でもな、負けて覚える将棋やで';
  }

  // Difficulty-based suggestions
  const { easy, normal, hard } = stats.difficultyStats;
  if (easy.wins >= 5 && normal.wins === 0) {
    return 'お前さん、「やさしい」は余裕やな。次は「ふつう」に挑戦してみぃ';
  }
  if (normal.wins >= 5 && hard.wins === 0) {
    return '「ふつう」もだいぶ勝てるようなったな。「つよい」行ってみるか？';
  }

  return 'ワシは毎日ここにおるから、いつでも来ぃや';
}
