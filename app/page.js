import MonthlySummary from '@/components/MonthlySummary';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  const transactions = [
    { id: 1, date: '2025-06-04', category: '식비', memo: '점심', amount: 12000, type: 'expense' },
    { id: 2, date: '2025-06-04', category: '교통', memo: '지하철', amount: 1500, type: 'expense' },
    { id: 3, date: '2025-06-01', category: '급여', memo: '6월 월급', amount: 3000000, type: 'income' },
  ];

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  return (
    <main className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">부부 가계부</h1>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ 새 거래</button>
      </div>

      <MonthlySummary income={income} expense={expense} balance={balance} />

      <TransactionList transactions={transactions} />
    </main>
  );
}
