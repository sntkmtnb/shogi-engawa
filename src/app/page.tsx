import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero section */}
      <section className="max-w-2xl mx-auto px-6 pt-12 pb-14 md:pt-20 md:pb-20 text-center">
        <div className="relative inline-block mb-8">
          <div className="w-20 h-24 md:w-24 md:h-28 mx-auto relative">
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(50% 3%, 92% 22%, 97% 97%, 3% 97%, 8% 22%)',
                background: 'linear-gradient(160deg, #f7ecd5 0%, #e8d5a8 40%, #d9c08a 100%)',
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                clipPath: 'polygon(50% 3%, 92% 22%, 97% 97%, 3% 97%, 8% 22%)',
              }}
            >
              <span className="text-amber-950 font-black text-2xl md:text-3xl mt-2">
                王
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-amber-900 mb-4 tracking-wider">
          将棋の縁台
        </h1>
        <p className="text-base md:text-lg text-amber-700 leading-relaxed mb-8 max-w-md mx-auto">
          のんびり、じっくり。<br />
          毎朝の一局が、あなたの毎日を豊かにする。
        </p>

        <Link
          href="/play"
          className="btn-ios inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl md:text-2xl font-bold py-4 px-10 shadow-lg active:scale-95"
        >
          ▲ AI と対局する
        </Link>
        <p className="mt-3 text-sm text-amber-500">
          登録不要・無料
        </p>
      </section>

      {/* Feature cards */}
      <section className="max-w-4xl mx-auto px-5 pb-14 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="feature-card ios-card p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              ちょうどいい対戦相手
            </h3>
            <p className="text-base text-amber-700 leading-relaxed">
              AIが棋力に合わせて調整。強すぎず弱すぎず、ちょうどいい勝負が楽しめます。
            </p>
          </div>

          <div className="feature-card ios-card p-6 relative">
            <span className="absolute top-3 right-3 text-[10px] bg-amber-100/80 text-amber-600 px-2 py-0.5 rounded-full font-bold">
              Coming Soon
            </span>
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              同世代の仲間
            </h3>
            <p className="text-base text-amber-700 leading-relaxed">
              50歳以上限定のコミュニティ。同じ世代だから、気兼ねなく楽しめます。
            </p>
          </div>

          <div className="feature-card ios-card p-6">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              脳の健康維持
            </h3>
            <p className="text-base text-amber-700 leading-relaxed">
              将棋は最高の脳トレ。先を読む力、集中力、判断力を毎日の対局で鍛えましょう。
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-5 pb-14 md:pb-20">
        <h2 className="text-xl md:text-2xl font-bold text-amber-900 text-center mb-6">
          ご利用者の声
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { text: '毎朝コーヒーを飲みながら一局指すのが日課に。頭がスッキリします。', name: '田中さん（62歳）', sub: '東京都', initial: '田' },
            { text: '文字が大きくて見やすいのが嬉しい。他のアプリは目が疲れていました。', name: '鈴木さん（58歳）', sub: '大阪府', initial: '鈴' },
            { text: '定年後に将棋を再開。「やさしい」から始めて今は「ふつう」で楽しんでます。', name: '山本さん（67歳）', sub: '福岡県', initial: '山' },
          ].map((t, i) => (
            <div key={i} className="testimonial-card ios-card p-5">
              <p className="text-base text-amber-800 leading-relaxed mb-4 pl-4">
                {t.text}
              </p>
              <div className="flex items-center gap-3 border-t border-amber-100/60 pt-3">
                <div className="w-9 h-9 bg-amber-200/80 rounded-full flex items-center justify-center text-amber-800 font-bold text-sm">
                  {t.initial}
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900">{t.name}</p>
                  <p className="text-[11px] text-amber-500">{t.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-lg mx-auto px-5 pb-14 md:pb-20 text-center">
        <div className="ios-card p-8 md:p-10">
          <p className="text-xl md:text-2xl font-bold text-amber-900 mb-5 leading-relaxed">
            まずは一局、<br className="md:hidden" />試してみませんか？
          </p>
          <Link
            href="/play"
            className="btn-ios inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-white text-lg font-bold py-4 px-8 shadow-lg active:scale-95"
          >
            ▲ AI と対局する
          </Link>
          <div className="mt-5">
            <Link
              href="/tsume"
              className="text-amber-600 hover:text-amber-500 text-base font-bold transition"
            >
              🧩 毎日の詰将棋はこちら →
            </Link>
          </div>
        </div>
      </section>

      {/* How to play */}
      <section className="max-w-lg mx-auto px-5 pb-16">
        <div className="ios-card p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-4">
            📖 遊び方
          </h2>
          <ul className="space-y-3 text-base text-amber-800 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold shrink-0">①</span>
              <span>「AIと対局する」をタップ</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold shrink-0">②</span>
              <span>難易度を選んで対局開始</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold shrink-0">③</span>
              <span>駒をタップして選び、移動先をタップ</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold shrink-0">④</span>
              <span>持ち駒は盤の横に表示されます</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
