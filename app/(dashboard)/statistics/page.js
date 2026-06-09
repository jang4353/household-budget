'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MonthlySummary from '@/components/MonthlySummary';
import CategoryExpenseChart from '@/components/CategoryExpenseChart';

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'mine', label: '나' },
  { value: 'spouse', label: '배우자' },
];

export default function StatisticsPage() {
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

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'mine') return t.user_id === currentUserId;
    if (filter === 'spouse') return t.user_id !== currentUserId;
    return true;
  });

  const income = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const { year, month } = currentDate;
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const summaryLabel = isCurrentMonth ? '이번 달 요약' : `${month}월 요약`;

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* 월 헤더 */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <button onClick={movePrev} className="text-gray-400 hover:text-gray-700 text-lg px-1">◀</button>
          <p className="text-lg font-bold">{year}년 {month}월</p>
          <button onClick={moveNext} className="text-gray-400 hover:text-gray-700 text-lg px-1">▶</button>
        </div>
        <p className="text-sm font-medium text-gray-700 mt-1">{summaryLabel}</p>
        <p className="text-xs text-gray-400 mt-0.5">수입·지출·순수익을 한눈에 확인할 수 있습니다.</p>
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

      {loading && <p className="text-center text-gray-400 text-sm">불러오는 중...</p>}

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <MonthlySummary income={income} expense={expense} balance={income - expense} />
          <CategoryExpenseChart transactions={filteredTransactions} />
        </>
      )}
    </div>
  );
}
