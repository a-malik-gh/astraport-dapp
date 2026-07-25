/**
 * Types for portfolio drift detection and monitoring system.
 */

export type DriftSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface DriftThresholds {
  warning: number;    // Threshold for warning alert (percentage)
  critical: number;   // Threshold for critical alert (percentage)
}

export interface AssetDrift {
  code: string;
  currentPercent: number;
  targetPercent: number;
  driftPercent: number;           // Absolute drift percentage
  severity: DriftSeverity;
  lastUpdated: string;            // ISO timestamp
  history: DriftHistoryPoint[];   // Historical drift data
}

export interface DriftHistoryPoint {
  timestamp: string;  // ISO timestamp
  driftPercent: number;
  value: number;      // Portfolio value at that time
}

export interface DriftAlert {
  id: string;
  assetCode: string;
  driftPercent: number;
  severity: DriftSeverity;
  message: string;
  timestamp: string;  // ISO timestamp
  status: AlertStatus;
  recommendations: string[];
}

export interface PortfolioDriftMetrics {
  overallDrift: number;           // Total portfolio drift
  assetDrifts: AssetDrift[];
  totalAlerts: number;
  criticalAlerts: number;
  lastCalculated: string;         // ISO timestamp
}

export interface DriftThresholdConfig {
  globalWarning: number;
  globalCritical: number;
  assetOverrides: Record<string, Partial<DriftThresholds>>;
}

export interface DriftAnalysis {
  summary: string;
  rootCauses: string[];
  recommendations: string[];
  rebalanceUrgency: 'low' | 'medium' | 'high';
  estimatedSavings: number;       // Estimated USD value if rebalanced now
}

/** Default drift thresholds (5% warning, 10% critical) */
export const DEFAULT_DRIFT_THRESHOLDS: DriftThresholds = {
  warning: 5,
  critical: 10,
};

/**
 * Gets the severity level from a drift percentage using default thresholds
 */
export function getSeverityFromDrift(driftPercent: number): DriftSeverity {
  if (driftPercent < 3) return 'low';
  if (driftPercent < 5) return 'medium';
  if (driftPercent < 10) return 'high';
  return 'critical';
}

export const SEVERITY_COLORS: Record<DriftSeverity, { bg: string; text: string; border: string }> = {
  low: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-400',
    border: 'border-green-300 dark:border-green-700',
  },
  medium: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-400',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  high: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-400',
    border: 'border-orange-300 dark:border-orange-700',
  },
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-400',
    border: 'border-red-300 dark:border-red-700',
  },
};

export const SEVERITY_LABELS: Record<DriftSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};