import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import BottomTabBar from '@/components/BottomTabBar';

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
      <body className="min-h-screen min-h-dvh flex flex-col">
        {/* Frosted glass header */}
        <header className="glass-header sticky top-0 z-30 text-amber-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-xl md:text-2xl font-bold tracking-wider">
                ▲ 将棋の縁台
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 main-content">{children}</main>

        {/* iOS-style bottom tab bar */}
        <BottomTabBar />
      </body>
    </html>
  );
}
