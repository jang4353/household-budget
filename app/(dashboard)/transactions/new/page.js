'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/constants/categories';
import TransactionForm from '@/components/TransactionForm';

const INITIAL_VALUES = {
  type: 'expense',
  amount: '',
  category: CATEGORIES.expense[0],
  date: new Date().toISOString().split('T')[0],
  memo: '',
};

export default function NewTransactionPage() {
  const router = useRouter();

  async function handleSubmit({ type, amount, category, date, memo }) {
    const { data: { session } } = await supabase.auth.getSession();

    const { data: memberData } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', session.user.id)
      .limit(1)
      .single();

    if (!memberData) {
      router.push('/onboarding');
      return;
    }

    const { error } = await supabase.from('transactions').insert({
      user_id: session.user.id,
      household_id: memberData.household_id,
      type,
      amount: Number(amount),
      category,
      date,
      memo,
    });

    if (error) return error.message;

    router.push('/transactions');
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-6">거래 입력</h1>
        <TransactionForm
          initialValues={INITIAL_VALUES}
          submitLabel="저장"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
