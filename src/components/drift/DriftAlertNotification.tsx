import React from 'react';
import { DriftAlert, SEVERITY_COLORS } from '@/types/drift';
import DriftIndicators from './DriftIndicators';

interface DriftAlertNotificationProps {
  alert: DriftAlert;
  onAcknowledge: () => void;
  onRebalance: () => void;
}

const DriftAlertNotification: React.FC<DriftAlertNotificationProps> = ({
  alert,
  onAcknowledge,
  onRebalance
}) => {
  const colors = SEVERITY_COLORS[alert.severity];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-5 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {/* Alert Icon */}
            <div className={`mt-0.5 p-2 rounded-full ${
              alert.severity === 'critical' ? 'bg-red-200 dark:bg-red-800/50' :
              alert.severity === 'high' ? 'bg-orange-200 dark:bg-orange-800/50' :
              alert.severity === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800/50' :
              'bg-green-200 dark:bg-green-800/50'
            }`}>
              <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {alert.severity === 'low' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className={`text-lg font-semibold ${colors.text}`}>
                  {alert.assetCode} Drift Alert
                </h4>
                <DriftIndicators driftPercent={alert.driftPercent} severity={alert.severity} size="sm" />
              </div>
              
              <p className={`text-sm ${colors.text} opacity-90 mb-2`}>
                {alert.message}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-slate-400">
                <span>
                  <span className="font-medium">Occurred:</span>{' '}
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
                {alert.recommendations.length > 0 && (
                  <span>
                    <span className="font-medium">Recommended:</span>{' '}
                    {alert.recommendations[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 lg:flex-shrink-0">
          <button
            onClick={onAcknowledge}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-white/50 dark:hover:bg-gray-900/50 transition-colors"
          >
            Acknowledge
          </button>
          
          {(alert.severity === 'high' || alert.severity === 'critical') && (
            <a
              href="/rebalance"
              onClick={(e) => {
                e.preventDefault();
                onRebalance();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-navy dark:bg-brand-teal text-white dark:text-brand-navy text-sm font-semibold hover:bg-stellar-700 dark:hover:bg-stellar-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rebalance Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriftAlertNotification;