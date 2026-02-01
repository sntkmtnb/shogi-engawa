import type { Metadata, Viewport } from 'next';
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
      <body className="min-h-screen bg-[#f5f0e0]">
        <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold tracking-wider">
                🏠 将棋の縁台
              </span>
            </a>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
