'use client';

import { useEffect } from 'react';
import type { AuditEvent } from '@/types';
import { StateComparison } from './StateComparison';

interface EventDetailModalProps {
  event: AuditEvent | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!event) return null;

  const resultColor =
    event.result === 'success' ? 'text-green-600' :
    event.result === 'failure' ? 'text-red-600' : 'text-yellow-600';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Timestamp</span>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Result</span>
              <p className={`font-medium ${resultColor}`}>{event.result}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Event Type</span>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{event.eventType}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Actor</span>
              <p className="text-gray-900 dark:text-gray-100 font-medium truncate">{event.actor ?? '—'}</p>
            </div>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Action</span>
            <p className="text-gray-900 dark:text-gray-100">{event.action}</p>
          </div>

          {(event.before || event.after) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State Change</h4>
              <StateComparison before={event.before} after={event.after} />
            </div>
          )}

          {event.metadata && (
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Metadata</span>
              <pre className="mt-1 text-xs bg-gray-50 dark:bg-gray-900/50 rounded p-3 overflow-x-auto text-gray-700 dark:text-gray-300">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Event ID</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-mono">{event.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}