'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MonthlySummary from '@/components/MonthlySummary';
import TransactionList from '@/components/TransactionList';

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('transactions')
      .select('*')
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
  }, []);

  async function handleDelete(id) {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* 월 헤더 — 향후 좌우에 월 이동 버튼 추가 가능 */}
      <div className="mb-4">
        <p className="text-lg font-bold">{year}년 {month}월</p>
        <p className="text-sm font-medium text-gray-700 mt-1">이번 달 요약</p>
        <p className="text-xs text-gray-400 mt-0.5">수입·지출·순수익을 한눈에 확인할 수 있습니다.</p>
      </div>

      <MonthlySummary income={income} expense={expense} balance={income - expense} />

      {/* 거래 내역 섹션 헤더 */}
      <div className="flex items-center justify-between mt-6 mb-3">
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

      {!loading && !error && transactions.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">아직 등록된 거래가 없습니다.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      )}
    </div>
  );
}
