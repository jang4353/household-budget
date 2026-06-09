'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SettlementSummary from '@/components/SettlementSummary';

const PERIOD_TYPES = [
  { value: 'month', label: '월' },
  { value: 'quarter', label: '분기' },
  { value: 'year', label: '연' },
];

const QUARTER_MONTHS = {
  1: { start: 1, end: 3 },
  2: { start: 4, end: 6 },
  3: { start: 7, end: 9 },
  4: { start: 10, end: 12 },
};

function lastDay(year, month) {
  return new Date(year, month, 0).getDate();
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function getDateRange(periodType, year, month, quarter) {
  if (periodType === 'month') {
    return {
      start: `${year}-${pad(month)}-01`,
      end: `${year}-${pad(month)}-${lastDay(year, month)}`,
    };
  }
  if (periodType === 'quarter') {
    const { start: sm, end: em } = QUARTER_MONTHS[quarter];
    return {
      start: `${year}-${pad(sm)}-01`,
      end: `${year}-${pad(em)}-${lastDay(year, em)}`,
    };
  }
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

function getPeriodLabel(periodType, year, month, quarter) {
  if (periodType === 'month') return `${year}년 ${month}월`;
  if (periodType === 'quarter') return `${year}년 ${quarter}분기`;
  return `${year}년`;
}

export default function SettlementPage() {
  const now = new Date();
  const [periodType, setPeriodType] = useState('month');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.floor(now.getMonth() / 3) + 1);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const { start, end } = getDateRange(periodType, year, month, quarter);

    setLoading(true);
    setError('');

    supabase
      .from('transactions')
      .select('type, amount')
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
  }, [periodType, year, month, quarter]);

  function movePrev() {
    if (periodType === 'month') {
      if (month === 1) { setYear((y) => y - 1); setMonth(12); }
      else setMonth((m) => m - 1);
    } else if (periodType === 'quarter') {
      if (quarter === 1) { setYear((y) => y - 1); setQuarter(4); }
      else setQuarter((q) => q - 1);
    } else {
      setYear((y) => y - 1);
    }
  }

  function moveNext() {
    if (periodType === 'month') {
      if (month === 12) { setYear((y) => y + 1); setMonth(1); }
      else setMonth((m) => m + 1);
    } else if (periodType === 'quarter') {
      if (quarter === 4) { setYear((y) => y + 1); setQuarter(1); }
      else setQuarter((q) => q + 1);
    } else {
      setYear((y) => y + 1);
    }
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* 기간 타입 선택 */}
      <div className="flex gap-2 mb-4">
        {PERIOD_TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriodType(value)}
            className={`px-3 py-1 rounded-full text-sm border ${
              periodType === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 기간 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button onClick={movePrev} className="text-gray-400 hover:text-gray-700 text-lg px-1">◀</button>
          <p className="text-lg font-bold">{getPeriodLabel(periodType, year, month, quarter)}</p>
          <button onClick={moveNext} className="text-gray-400 hover:text-gray-700 text-lg px-1">▶</button>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">수입·지출·순증가액을 확인하세요.</p>
      </div>

      {loading && <p className="text-center text-gray-400 text-sm">불러오는 중...</p>}

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <SettlementSummary income={income} expense={expense} netAmount={income - expense} />
      )}
    </div>
  );
}
