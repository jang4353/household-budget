'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const TAB_ITEMS = [
  { href: '/transactions', label: '거래' },
  { href: '/statistics', label: '통계' },
  { href: '/assets', label: '자산' },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setChecked(true);
      }
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단: 제목 + 로그아웃 */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">부부 가계부</span>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          로그아웃
        </button>
      </nav>

      {/* 콘텐츠 — 하단 탭바 높이만큼 여백 */}
      <main className="p-4 pb-24">{children}</main>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {TAB_ITEMS.map(({ href, label }) => {
          const active = pathname === href || (href === '/transactions' && pathname.startsWith('/transactions'));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                active ? 'text-blue-600 border-t-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
