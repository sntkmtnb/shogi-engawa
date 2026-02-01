import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="wagara-pattern">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 text-center mb-2 tracking-wider">
          将棋の縁台について
        </h1>
        <div className="wa-divider max-w-xs mx-auto">
          <span className="text-amber-700/60 text-sm">✦</span>
        </div>

        {/* コンセプト */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-amber-600">◆</span> なぜ「縁台」なのか
          </h2>
          <div className="bg-white/70 rounded-2xl p-6 md:p-8 shadow-sm border border-amber-100">
            <p className="text-base md:text-lg text-amber-900 leading-loose">
              「縁台将棋」という言葉を覚えていますか？
            </p>
            <p className="text-base md:text-lg text-amber-900 leading-loose mt-3">
              夏の夕暮れ、縁台に腰かけて近所の人と一局。
              勝っても負けても笑いあえる、あのゆったりとした時間。
            </p>
            <p className="text-base md:text-lg text-amber-900 leading-loose mt-3">
              「将棋の縁台」は、そんな温かい空気をインターネットの上に再現したいという想いから生まれました。
              スマートフォンやパソコンがあれば、いつでもどこでも、あの縁台の雰囲気を味わえます。
            </p>
          </div>
        </section>

        {/* 50歳以上のために */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-amber-600">◆</span> 50歳以上の方のために
          </h2>
          <div className="bg-white/70 rounded-2xl p-6 md:p-8 shadow-sm border border-amber-100">
            <p className="text-base md:text-lg text-amber-900 leading-loose">
              世の中にはたくさんの将棋アプリがあります。
              でも、多くは文字が小さく、操作が複雑で、若い世代向けに作られています。
            </p>
            <p className="text-base md:text-lg text-amber-900 leading-loose mt-3">
              私たちは「50歳以上の方が、迷わず使える将棋アプリ」を目指しました。
            </p>
            <ul className="mt-4 space-y-3 text-base md:text-lg text-amber-900">
              <li className="flex gap-3">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span>大きな文字と駒で、目に優しい</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span>シンプルな操作で、すぐに対局できる</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span>棋力に合わせたAIで、楽しく上達</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span>毎日の対局で、脳を健康に保つ</span>
              </li>
            </ul>
          </div>
        </section>

        {/* チームの想い */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-amber-600">◆</span> 私たちの想い
          </h2>
          <div className="bg-white/70 rounded-2xl p-6 md:p-8 shadow-sm border border-amber-100">
            <p className="text-base md:text-lg text-amber-900 leading-loose">
              将棋は何百年も受け継がれてきた、日本の宝物です。
            </p>
            <p className="text-base md:text-lg text-amber-900 leading-loose mt-3">
              人生の後半をもっと豊かにするもの。
              頭を使い、指先を動かし、勝負の喜びを味わう。
              それは年齢に関係なく、人を生き生きとさせてくれます。
            </p>
            <p className="text-base md:text-lg text-amber-900 leading-loose mt-3">
              「最近ちょっと物忘れが…」と感じている方も、
              「定年後に何か始めたい」と思っている方も、
              ぜひ気軽に一局、指してみてください。
            </p>
            <p className="text-base md:text-lg text-amber-900 leading-loose mt-3 font-bold">
              将棋の縁台は、あなたの毎日の「楽しみ」になれることを願っています。
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/play"
            className="btn-warm inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl font-bold py-4 px-10 rounded-xl shadow-lg"
          >
            ▲ さっそく対局する
          </Link>
        </div>
      </div>
    </div>
  );
}
