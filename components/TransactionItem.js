'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TransactionItem({ id, userId, currentUserId, category, memo, amount, type, onDelete }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';
  const isOwn = userId === currentUserId;

  function handleDelete() {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
      onDelete(id);
    }
  }

  return (
    <div className={`border-b relative ${open ? 'bg-blue-50' : ''}`}>
      {/* 메인 행 */}
      <div
        className={`flex justify-between items-center py-3 gap-3 ${isOwn ? 'cursor-pointer' : ''}`}
        onClick={isOwn ? () => setOpen((v) => !v) : undefined}
      >
        {/* 왼쪽: 카테고리+뱃지 / 메모 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-sm">{category}</p>
            {currentUserId && (
              <span className="text-xs text-gray-400 border border-gray-200 rounded px-1 leading-tight">
                {isOwn ? '나' : '배우자'}
              </span>
            )}
          </div>
          {memo && <p className="text-gray-400 text-xs mt-0.5">{memo}</p>}
        </div>

        {/* 오른쪽: 금액 */}
        <span className={`text-sm font-medium shrink-0 ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'income' ? '+' : '-'}{fmt(amount)}
        </span>
      </div>

      {/* 오버레이 */}
      {open && (
        <div
          className="absolute inset-0 bg-blue-100/60 flex items-center justify-center gap-3"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/transactions/${id}/edit`); }}
            className="text-sm text-gray-600 border border-gray-300 rounded px-5 py-1.5 bg-white hover:bg-gray-100"
          >
            수정
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="text-sm text-red-500 border border-red-300 rounded px-5 py-1.5 bg-white hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
