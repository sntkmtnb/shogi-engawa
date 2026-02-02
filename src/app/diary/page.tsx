'use client';

import { diaryEntries, DiaryEntry } from '@/data/diary';
import { useMemo } from 'react';

function formatDate(mmdd: string): string {
  const [mm, dd] = mmdd.split('-').map(Number);
  return `${mm}月${dd}日`;
}

function getSortedEntries(): DiaryEntry[] {
  const now = new Date();
  const currentMM = String(now.getMonth() + 1).padStart(2, '0');
  const currentDD = String(now.getDate()).padStart(2, '0');
  const todayKey = `${currentMM}-${currentDD}`;

  // Sort by proximity to today (circular, wrapping around year)
  return [...diaryEntries].sort((a, b) => {
    const distA = dateDist(todayKey, a.date);
    const distB = dateDist(todayKey, b.date);
    return distA - distB;
  });
}

function dateDist(today: string, entry: string): number {
  const [tm, td] = today.split('-').map(Number);
  const [em, ed] = entry.split('-').map(Number);
  const todayDay = tm * 31 + td;
  const entryDay = em * 31 + ed;
  const diff = todayDay - entryDay;
  // Prefer recent past entries, then future
  if (diff >= 0) return diff;
  return 366 + diff; // wrap around
}

export default function DiaryPage() {
  const sorted = useMemo(() => getSortedEntries(), []);

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-amber-900 mb-2">
          📔 源さんの日記
        </h1>
        <p className="text-sm text-amber-600">
          対局してない時の源さん
        </p>
      </div>

      {/* Diary entries */}
      <div className="flex flex-col gap-4">
        {sorted.map((entry, i) => (
          <article
            key={i}
            className="ios-card p-5 relative"
          >
            {/* Mood emoji */}
            <span className="absolute top-4 right-4 text-2xl">
              {entry.mood}
            </span>

            {/* Avatar + date */}
            <div className="flex items-center gap-3 mb-3">
              <div className="chat-avatar flex-shrink-0" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                源
              </div>
              <div>
                <p className="text-xs text-amber-500 font-bold">
                  {formatDate(entry.date)}
                </p>
                <h2 className="text-base font-bold text-amber-900 leading-tight">
                  {entry.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <p className="text-base text-amber-800 leading-relaxed pl-12">
              {entry.content}
            </p>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-amber-500/60">
          源さんは毎日を生きています
        </p>
      </div>
    </div>
  );
}
