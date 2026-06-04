export default function TransactionItem({ category, memo, amount, type }) {
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <span className="font-medium text-sm">{category}</span>
        <span className="text-gray-400 text-xs ml-2">{memo}</span>
      </div>
      <span className={`text-sm font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'income' ? '+' : '-'}{fmt(amount)}
      </span>
    </div>
  );
}
