'use client';

import { useRouter } from 'next/navigation';

export default function TransactionItem({ id, userId, currentUserId, category, memo, amount, type, onDelete }) {
  const router = useRouter();
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  function handleDelete() {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
      onDelete(id);
    }
  }

  return (
    <div className="flex justify-between items-start border-b py-3 gap-3">
      {/* 왼쪽: 카테고리+뱃지 / 메모 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-sm">{category}</p>
          {currentUserId && (
            <span className="text-xs text-gray-400 border border-gray-200 rounded px-1 leading-tight">
              {userId === currentUserId ? '나' : '배우자'}
            </span>
          )}
        </div>
        {memo && <p className="text-gray-400 text-xs mt-0.5">{memo}</p>}
      </div>

      {/* 오른쪽: 금액 / 버튼 */}
      <div className="flex flex-col items-end shrink-0">
        <span className={`text-sm font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'income' ? '+' : '-'}{fmt(amount)}
        </span>
        {userId === currentUserId && (
          <div className="flex gap-1 mt-1.5">
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
        )}
      </div>
    </div>
  );
}
