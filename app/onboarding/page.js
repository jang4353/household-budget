'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

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

  async function handleCreate() {
    setError('');
    setLoading(true);

    const { data, error } = await supabase.rpc('create_household');

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setCreated(data);
    setLoading(false);
  }

  async function handleJoin() {
    if (inviteCode.length < 6) return;
    setError('');
    setJoinLoading(true);

    const { error } = await supabase.rpc('join_household', {
      invite_code_input: inviteCode,
    });

    if (error) {
      setError(error.message);
      setJoinLoading(false);
      return;
    }

    router.push('/transactions');
  }

  if (!ready) return null;

  if (created) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm text-center">
          <p className="text-lg font-bold mb-2">가계부가 만들어졌습니다!</p>
          <p className="text-sm text-gray-500 mb-6">배우자에게 아래 초대 코드를 공유하세요.</p>
          <p className="text-3xl font-bold tracking-widest text-blue-600 mb-8">
            {created.invite_code}
          </p>
          <button
            onClick={() => router.push('/transactions')}
            className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
          >
            거래 화면으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">부부 가계부 시작하기</h1>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? '생성 중...' : '가계부 만들기'}
        </button>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

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
            onClick={handleJoin}
            disabled={joinLoading || inviteCode.length < 6}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded font-medium hover:bg-blue-50 disabled:opacity-50"
          >
            {joinLoading ? '참여 중...' : '참여하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
