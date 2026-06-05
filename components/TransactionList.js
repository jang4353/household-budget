import TransactionItem from '@/components/TransactionItem';

export default function TransactionList({ transactions }) {
  const grouped = transactions.reduce((acc, t) => {
    (acc[t.date] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => (
          <div key={date} className="mb-4">
            <p className="text-xs text-gray-400 mb-2">{date}</p>
            {items.map(t => (
              <TransactionItem
                key={t.id}
                category={t.category}
                memo={t.memo}
                amount={t.amount}
                type={t.type}
              />
            ))}
          </div>
        ))
      }
    </div>
  );
}
