'use client';

import { useState, useRef, useEffect } from 'react';
import type { AuditEvent } from '@/types';

interface ExportButtonProps {
  events: AuditEvent[];
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCSV(events: AuditEvent[]): string {
  const headers = ['id', 'timestamp', 'eventType', 'action', 'result', 'actor'];
  const escape = (val: unknown) => {
    const str = String(val ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const rows = events.map((e) =>
    [
      e.id,
      new Date(e.timestamp).toISOString(),
      e.eventType,
      e.action,
      e.result,
      e.actor ?? '',
    ].map(escape).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function ExportButton({ events }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJSON = () => {
    downloadFile(
      JSON.stringify(events, null, 2),
      `audit-log-${Date.now()}.json`,
      'application/json'
    );
    setOpen(false);
  };

  const handleExportCSV = () => {
    downloadFile(toCSV(events), `audit-log-${Date.now()}.csv`, 'text/csv');
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={events.length === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <button
            onClick={handleExportJSON}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Export as JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
          >
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}