'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import type { AuditEvent } from '@/types';

const columnHelper = createColumnHelper<AuditEvent>();

const columns = [
  columnHelper.accessor('timestamp', {
    header: 'Timestamp',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor('eventType', {
    header: 'Event Type',
  }),
  columnHelper.accessor('action', {
    header: 'Action',
  }),
  columnHelper.accessor('result', {
    header: 'Result',
    cell: (info) => {
      const result = info.getValue();
      const color =
        result === 'success' ? 'text-green-600' :
        result === 'failure' ? 'text-red-600' : 'text-yellow-600';
      return <span className={color}>{result}</span>;
    },
  }),
];

interface AuditLogTableProps {
  events: AuditEvent[];
  onSelectEvent: (event: AuditEvent) => void;
}

export function AuditLogTable({ events, onSelectEvent }: AuditLogTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: events,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-brand-teal transition-colors"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                onClick={() => onSelectEvent(row.original)}
                className={`cursor-pointer transition-colors hover:bg-brand-teal/5 dark:hover:bg-brand-teal/10 ${
                  i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-900/20'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {table.getRowModel().rows.map((row) => {
          const event = row.original;
          const resultColor =
            event.result === 'success' ? 'text-green-600' :
            event.result === 'failure' ? 'text-red-600' : 'text-yellow-600';
          return (
            <div
              key={row.id}
              onClick={() => onSelectEvent(event)}
              className="p-4 active:bg-gray-50 dark:active:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
                <span className={`text-xs font-medium ${resultColor}`}>{event.result}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.eventType}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{event.action}</p>
            </div>
          );
        })}
      </div>

      {/* Pagination — shared by both views */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
}