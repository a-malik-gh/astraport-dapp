import React from 'react';
import DriftIndicators from './DriftIndicators';
import { PortfolioDriftMetrics } from '@/types/drift';

interface DriftMetricsProps {
  metrics: PortfolioDriftMetrics;
}

const DriftMetrics: React.FC<DriftMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Portfolio Drift Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
          Overall Portfolio Drift
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {metrics.overallDrift.toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
          Last calculated: {new Date(metrics.lastCalculated).toLocaleTimeString()}
        </p>
      </div>

      {/* Total Alerts Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
          Active Alerts
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {metrics.totalAlerts}
          </span>
        </div>
        <p className="text-xs text-red-500 dark:text-red-400 mt-2">
          {metrics.criticalAlerts} critical alerts require attention
        </p>
      </div>

      {/* Assets with Drift Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
          Assets with Drift
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {metrics.assetDrifts.filter(a => a.driftPercent > 0).length}/{metrics.assetDrifts.length}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
          Assets exceeding target allocations
        </p>
      </div>

      {/* Largest Drift Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
          Largest Drift
        </h3>
        {metrics.assetDrifts.length > 0 ? (
          <>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.max(...metrics.assetDrifts.map(a => a.driftPercent)).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 mb-1">
                ({metrics.assetDrifts.reduce((max, a) => a.driftPercent > max.driftPercent ? a : max).code})
              </span>
            </div>
            <DriftIndicators 
              driftPercent={Math.max(...metrics.assetDrifts.map(a => a.driftPercent))}
              size="sm"
            />
          </>
        ) : (
          <span className="text-3xl font-bold text-gray-900 dark:text-white">0%</span>
        )}
      </div>

      {/* Asset-specific drift cards */}
      {metrics.assetDrifts.map((asset) => (
        <div key={asset.code} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{asset.code}</h3>
            <DriftIndicators driftPercent={asset.driftPercent} severity={asset.severity} />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-slate-400">Current</span>
              <span className="font-medium text-gray-900 dark:text-white">{asset.currentPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-slate-400">Target</span>
              <span className="font-medium text-gray-900 dark:text-white">{asset.targetPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((asset.currentPercent / 100) * 100, 100)}%`,
                  backgroundColor: asset.driftPercent > 5 ? '#ef4444' : asset.driftPercent > 2 ? '#f59e0b' : '#10b981'
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Drift</span>
              <span className={`text-sm font-bold ${
                asset.driftPercent > 10 ? 'text-red-600 dark:text-red-400' : 
                asset.driftPercent > 5 ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-green-600 dark:text-green-400'
              }`}>
                {asset.driftPercent > 0 ? '+' : ''}{asset.driftPercent.toFixed(1)}pp
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriftMetrics;