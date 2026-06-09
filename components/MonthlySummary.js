export default function MonthlySummary({ income, expense, balance }) {
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  return (
    <div className="grid grid-cols-3 gap-2 mb-6 text-center">
      <div className="bg-red-50 p-3 rounded">
        <p className="text-xs text-gray-500 mb-1">수입</p>
        <p className="text-red-500 font-bold text-sm">{fmt(income)}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded">
        <p className="text-xs text-gray-500 mb-1">지출</p>
        <p className="text-blue-600 font-bold text-sm">{fmt(expense)}</p>
      </div>
      <div className="bg-green-50 p-3 rounded">
        <p className="text-xs text-gray-500 mb-1">순수익</p>
        <p className="text-green-600 font-bold text-sm">{fmt(balance)}</p>
      </div>
    </div>
  );
}
