'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/play', label: '対局', emoji: '♟️' },
  { href: '/tsume', label: '詰将棋', emoji: '🧩' },
  { href: '/learn', label: '学ぶ', emoji: '📖' },
  { href: '/diary', label: '日記', emoji: '📔' },
  { href: '/profile', label: '記録', emoji: '📊' },
  { href: '/', label: '縁台', emoji: '🏠', exact: true },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="tab-bar">
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-1.5">
        {tabs.map(tab => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all ${
                isActive
                  ? 'text-amber-800 bg-amber-100/80 scale-110'
                  : 'text-amber-600/60 hover:text-amber-700'
              }`}
              aria-label={tab.label}
            >
              <span className={`text-xl ${isActive ? 'text-2xl' : ''}`}>{tab.emoji}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
