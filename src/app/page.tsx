import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
      {/* メインビジュアル */}
      <div className="text-center mb-12">
        <div className="text-6xl md:text-8xl mb-6">♟️</div>
        <h1 className="text-3xl md:text-5xl font-bold text-amber-900 mb-4 tracking-wider">
          将棋の縁台へようこそ
        </h1>
        <p className="text-lg md:text-xl text-amber-800 leading-relaxed">
          のんびり、じっくり。
          <br />
          縁台に腰かけて、一局いかがですか？
        </p>
      </div>

      {/* メニュー */}
      <div className="space-y-4 max-w-md mx-auto">
        <Link
          href="/play"
          className="block w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white text-center text-xl md:text-2xl font-bold py-5 px-8 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
        >
          🎮 AI と対局する
        </Link>
      </div>

      {/* 説明 */}
      <div className="mt-16 bg-white/60 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-4">
          📖 遊び方
        </h2>
        <ul className="space-y-3 text-base md:text-lg text-amber-900 leading-relaxed">
          <li className="flex gap-3">
            <span className="text-amber-600 font-bold shrink-0">①</span>
            <span>「AIと対局する」をタップ</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-600 font-bold shrink-0">②</span>
            <span>難易度を選んで対局開始</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-600 font-bold shrink-0">③</span>
            <span>駒をタップして選び、移動先をタップ</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-600 font-bold shrink-0">④</span>
            <span>持ち駒は盤の横に表示されます</span>
          </li>
        </ul>
      </div>

      {/* フッター */}
      <div className="mt-12 text-center text-amber-700/60 text-sm">
        <p>将棋の縁台 v0.1.0</p>
        <p className="mt-1">スマートフォンでも快適にお楽しみいただけます</p>
      </div>
    </div>
  );
}
