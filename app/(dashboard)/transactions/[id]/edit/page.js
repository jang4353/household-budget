'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TransactionForm from '@/components/TransactionForm';

export default function EditTransactionPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setFetchError('거래를 불러올 수 없습니다.');
          return;
        }
        setInitialValues({
          type: data.type,
          amount: String(data.amount),
          category: data.category,
          date: data.date,
          memo: data.memo ?? '',
        });
      });
  }, [id]);

  async function handleSubmit({ type, amount, category, date, memo }) {
    const { error } = await supabase
      .from('transactions')
      .update({ type, amount: Number(amount), category, date, memo })
      .eq('id', id);

    if (error) return error.message;

    router.push('/transactions');
  }

  if (fetchError) {
    return <p className="text-center text-red-500 text-sm mt-12">{fetchError}</p>;
  }

  if (!initialValues) {
    return <p className="text-center text-gray-400 text-sm mt-12">불러오는 중...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-6">거래 수정</h1>
        <TransactionForm
          initialValues={initialValues}
          submitLabel="저장"
          onSubmit={handleSubmit}
          onCancel={() => router.push('/transactions')}
        />
      </div>
    </div>
  );
}
