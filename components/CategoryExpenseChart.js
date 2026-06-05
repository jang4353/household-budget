'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function CategoryExpenseChart({ transactions }) {
  const expenses = transactions.filter((t) => t.type === 'expense');

  if (expenses.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm my-4">
        이번 달 지출 데이터가 없습니다.
      </p>
    );
  }

  const totals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
    return acc;
  }, {});

  const totalExpense = Object.values(totals).reduce((sum, v) => sum + v, 0);

  const data = Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: Math.round((amount / totalExpense) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);

  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold">카테고리별 지출</p>
        <p className="text-xs text-gray-500">총 {fmt(totalExpense)}</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => fmt(value)}
            labelFormatter={(label) => label}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="mt-3 space-y-2">
        {data.map((item, index) => (
          <li key={item.category} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-500 w-10 text-right shrink-0">{item.percent}%</span>
            <span className="flex-1 font-medium">{item.category}</span>
            <span className="text-gray-700">{fmt(item.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
