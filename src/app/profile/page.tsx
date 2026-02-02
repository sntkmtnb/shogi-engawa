'use client';

import { useState, useEffect } from 'react';
import { getStats, getWinRate, getStatsComment, getLoginStreakComment, updateLoginStreak, PlayerStats } from '@/lib/stats';

export default function ProfilePage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    updateLoginStreak();
    setStats(getStats());
    setMounted(true);
  }, []);

  if (!mounted || !stats) {
    return (
      <div className="max-w-lg mx-auto px-5 py-8 animate-pulse">
        <div className="h-32 bg-amber-100/40 rounded-2xl" />
      </div>
    );
  }

  const winRate = getWinRate(stats);
  const genComment = getStatsComment(stats);
  const streakComment = getLoginStreakComment(stats.consecutiveDays);

  return (
    <div className="max-w-lg mx-auto px-5 py-8 md:py-12 pb-28">
      {/* Gen-san header */}
      <div className="ios-card p-5 mb-5 text-center">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
        >
          源
        </div>
        <p className="text-base text-amber-800 font-medium">
          「お前さんの将棋記録やで」
        </p>
      </div>

      {/* Main stats */}
      <div className="ios-card p-5 mb-4 text-center">
        <div className="text-3xl font-black text-amber-900 mb-1">
          {stats.wins}勝 {stats.losses}敗
          {stats.draws > 0 && <span className="text-2xl"> {stats.draws}分</span>}
        </div>
        <div className="text-lg text-amber-700 font-bold">
          勝率 {winRate}%
        </div>
        {stats.totalGames === 0 && (
          <p className="text-sm text-amber-500 mt-2">まだ対局記録がありません</p>
        )}
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="ios-card p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xl font-black text-amber-900">{stats.bestStreak}</div>
          <div className="text-xs text-amber-600 font-bold">最高連勝</div>
        </div>
        <div className="ios-card p-4 text-center">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xl font-black text-amber-900">{stats.consecutiveDays}日目</div>
          <div className="text-xs text-amber-600 font-bold">連続ログイン</div>
        </div>
        <div className="ios-card p-4 text-center">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-xl font-black text-amber-900">{stats.totalMoves.toLocaleString()}手</div>
          <div className="text-xs text-amber-600 font-bold">総手数</div>
        </div>
        <div className="ios-card p-4 text-center">
          <div className="text-2xl mb-1">💡</div>
          <div className="text-xl font-black text-amber-900">{stats.hintsUsed}回</div>
          <div className="text-xs text-amber-600 font-bold">ヒント使用</div>
        </div>
      </div>

      {/* Current streak */}
      {stats.currentStreak >= 2 && (
        <div className="ios-card p-4 mb-4 text-center bg-gradient-to-r from-orange-50 to-amber-50">
          <span className="text-lg font-black text-orange-700">
            🔥 現在 {stats.currentStreak}連勝中！
          </span>
        </div>
      )}

      {/* Difficulty breakdown */}
      <div className="ios-card p-5 mb-4">
        <h3 className="text-sm font-bold text-amber-700 mb-3">難易度別</h3>
        <div className="space-y-2.5">
          {([
            { key: 'easy' as const, label: '🌱 やさしい' },
            { key: 'normal' as const, label: '⚔️ ふつう' },
            { key: 'hard' as const, label: '🔥 つよい' },
          ]).map(({ key, label }) => {
            const d = stats.difficultyStats[key];
            const total = d.wins + d.losses;
            const pct = total > 0 ? Math.round((d.wins / total) * 100) : 0;
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800">{label}</span>
                <span className="text-sm text-amber-700">
                  {d.wins}勝 {d.losses}敗
                  {total > 0 && <span className="text-amber-500 ml-1">({pct}%)</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Login streak celebration */}
      {streakComment && (
        <div className="ios-card p-4 mb-4 bg-amber-50/80">
          <div className="flex items-start gap-2">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
            >
              源
            </div>
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              「{streakComment}」
            </p>
          </div>
        </div>
      )}

      {/* Gen-san's dynamic comment */}
      <div className="ios-card p-4 mb-4">
        <div className="flex items-start gap-2">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
          >
            源
          </div>
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            「{genComment}」
          </p>
        </div>
      </div>

      {/* Undo stats */}
      {stats.undosUsed > 0 && (
        <p className="text-xs text-amber-500/60 text-center mt-2">
          ↩️ 待った使用: {stats.undosUsed}回
        </p>
      )}
    </div>
  );
}
