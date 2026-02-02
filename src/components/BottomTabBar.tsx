'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', icon: '🏠', label: 'ホーム', exact: true },
  { href: '/play', icon: '♟️', label: '対局' },
  { href: '/tsume', icon: '🧩', label: '詰将棋' },
  { href: '/learn', icon: '📖', label: '学ぶ' },
  { href: '/profile', icon: '📊', label: 'マイページ' },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="tab-bar">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map(tab => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-800'
                  : 'text-gray-400 hover:text-amber-600'
              }`}
              aria-label={tab.label}
            >
              <span className={`transition-all ${isActive ? 'text-[22px]' : 'text-xl'}`}>
                {tab.icon}
              </span>
              <span className={`text-[9px] font-bold mt-0.5 transition-all ${
                isActive ? 'text-amber-800' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
