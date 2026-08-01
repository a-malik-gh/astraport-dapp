'use client';

import { useState, useRef, useEffect } from 'react';
import type { AuditEventType } from '@/types';

const ALL_EVENT_TYPES: AuditEventType[] = [
  'wallet_connected',
  'wallet_disconnected',
  'trade_executed',
  'rebalance_triggered',
  'risk_alert',
  'ai_recommendation_applied',
  'settings_changed',
  'export_generated',
];

interface EventTypeFilterProps {
  selected: AuditEventType[];
  onChange: (types: AuditEventType[]) => void;
}

export function EventTypeFilter({ selected, onChange }: EventTypeFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (type: AuditEventType) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-w-[160px] text-left"
      >
        {selected.length === 0
          ? 'All event types'
          : `${selected.length} tipo${selected.length > 1 ? 's' : ''} seleccionado${selected.length > 1 ? 's' : ''}`}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-64 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg max-h-64 overflow-y-auto">
          {ALL_EVENT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(type)}
                onChange={() => toggle(type)}
              />
              {type.replace(/_/g, ' ')}
            </label>
          ))}
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-2 text-xs text-brand-teal hover:underline border-t border-gray-100 dark:border-gray-700"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}