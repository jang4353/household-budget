'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SettlementSummary from '@/components/SettlementSummary';

export default function SettlementPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netAmount = income - expense;

  const { year, month } = currentDate;

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* 월 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button onClick={movePrev} className="text-gray-400 hover:text-gray-700 text-lg px-1">◀</button>
          <p className="text-lg font-bold">{year}년 {month}월</p>
          <button onClick={moveNext} className="text-gray-400 hover:text-gray-700 text-lg px-1">▶</button>
        </div>
        <p className="text-sm font-medium text-gray-700 mt-1">월별 결산</p>
        <p className="text-xs text-gray-400 mt-0.5">이번 달 수입·지출·순증가액을 확인하세요.</p>
      </div>

      {loading && <p className="text-center text-gray-400 text-sm">불러오는 중...</p>}

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <SettlementSummary income={income} expense={expense} netAmount={netAmount} />
      )}
    </div>
  );
}
