'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }

      supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            router.push('/transactions');
          } else {
            setReady(true);
          }
        });
    });
  }, [router]);

  if (!ready) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">부부 가계부 시작하기</h1>

        <button
          onClick={() => alert('다음 단계에서 구현')}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 mb-6"
        >
          가계부 만들기
        </button>

        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="초대 코드 입력"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => alert('다음 단계에서 구현')}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded font-medium hover:bg-blue-50"
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
