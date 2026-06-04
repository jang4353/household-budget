export default function Home() {
  const transactions = [
    { id: 1, date: '2025-06-04', category: '식비', memo: '점심', amount: 12000, type: 'expense' },
    { id: 2, date: '2025-06-04', category: '교통', memo: '지하철', amount: 1500, type: 'expense' },
    { id: 3, date: '2025-06-01', category: '급여', memo: '6월 월급', amount: 3000000, type: 'income' },
  ];

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  const grouped = transactions.reduce((acc, t) => {
    (acc[t.date] ??= []).push(t);
    return acc;
  }, {});

  return (
    <main className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">부부 가계부</h1>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ 새 거래</button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        <div className="bg-green-50 p-3 rounded">
          <p className="text-xs text-gray-500 mb-1">수입</p>
          <p className="text-green-600 font-bold text-sm">{fmt(income)}</p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-xs text-gray-500 mb-1">지출</p>
          <p className="text-red-600 font-bold text-sm">{fmt(expense)}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-xs text-gray-500 mb-1">순수익</p>
          <p className="text-blue-600 font-bold text-sm">{fmt(balance)}</p>
        </div>
      </div>

      <h2 className="text-base font-semibold mb-3">거래 내역</h2>
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => (
          <div key={date} className="mb-4">
            <p className="text-xs text-gray-400 mb-2">{date}</p>
            {items.map(t => (
              <div key={t.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <span className="font-medium text-sm">{t.category}</span>
                  <span className="text-gray-400 text-xs ml-2">{t.memo}</span>
                </div>
                <span className={`text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
              </div>
            ))}
          </div>
        ))
      }
    </main>
  );
}
