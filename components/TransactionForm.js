'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/constants/categories';

export default function TransactionForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [type, setType] = useState(initialValues.type);
  const [amount, setAmount] = useState(initialValues.amount);
  const [category, setCategory] = useState(initialValues.category);
  const [date, setDate] = useState(initialValues.date);
  const [memo, setMemo] = useState(initialValues.memo);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleTypeChange(newType) {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await onSubmit({ type, amount, category, date, memo });

    if (result) {
      setError(result);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 수입/지출 선택 */}
      <div className="flex gap-2">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`flex-1 py-2 rounded font-medium text-sm border ${
              type === t
                ? t === 'expense'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-500 border-gray-300'
            }`}
          >
            {t === 'expense' ? '지출' : '수입'}
          </button>
        ))}
      </div>

      {/* 금액 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES[type].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 날짜 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="선택 입력"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded font-medium text-sm hover:bg-gray-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
