'use client';

import { useRouter } from 'next/navigation';

export default function TransactionItem({ id, category, memo, amount, type, onDelete }) {
  const router = useRouter();
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  function handleDelete() {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
      onDelete(id);
    }
  }

  return (
    <div className="flex justify-between items-center border-b py-2 gap-2">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{category}</p>
        {memo && <p className="text-gray-400 text-xs mt-0.5">{memo}</p>}
      </div>
      <span className={`text-sm font-medium shrink-0 ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'income' ? '+' : '-'}{fmt(amount)}
      </span>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => router.push(`/transactions/${id}/edit`)}
          className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-100"
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 border border-red-300 rounded px-2 py-0.5 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
