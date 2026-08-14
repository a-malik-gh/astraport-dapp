'use client';

interface DateRangeFilterProps {
  dateFrom: number | null;
  dateTo: number | null;
  onChange: (dateFrom: number | null, dateTo: number | null) => void;
}

export function DateRangeFilter({ dateFrom, dateTo, onChange }: DateRangeFilterProps) {
  const toInputValue = (ts: number | null) =>
    ts ? new Date(ts).toISOString().slice(0, 10) : '';

  const fromDate = (value: string): number | null =>
    value ? new Date(value + 'T00:00:00').getTime() : null;

  const toDate = (value: string): number | null =>
    value ? new Date(value + 'T23:59:59').getTime() : null;

  return (
    <div className="flex items-center gap-2">
      <label className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
        From
        <input
          type="date"
          value={toInputValue(dateFrom)}
          onChange={(e) => onChange(fromDate(e.target.value), dateTo)}
          className="mt-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
        />
      </label>
      <label className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
        To
        <input
          type="date"
          value={toInputValue(dateTo)}
          onChange={(e) => onChange(dateFrom, toDate(e.target.value))}
          className="mt-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
        />
      </label>
      {(dateFrom || dateTo) && (
        <button
          onClick={() => onChange(null, null)}
          className="self-end mb-1 text-xs text-brand-teal hover:underline"
        >
          Clear all 
        </button>
      )}
    </div>
  );
}