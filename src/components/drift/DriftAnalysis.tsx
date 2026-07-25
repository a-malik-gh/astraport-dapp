import React from 'react';
import { PortfolioDriftMetrics, DriftAnalysis as DriftAnalysisType } from '@/types/drift';
import { analyzeDrift } from '@/utils/driftAnalysis';

interface DriftAnalysisProps {
  metrics: PortfolioDriftMetrics;
}

const DriftAnalysis: React.FC<DriftAnalysisProps> = ({ metrics }) => {
  const analysis: DriftAnalysisType = analyzeDrift(metrics);

  const urgencyColors = {
    low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-300 dark:border-red-700'
  };

  const urgencyLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Drift Analysis</h3>
      
      {/* Rebalance Urgency */}
      <div className="mb-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Rebalance Urgency</p>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${urgencyColors[analysis.rebalanceUrgency]}`}>
          {urgencyLabels[analysis.rebalanceUrgency]}
        </span>
      </div>

      {/* Summary */}
      <div className="mb-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Summary</p>
        <p className="text-sm text-gray-800 dark:text-slate-300">{analysis.summary}</p>
      </div>

      {/* Root Causes */}
      {analysis.rootCauses.length > 0 && (
        <div className="mb-5">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Potential Root Causes</p>
          <ul className="space-y-2">
            {analysis.rootCauses.map((cause, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-800 dark:text-slate-300">
                <svg className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {cause}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Recommendations</p>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-800 dark:text-slate-300">
              <svg className="w-4 h-4 mt-0.5 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Estimated Savings */}
      {analysis.estimatedSavings > 0 && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-slate-400">Est. value recovery</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${analysis.estimatedSavings.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
            Estimated portfolio value improvement after rebalancing
          </p>
        </div>
      )}

      {/* Quick Action */}
      <a
        href="/rebalance"
        className="mt-6 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-navy dark:bg-brand-teal text-white dark:text-brand-navy text-sm font-semibold hover:bg-stellar-700 dark:hover:bg-stellar-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Start Rebalancing
      </a>
    </div>
  );
};

export default DriftAnalysis;