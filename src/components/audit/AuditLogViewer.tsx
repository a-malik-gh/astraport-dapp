'use client';

import { useState, useMemo } from 'react';
import { AuditLogTable } from './AuditLogTable';
import type { AuditEvent, AuditEventType } from '@/types';
import { mockAuditEvents } from '../../../examples/mockAuditEvents';
import { DateRangeFilter } from './DateRangeFilter';
import { EventTypeFilter } from './EventTypeFilter';
import { EventDetailModal } from './EventDetailModal';
import { ExportButton } from './ExportButton';


export interface AuditLogFilters {
  dateFrom: number | null;
  dateTo: number | null;
  eventTypes: AuditEventType[];
  search: string;
}

const defaultFilters: AuditLogFilters = {
  dateFrom: null,
  dateTo: null,
  eventTypes: [],
  search: '',
};

export default function AuditLogViewer() {
  const [filters, setFilters] = useState<AuditLogFilters>(defaultFilters);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  // this is a placeholder for fetching events from an API or other source, must be replaced for fetch real data 
  const events = mockAuditEvents;  

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.dateFrom && event.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && event.timestamp > filters.dateTo) return false;
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.eventType)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${event.action} ${event.eventType} ${event.result}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [events, filters]);

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
            <ExportButton events={filteredEvents} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <DateRangeFilter
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onChange={(dateFrom, dateTo) => setFilters((f) => ({ ...f, dateFrom, dateTo }))}
        />
        <EventTypeFilter
            selected={filters.eventTypes}
            onChange={(eventTypes) => setFilters((f) => ({ ...f, eventTypes }))}
        />
        <label className="flex flex-col text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-[200px]">
            Search
            <input
            type="text"
            placeholder="Search by action, type, or result..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="mt-1 px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
            />
        </label>
        {(filters.dateFrom || filters.dateTo || filters.eventTypes.length > 0 || filters.search) && (
            <button
            onClick={() => setFilters(defaultFilters)}
            className="text-sm text-gray-500 hover:text-brand-teal underline whitespace-nowrap"
            >
            Clear all 
            </button>
        )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <AuditLogTable events={filteredEvents} onSelectEvent={setSelectedEvent} />
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    </div>
    );
}