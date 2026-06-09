export default function SettlementSummary({ income, expense, netAmount }) {
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">수입</span>
          <span className="text-sm font-medium text-red-500">+{fmt(income)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">지출</span>
          <span className="text-sm font-medium text-blue-600">-{fmt(expense)}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">순증가액</span>
          <span className={`text-base font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {netAmount >= 0 ? '+' : '-'}{fmt(Math.abs(netAmount))}
          </span>
        </div>
      </div>
    </div>
  );
}
