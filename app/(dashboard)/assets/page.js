'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AssetTrendChart from '@/components/AssetTrendChart';

export default function AssetsPage() {
  const [chartData, setChartData] = useState([]);
  const [totalAsset, setTotalAsset] = useState(0);
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('transactions')
      .select('type, amount, date')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        // 월별 순수익 집계
        const monthlyMap = {};
        for (const t of data) {
          const month = t.date.slice(0, 7); // 'YYYY-MM'
          if (!monthlyMap[month]) monthlyMap[month] = 0;
          monthlyMap[month] +=
            t.type === 'income' ? Number(t.amount) : -Number(t.amount);
        }

        // 월 오름차순 정렬 후 누적 계산
        const sortedMonths = Object.keys(monthlyMap).sort();
        let cumulative = 0;
        const result = sortedMonths.map((month) => {
          cumulative += monthlyMap[month];
          return { month: month.slice(5) + '월', cumulative };
        });

        setChartData(result);
        setTotalAsset(cumulative);
        setDateRange(
          sortedMonths.length > 0
            ? { start: sortedMonths[0], end: sortedMonths[sortedMonths.length - 1] }
            : null
        );
        setLoading(false);
      });
  }, []);

  const fmt = (n) => n.toLocaleString('ko-KR') + '원';

  return (
    <div className="max-w-md mx-auto mt-6">
      <p className="text-lg font-bold mb-4">자산</p>

      {loading && <p className="text-center text-gray-400 text-sm">불러오는 중...</p>}

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          {/* 누적 현금흐름 요약 카드 */}
          <div className="bg-white rounded-lg shadow p-4 mb-4 text-center">
            <p className="text-xs text-gray-500 mb-1">누적 현금흐름</p>
            <p className={`text-2xl font-bold ${totalAsset >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {fmt(totalAsset)}
            </p>
            {dateRange && (
              <p className="text-xs text-gray-400 mt-2">
                {dateRange.start} ~ {dateRange.end} 전체 기간 기준
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              거래 내역의 수입 - 지출을 누적한 금액입니다.<br />
              기초 자산, 주식 평가손익, 부채는 아직 반영되지 않습니다.
            </p>
          </div>

          {/* 추이 그래프 */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-semibold mb-3">월별 누적 현금흐름 추이</p>
            <AssetTrendChart data={chartData} />
          </div>
        </>
      )}
    </div>
  );
}
