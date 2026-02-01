import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '将棋の縁台 | 50歳からの将棋サロン',
  description: '50歳以上のための将棋アプリ。大きな駒、見やすい盤面、あたたかいコミュニティ。毎朝の一局が、あなたの毎日を豊かにする。AI対局・詰将棋・脳トレ。',
  manifest: '/manifest.json',
  keywords: ['将棋', 'シニア', '50代', '60代', '脳トレ', '認知症予防', 'ボケ防止', '将棋アプリ', 'オンライン将棋', '将棋の縁台'],
  openGraph: {
    title: '将棋の縁台 | 50歳からの将棋サロン',
    description: '毎朝の一局が、あなたの毎日を豊かにする。50歳以上のためのあたたかい将棋サロン。',
    type: 'website',
    locale: 'ja_JP',
    siteName: '将棋の縁台',
  },
  twitter: {
    card: 'summary_large_image',
    title: '将棋の縁台 | 50歳からの将棋サロン',
    description: '毎朝の一局が、あなたの毎日を豊かにする。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#8B4513',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#f5f0e0] flex flex-col">
        <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-2xl md:text-3xl font-bold tracking-wider">
                ▲ 将棋の縁台
              </span>
            </Link>
            <nav className="flex items-center gap-4 md:gap-6">
              <Link
                href="/play"
                className="text-amber-200 hover:text-white text-sm md:text-base font-bold transition-colors"
              >
                対局する
              </Link>
              <Link
                href="/tsume"
                className="text-amber-200 hover:text-white text-sm md:text-base font-bold transition-colors"
              >
                詰将棋
              </Link>
              <Link
                href="/about"
                className="text-amber-200 hover:text-white text-sm md:text-base font-bold transition-colors"
              >
                縁台について
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-amber-900 text-amber-200/80">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            <p>© 2026 将棋の縁台</p>
            <div className="flex items-center gap-4">
              <Link href="/about" className="hover:text-white transition-colors">
                将棋の縁台について
              </Link>
              <span className="text-amber-700">|</span>
              <span className="text-amber-200/60">お問い合わせ</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
