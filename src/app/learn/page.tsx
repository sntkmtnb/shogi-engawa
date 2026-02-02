'use client';

import { useState } from 'react';

/* ─── MoveDisplay: 駒の動き方を視覚表示 ─── */
interface MoveDisplayProps {
  moves: boolean[][];
  piece: string;
  large?: boolean; // 5x5 (桂馬・角・飛)
  ranged?: boolean[][]; // 走り駒の方向
}

function MoveDisplay({ moves, piece, large, ranged }: MoveDisplayProps) {
  const size = large ? 5 : 3;
  const center = large ? 2 : 1;
  const cellSize = large ? 'w-7 h-7' : 'w-9 h-9';

  return (
    <div className="inline-grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {moves.map((row, r) =>
        row.map((canMove, c) => {
          const isCenter = r === center && c === center;
          const isRanged = ranged && ranged[r]?.[c];
          return (
            <div
              key={`${r}-${c}`}
              className={`${cellSize} rounded-sm flex items-center justify-center text-xs font-bold ${
                isCenter
                  ? 'bg-amber-200 border border-amber-400'
                  : canMove
                  ? isRanged
                    ? 'bg-green-200 border border-green-400'
                    : 'bg-green-300 border border-green-500'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              {isCenter ? (
                <span className="text-amber-800 text-sm font-black">{piece}</span>
              ) : canMove ? (
                isRanged ? (
                  <span className="text-green-600 text-[10px]">→</span>
                ) : (
                  <span className="text-green-700">●</span>
                )
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─── 駒データ ─── */
interface PieceInfo {
  name: string;
  reading: string;
  emoji: string;
  description: string;
  moves: boolean[][];
  large?: boolean;
  ranged?: boolean[][];
}

const pieces: PieceInfo[] = [
  {
    name: '歩',
    reading: 'ふ',
    emoji: '🚶',
    description: '一歩ずつ前に進む。地味やけど、歩の使い方で棋力が分かるんやで',
    moves: [
      [false, true, false],
      [false, false, false],
      [false, false, false],
    ],
  },
  {
    name: '香',
    reading: 'きょう',
    emoji: '🗡️',
    description: '前にまっすぐ、どこまでも走れる。猪突猛進タイプや笑',
    moves: [
      [false, true, false],
      [false, true, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ],
    large: true,
    ranged: [
      [false, true, false],
      [false, true, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ],
  },
  {
    name: '桂',
    reading: 'けい',
    emoji: '🐴',
    description: '前に2、横に1のL字ジャンプ。他の駒を飛び越えられる唯一の駒やで',
    moves: [
      [true, false, true],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ],
    large: true,
  },
  {
    name: '銀',
    reading: 'ぎん',
    emoji: '🛡️',
    description: '前3方向と斜め後ろ。攻守万能の優等生や',
    moves: [
      [true, true, true],
      [false, false, false],
      [true, false, true],
    ],
  },
  {
    name: '金',
    reading: 'きん',
    emoji: '👑',
    description: '前3方向と横と後ろ。王様の護衛隊長やな',
    moves: [
      [true, true, true],
      [true, false, true],
      [false, true, false],
    ],
  },
  {
    name: '角',
    reading: 'かく',
    emoji: '💥',
    description: '斜めにどこまでも走れる。大砲みたいなもんや',
    moves: [
      [true, false, true],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [true, false, true],
    ],
    large: true,
    ranged: [
      [true, false, true],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [true, false, true],
    ],
  },
  {
    name: '飛',
    reading: 'ひ',
    emoji: '🚀',
    description: '縦横にどこまでも走れる。将棋で一番強い駒や',
    moves: [
      [false, true, false],
      [true, false, true],
      [false, false, false],
      [false, false, false],
      [false, true, false],
    ],
    large: true,
    ranged: [
      [false, true, false],
      [true, false, true],
      [false, false, false],
      [false, false, false],
      [false, true, false],
    ],
  },
  {
    name: '玉',
    reading: 'おう・ぎょく',
    emoji: '🏯',
    description: '全方向に1マス動ける。この駒を取られたら負けや。大事にせなあかん',
    moves: [
      [true, true, true],
      [true, false, true],
      [true, true, true],
    ],
  },
];

/* ─── 成り駒データ ─── */
interface PromotedInfo {
  from: string;
  to: string;
  reading: string;
  description: string;
  moves: boolean[][];
}

const promotedPieces: PromotedInfo[] = [
  {
    from: '歩',
    to: 'と',
    reading: 'ときん',
    description: '金と同じ動き。歩が出世したんやな',
    moves: [
      [true, true, true],
      [true, false, true],
      [false, true, false],
    ],
  },
  {
    from: '香',
    to: '成香',
    reading: 'なりきょう',
    description: '金と同じ動き',
    moves: [
      [true, true, true],
      [true, false, true],
      [false, true, false],
    ],
  },
  {
    from: '桂',
    to: '成桂',
    reading: 'なりけい',
    description: '金と同じ動き',
    moves: [
      [true, true, true],
      [true, false, true],
      [false, true, false],
    ],
  },
  {
    from: '銀',
    to: '成銀',
    reading: 'なりぎん',
    description: '金と同じ動き',
    moves: [
      [true, true, true],
      [true, false, true],
      [false, true, false],
    ],
  },
  {
    from: '角',
    to: '馬',
    reading: 'うま',
    description: '角の動き＋上下左右1マス。最強クラスや！',
    moves: [
      [true, true, true],
      [true, false, true],
      [true, true, true],
    ],
  },
  {
    from: '飛',
    to: '龍',
    reading: 'りゅう',
    description: '飛車の動き＋斜め1マス。まさにドラゴンや！',
    moves: [
      [true, true, true],
      [true, false, true],
      [true, true, true],
    ],
  },
];

export default function LearnPage() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-amber-900 mb-2">
          📖 駒の動かし方
        </h1>
      </div>

      {/* 源さんの挨拶 */}
      <div className="flex items-start gap-3 mb-6">
        <div className="chat-avatar flex-shrink-0" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
          源
        </div>
        <div className="chat-bubble">
          将棋のルールを教えたるわ。簡単やで！<br />
          駒は8種類。それぞれの動き方を覚えたら、もう指せるで。
        </div>
      </div>

      {/* 駒カード一覧 */}
      <div className="flex flex-col gap-3 mb-8">
        {pieces.map((p, i) => (
          <div key={p.name} className="ios-card p-4">
            <div className="flex items-center gap-4">
              {/* ミニ盤面 */}
              <MoveDisplay
                moves={p.moves}
                piece={p.name}
                large={p.large}
                ranged={p.ranged}
              />
              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{p.emoji}</span>
                  <h2 className="text-lg font-black text-amber-900">
                    {p.name}
                  </h2>
                  <span className="text-xs text-amber-500 font-medium">
                    ({p.reading})
                  </span>
                </div>
                <p className="text-sm text-amber-700 leading-relaxed">
                  「{p.description}」
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 成り駒セクション */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="chat-avatar flex-shrink-0" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
            源
          </div>
          <div className="chat-bubble">
            敵の陣地（向こう3列）に入ると、駒がパワーアップするんや！<br />
            これを「<b>成り</b>」って言うんやで。金と角と飛が特に大事や。
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {promotedPieces.map((p) => (
            <div key={p.to} className="ios-card p-4">
              <div className="flex items-center gap-4">
                <MoveDisplay moves={p.moves} piece={p.to} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-black text-amber-900">
                      {p.from} → <span className="text-red-700">{p.to}</span>
                    </span>
                    <span className="text-xs text-amber-500">({p.reading})</span>
                  </div>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    「{p.description}」
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 持ち駒セクション */}
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="chat-avatar flex-shrink-0" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
            源
          </div>
          <div className="chat-bubble">
            将棋の一番おもろいルール教えたるわ。<br />
            <b>取った駒は自分の味方として使える</b>んや！<br />
            チェスにはないルールやで。これが将棋の醍醐味や。<br />
            <span className="text-xs text-amber-500 mt-1 block">
              ※ ただし歩は同じ列に2枚打てんし、詰みになる歩も打てんで（二歩・打ち歩詰め）
            </span>
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="ios-card p-3 mt-6">
        <p className="text-xs text-amber-600 font-bold mb-2">動き方の見方</p>
        <div className="flex items-center gap-4 text-xs text-amber-600">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-300 border border-green-500 rounded-sm inline-block" />
            動ける
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-200 border border-green-400 rounded-sm inline-block text-center text-[8px] text-green-600">→</span>
            走れる
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-amber-200 border border-amber-400 rounded-sm inline-block" />
            駒の位置
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-amber-500/60">
          ルールを覚えたら、源さんと一局指してみよう！
        </p>
      </div>
    </div>
  );
}
