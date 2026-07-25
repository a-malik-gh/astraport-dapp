import React, { useState } from 'react';
import Modal from '../ai/Modal';
import type { DriftThresholdConfig } from '@/types/drift';

interface DriftThresholdConfigModalProps {
  open: boolean;
  currentThresholds: DriftThresholdConfig;
  onClose: () => void;
  onSave: (thresholds: DriftThresholdConfig) => void;
}

const DriftThresholdConfigModal: React.FC<DriftThresholdConfigModalProps> = ({
  open,
  currentThresholds,
  onClose,
  onSave
}) => {
  const [thresholds, setThresholds] = useState<DriftThresholdConfig>(currentThresholds);

  const handleGlobalWarningChange = (value: string) => {
    setThresholds(prev => ({
      ...prev,
      globalWarning: parseFloat(value) || 0
    }));
  };

  const handleGlobalCriticalChange = (value: string) => {
    setThresholds(prev => ({
      ...prev,
      globalCritical: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    // Validate that critical > warning
    if (thresholds.globalCritical <= thresholds.globalWarning) {
      alert('Critical threshold must be higher than warning threshold');
      return;
    }
    onSave(thresholds);
  };

  const handleReset = () => {
    setThresholds({
      globalWarning: 5,
      globalCritical: 10,
      assetOverrides: {}
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Configure Drift Thresholds" titleId="drift-thresholds-modal-title">
      <div className="space-y-6 p-1">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Set thresholds that trigger alerts when your portfolio allocation drifts beyond acceptable limits.
          Global thresholds apply to all assets unless overridden below.
        </p>

        {/* Global Thresholds */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Global Thresholds</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Warning Threshold (%)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={thresholds.globalWarning}
                onChange={(e) => handleGlobalWarningChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                Trigger warning when drift exceeds this value
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Critical Threshold (%)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={thresholds.globalCritical}
                onChange={(e) => handleGlobalCriticalChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                Trigger critical alert when drift exceeds this value
              </p>
            </div>
          </div>
        </div>

        {/* Current Threshold Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Current Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-slate-400">Global Warning:</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{thresholds.globalWarning}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-slate-400">Global Critical:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{thresholds.globalCritical}%</span>
            </div>
            {Object.keys(thresholds.assetOverrides).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-slate-400 mb-2">Asset Overrides:</p>
                {Object.entries(thresholds.assetOverrides).map(([asset, overrides]) => (
                  <div key={asset} className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-slate-500">{asset}:</span>
                    <span className="text-gray-900 dark:text-white">
                      {overrides?.warning && `Warn: ${overrides.warning}%`}
                      {overrides?.critical && overrides?.warning && ' | '}
                      {overrides?.critical && `Critical: ${overrides.critical}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-navy dark:bg-brand-teal text-white dark:text-brand-navy font-semibold hover:bg-stellar-700 dark:hover:bg-stellar-400 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DriftThresholdConfigModal;