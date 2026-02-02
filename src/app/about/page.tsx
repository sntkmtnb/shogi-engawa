import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold text-amber-900 text-center mb-8 tracking-wider">
        将棋の縁台について
      </h1>

      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-amber-500">◆</span> なぜ「縁台」なのか
        </h2>
        <div className="ios-card p-6 md:p-8">
          <p className="text-base text-amber-800 leading-loose">
            「縁台将棋」という言葉を覚えていますか？
          </p>
          <p className="text-base text-amber-800 leading-loose mt-3">
            夏の夕暮れ、縁台に腰かけて近所の人と一局。
            勝っても負けても笑いあえる、あのゆったりとした時間。
          </p>
          <p className="text-base text-amber-800 leading-loose mt-3">
            「将棋の縁台」は、そんな温かい空気をインターネットの上に再現したいという想いから生まれました。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-amber-500">◆</span> 50歳以上の方のために
        </h2>
        <div className="ios-card p-6 md:p-8">
          <p className="text-base text-amber-800 leading-loose">
            「50歳以上の方が、迷わず使える将棋アプリ」を目指しました。
          </p>
          <ul className="mt-4 space-y-3 text-base text-amber-800">
            {['大きな文字と駒で、目に優しい', 'シンプルな操作で、すぐに対局できる', '棋力に合わせたAIで、楽しく上達', '毎日の対局で、脳を健康に保つ'].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-amber-500 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-amber-500">◆</span> 私たちの想い
        </h2>
        <div className="ios-card p-6 md:p-8">
          <p className="text-base text-amber-800 leading-loose">
            将棋は何百年も受け継がれてきた、日本の宝物です。
          </p>
          <p className="text-base text-amber-800 leading-loose mt-3">
            人生の後半をもっと豊かにするもの。
            頭を使い、指先を動かし、勝負の喜びを味わう。
          </p>
          <p className="text-base text-amber-800 leading-loose mt-3 font-bold">
            将棋の縁台は、あなたの毎日の「楽しみ」になれることを願っています。
          </p>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/play"
          className="btn-ios inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-white text-xl font-bold py-4 px-10 shadow-lg active:scale-95"
        >
          ▲ さっそく対局する
        </Link>
      </div>
    </div>
  );
}
