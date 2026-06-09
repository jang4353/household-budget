function ColData({ data, label }) {
  const isNull = data === null;
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';
  const net = isNull ? null : data.income - data.expense;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-500 text-center mb-3">{label}</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">수입</span>
          <span className="text-xs font-medium text-red-500">
            {isNull ? '-' : `+${fmt(data.income)}`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">지출</span>
          <span className="text-xs font-medium text-blue-600">
            {isNull ? '-' : `-${fmt(data.expense)}`}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
          <span className="text-xs text-gray-400">순증가</span>
          <span className="text-xs font-medium text-green-600">
            {isNull ? '-' : `${net >= 0 ? '+' : '-'}${fmt(Math.abs(net))}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CoupleContribution({ mine, spouse }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 mt-4">
      <p className="text-sm font-semibold text-gray-700 mb-4">부부 기여도</p>
      <div className="flex gap-4">
        <ColData data={mine} label="나" />
        <div className="w-px bg-gray-100" />
        <ColData data={spouse} label="배우자" />
      </div>
    </div>
  );
}
