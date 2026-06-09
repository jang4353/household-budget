'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TransactionList from '@/components/TransactionList';

export default function TransactionsPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setCurrentUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    const { year, month } = currentDate;
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    setLoading(true);
    setError('');

    supabase
      .from('transactions')
      .select('*')
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setTransactions(data);
        }
        setLoading(false);
      });
  }, [currentDate]);

  function movePrev() {
    setCurrentDate(({ year, month }) =>
      month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
    );
  }

  function moveNext() {
    setCurrentDate(({ year, month }) =>
      month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
    );
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const { year, month } = currentDate;

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'mine') return t.user_id === currentUserId;
    if (filter === 'spouse') return t.user_id !== currentUserId;
    return true;
  });

  const FILTERS = [
    { value: 'all', label: '전체' },
    { value: 'mine', label: '나' },
    { value: 'spouse', label: '배우자' },
  ];

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* 월 헤더 */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <button onClick={movePrev} className="text-gray-400 hover:text-gray-700 text-lg px-1">◀</button>
          <p className="text-lg font-bold">{year}년 {month}월</p>
          <button onClick={moveNext} className="text-gray-400 hover:text-gray-700 text-lg px-1">▶</button>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 거래 내역 섹션 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-semibold">거래 내역</p>
        <button
          onClick={() => router.push('/transactions/new')}
          className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
        >
          거래 추가
        </button>
      </div>

      {loading && <p className="text-center text-gray-400 text-sm">불러오는 중...</p>}

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {!loading && !error && filteredTransactions.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">아직 등록된 거래가 없습니다.</p>
      )}

      {!loading && !error && filteredTransactions.length > 0 && (
        <TransactionList transactions={filteredTransactions} onDelete={handleDelete} currentUserId={currentUserId} />
      )}
    </div>
  );
}
