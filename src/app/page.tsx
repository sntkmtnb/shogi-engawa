import Link from 'next/link';

export default function Home() {
  return (
    <div className="wagara-pattern">
      {/* ヒーローセクション */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-12 md:pt-16 md:pb-16 text-center">
        {/* 和風ビジュアル：将棋の駒モチーフ */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-28 md:w-32 md:h-36 mx-auto relative">
            {/* 駒の形 */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(50% 3%, 92% 22%, 97% 97%, 3% 97%, 8% 22%)',
                background: 'linear-gradient(160deg, #f7ecd5 0%, #e8d5a8 40%, #d9c08a 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                clipPath: 'polygon(50% 3%, 92% 22%, 97% 97%, 3% 97%, 8% 22%)',
              }}
            >
              <span className="text-amber-950 font-black text-3xl md:text-4xl mt-2">
                王
              </span>
            </div>
          </div>
          {/* 装飾の輪 */}
          <div className="absolute -inset-4 border-2 border-amber-700/20 rounded-full" />
          <div className="absolute -inset-8 border border-amber-700/10 rounded-full" />
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-amber-900 mb-4 tracking-wider leading-tight">
          将棋の縁台
        </h1>
        <p className="text-lg md:text-xl text-amber-800 leading-relaxed mb-2">
          のんびり、じっくり。縁台に腰かけて、一局いかがですか？
        </p>

        <div className="wa-divider max-w-xs mx-auto">
          <span className="text-amber-700/60 text-sm">✦</span>
        </div>

        <p className="text-xl md:text-2xl font-bold text-amber-800 leading-relaxed">
          毎朝の一局が、あなたの毎日を豊かにする。
        </p>
      </section>

      {/* 3つの特徴カード */}
      <section className="max-w-4xl mx-auto px-4 pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-amber-200/50">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              ちょうどいい対戦相手
            </h3>
            <p className="text-base text-amber-800 leading-relaxed">
              AIが棋力に合わせて調整。強すぎず弱すぎず、ちょうどいい勝負が楽しめます。
            </p>
          </div>

          <div className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-amber-200/50 relative">
            <span className="absolute top-3 right-3 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
              Coming Soon
            </span>
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              同世代の仲間
            </h3>
            <p className="text-base text-amber-800 leading-relaxed">
              50歳以上限定のコミュニティ。同じ世代だから、気兼ねなく楽しめます。
            </p>
          </div>

          <div className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-amber-200/50">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              脳の健康維持
            </h3>
            <p className="text-base text-amber-800 leading-relaxed">
              将棋は最高の脳トレ。先を読む力、集中力、判断力を毎日の対局で鍛えましょう。
            </p>
          </div>
        </div>
      </section>

      {/* 利用者の声 */}
      <section className="max-w-4xl mx-auto px-4 pb-12 md:pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900 text-center mb-8">
          ご利用者の声
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="testimonial-card bg-white/70 rounded-2xl p-6 shadow-sm border border-amber-100">
            <p className="text-base text-amber-900 leading-relaxed mb-4 pl-4">
              毎朝コーヒーを飲みながら一局指すのが日課になりました。頭がスッキリして、一日が気持ちよく始まります。
            </p>
            <div className="flex items-center gap-3 border-t border-amber-100 pt-3">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold">
                田
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">田中さん（62歳）</p>
                <p className="text-xs text-amber-600">東京都・将棋歴40年</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card bg-white/70 rounded-2xl p-6 shadow-sm border border-amber-100">
            <p className="text-base text-amber-900 leading-relaxed mb-4 pl-4">
              文字が大きくて見やすいのが嬉しい。他のアプリは小さくて目が疲れていたので、助かっています。
            </p>
            <div className="flex items-center gap-3 border-t border-amber-100 pt-3">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold">
                鈴
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">鈴木さん（58歳）</p>
                <p className="text-xs text-amber-600">大阪府・将棋歴5年</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card bg-white/70 rounded-2xl p-6 shadow-sm border border-amber-100">
            <p className="text-base text-amber-900 leading-relaxed mb-4 pl-4">
              定年後の趣味に将棋を再開。「やさしい」モードから始めて、今は「ふつう」で楽しんでいます。
            </p>
            <div className="flex items-center gap-3 border-t border-amber-100 pt-3">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold">
                山
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">山本さん（67歳）</p>
                <p className="text-xs text-amber-600">福岡県・将棋歴30年</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16 md:pb-20 text-center">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-md border border-amber-200/50">
          <p className="text-2xl md:text-3xl font-bold text-amber-900 mb-6 leading-relaxed">
            まずは一局、<br className="md:hidden" />試してみませんか？
          </p>
          <Link
            href="/play"
            className="btn-warm inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl md:text-2xl font-bold py-5 px-10 rounded-xl shadow-lg"
          >
            ▲ AI と対局する
          </Link>
          <p className="mt-4 text-sm text-amber-600">
            登録不要・無料でお楽しみいただけます
          </p>
        </div>
      </section>

      {/* 遊び方 */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white/60 rounded-2xl p-6 md:p-8 shadow-sm">
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
      </section>
    </div>
  );
}
