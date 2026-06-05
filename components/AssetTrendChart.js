'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function formatAmount(value) {
  if (Math.abs(value) >= 10000) {
    return (value / 10000).toFixed(0) + '만원';
  }
  return value.toLocaleString('ko-KR') + '원';
}

export default function AssetTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm my-8">
        아직 자산 데이터가 없습니다.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={formatAmount}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip
          formatter={(value) => [value.toLocaleString('ko-KR') + '원', '순자산']}
          labelStyle={{ fontSize: 12 }}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3, fill: '#3b82f6' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
