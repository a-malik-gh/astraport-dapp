'use client';

interface StateComparisonProps {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export function StateComparison({ before, after }: StateComparisonProps) {
  if (!before && !after) return null;

  const keys = Array.from(
    new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Before</h4>
        <div className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 space-y-1">
          {keys.map((key) => {
            const changed = before?.[key] !== after?.[key];
            return (
              <div key={key} className="text-sm flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">{key}</span>
                <span className={changed ? 'text-red-500 line-through' : 'text-gray-900 dark:text-gray-100'}>
                  {String(before?.[key] ?? '—')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">After</h4>
        <div className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 space-y-1">
          {keys.map((key) => {
            const changed = before?.[key] !== after?.[key];
            return (
              <div key={key} className="text-sm flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">{key}</span>
                <span className={changed ? 'text-green-600 font-medium' : 'text-gray-900 dark:text-gray-100'}>
                  {String(after?.[key] ?? '—')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}