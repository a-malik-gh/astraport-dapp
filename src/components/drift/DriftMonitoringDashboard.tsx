import React, { useState } from 'react';
import DriftMetrics from './DriftMetrics';
import DriftThresholdConfigModal from './DriftThresholdConfig';
import DriftHistoryChart from './DriftHistoryChart';
import DriftAlertNotification from './DriftAlertNotification';
import DriftAnalysis from './DriftAnalysis';
import { useDriftMonitoring } from '@/hooks/useDriftMonitoring';
import { useWalletStore } from '@/store';
import { DriftAlert, DriftThresholdConfig as ThresholdConfig } from '@/types/drift';

const DriftMonitoringDashboard: React.FC = () => {
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  useWalletStore();
  const { 
    driftMetrics, 
    alerts, 
    thresholds, 
    updateThresholds,
    acknowledgeAlert,
    triggerRebalance,
    isConnected 
  } = useDriftMonitoring();

  // Handle one-click rebalance from alerts
  const handleOneClickRebalance = async (alertId: string) => {
    await triggerRebalance(alertId);
  };

  // Handle threshold configuration updates
  const handleThresholdUpdate = (newThresholds: ThresholdConfig) => {
    updateThresholds(newThresholds);
    setShowThresholdModal(false);
  };

  // Filter active alerts
  const activeAlerts = (alerts as DriftAlert[]).filter((alert: DriftAlert) => alert.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-brand-teal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </a>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Drift Monitoring</h1>
            <p className="mt-1 text-gray-600 dark:text-slate-400">
              Monitor your portfolio allocation deviations and get alerts when thresholds are exceeded.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            {isConnected && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            )}
            <button
              onClick={() => setShowThresholdModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-navy dark:bg-brand-teal text-white dark:text-brand-navy text-sm font-semibold hover:bg-stellar-700 dark:hover:bg-stellar-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure Thresholds
            </button>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-8 space-y-3">
          {activeAlerts.map((alert: DriftAlert) => (
            <DriftAlertNotification
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
              onRebalance={() => handleOneClickRebalance(alert.id)}
            />
          ))}
        </div>
      )}

      {/* Drift Metrics Cards */}
      {driftMetrics && <DriftMetrics metrics={driftMetrics} />}

      {/* Charts and Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <DriftHistoryChart assetDrifts={driftMetrics?.assetDrifts || []} />
        </div>
        <div>
          {driftMetrics && <DriftAnalysis metrics={driftMetrics} />}
        </div>
      </div>

      {/* Threshold Configuration Modal */}
      <DriftThresholdConfigModal
        open={showThresholdModal}
        currentThresholds={thresholds}
        onClose={() => setShowThresholdModal(false)}
        onSave={handleThresholdUpdate}
      />
    </div>
  );
};

export default DriftMonitoringDashboard;