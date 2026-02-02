import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import BottomTabBar from '@/components/BottomTabBar';
import GameAwareLayout from '@/components/GameAwareLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://shogi.because-why-not.com'),
  title: '将棋の縁台 | 50歳からの将棋サロン',
  description: '源さんと会話しながら将棋を楽しむ。50歳以上のためのあたたかい将棋サロン。登録不要・無料。',
  manifest: '/manifest.json',
  keywords: ['将棋', 'シニア', '50代', '60代', '脳トレ', '認知症予防', 'ボケ防止', '将棋アプリ', 'オンライン将棋', '将棋の縁台', '源さん', '会話', 'コミュニケーション'],
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
        <GameAwareLayout>
          {children}
        </GameAwareLayout>
      </body>
    </html>
  );
}
