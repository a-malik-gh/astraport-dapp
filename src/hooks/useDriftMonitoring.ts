import { useState, useEffect, useCallback } from 'react';
import { 
  PortfolioDriftMetrics, 
  DriftAlert, 
  DriftThresholdConfig,
  DEFAULT_DRIFT_THRESHOLDS,
  AssetDrift,
  getSeverityFromDrift
} from '@/types/drift';
import { computeAllocations } from '@/utils/rebalancing';
import { usePortfolioData } from './usePortfolio';
import { createDriftSocket } from '@/services/driftMonitoring';
import { useWalletStore } from '@/store';

/**
 * Hook for managing portfolio drift monitoring, real-time updates,
 * alert generation, and threshold configuration.
 */
export const useDriftMonitoring = () => {
  const publicKey = useWalletStore((s: any) => s.account?.publicKey ?? null);
  const { portfolio } = usePortfolioData(publicKey);
  
  const [driftMetrics, setDriftMetrics] = useState<PortfolioDriftMetrics | null>(null);
  const [alerts, setAlerts] = useState<DriftAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [thresholds, setThresholds] = useState<DriftThresholdConfig>({
    globalWarning: DEFAULT_DRIFT_THRESHOLDS.warning,
    globalCritical: DEFAULT_DRIFT_THRESHOLDS.critical,
    assetOverrides: {}
  });

  // Calculate drift metrics from portfolio data
  const calculateDriftMetrics = useCallback(() => {
    if (!portfolio) return null;

    // Get target allocations (in a real app, these would come from user settings)
    const targetAllocations = portfolio.assets.map((asset: any) => ({
      code: asset.code,
      targetPercent: 100 / portfolio.assets.length // Equal weight strategy as default
    }));

    const { allocations } = computeAllocations(portfolio, targetAllocations);
    
    // Calculate asset drifts with history
    const assetDrifts: AssetDrift[] = allocations.map((alloc: any) => {
      const driftPercent = Math.abs(alloc.deltaPercent);
      const now = new Date().toISOString();
      
      // Generate some historical data for charting
      const history = generateHistoricalDrift(alloc.code, driftPercent);
      
      return {
        code: alloc.code,
        currentPercent: alloc.currentPercent,
        targetPercent: alloc.targetPercent,
        driftPercent,
        severity: getSeverityFromDrift(driftPercent),
        lastUpdated: now,
        history
      };
    });

    // Calculate overall portfolio drift
    const overallDrift = assetDrifts.reduce((sum, a) => sum + a.driftPercent, 0) / assetDrifts.length;
    
    // Count alerts
    const criticalAlerts = assetDrifts.filter((a: any) => a.severity === 'critical').length;
    const totalAlerts = assetDrifts.filter((a: any) => a.severity !== 'low').length;

    const metrics: PortfolioDriftMetrics = {
      overallDrift,
      assetDrifts,
      totalAlerts,
      criticalAlerts,
      lastCalculated: new Date().toISOString()
    };

    return metrics;
  }, [portfolio]);

  // Generate mock historical data for demonstration
  const generateHistoricalDrift = (_: string, currentDrift: number): any[] => {
    const history = [];
    const now = Date.now();
    // Generate 24 hours of data points
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();
      // Create some realistic drift variation
      const variation = (Math.random() - 0.5) * 2;
      const drift = Math.max(0, currentDrift + variation * (24 - i) / 24);
      
      history.push({
        timestamp,
        driftPercent: parseFloat(drift.toFixed(2)),
        value: 0 // Would contain actual portfolio value at that time
      });
    }
    return history;
  };

  // Generate alerts based on current drift metrics
  const generateAlerts = useCallback((metrics: PortfolioDriftMetrics): DriftAlert[] => {
    const newAlerts: DriftAlert[] = [];
    
    metrics.assetDrifts.forEach(asset => {
      // Get thresholds for this asset (use global if no override)
      const assetThresholds = thresholds.assetOverrides[asset.code] || {};
      const warningThreshold = assetThresholds.warning ?? thresholds.globalWarning;
      const criticalThreshold = assetThresholds.critical ?? thresholds.globalCritical;
      
      // Check if we need to create a new alert
      if (asset.driftPercent >= warningThreshold) {
        const existingAlert = alerts.find(a => a.assetCode === asset.code && a.status === 'active');
        
        if (!existingAlert) {
          const isCritical = asset.driftPercent >= criticalThreshold;
          const alert: DriftAlert = {
            id: `${asset.code}-${Date.now()}`,
            assetCode: asset.code,
            driftPercent: asset.driftPercent,
            severity: isCritical ? 'critical' : 'high',
            message: `${asset.code} has drifted ${asset.driftPercent.toFixed(1)}% from its target allocation of ${asset.targetPercent}%. Current allocation is ${asset.currentPercent.toFixed(1)}%.`,
            timestamp: new Date().toISOString(),
            status: 'active',
            recommendations: [
              isCritical ? 'Immediate rebalancing required' : 'Consider rebalancing soon',
              `Need to ${asset.currentPercent > asset.targetPercent ? 'reduce' : 'increase'} position to restore target allocation`
            ]
          };
          newAlerts.push(alert);
        }
      }
    });

    return [...alerts.filter(a => a.status !== 'active'), ...newAlerts];
  }, [thresholds, alerts]);

  // Update metrics and alerts when portfolio changes
  useEffect(() => {
    if (portfolio) {
      const newMetrics = calculateDriftMetrics();
      if (newMetrics) {
        setDriftMetrics(newMetrics);
        const newAlerts = generateAlerts(newMetrics);
        setAlerts(newAlerts);
      }
    }
  }, [portfolio, calculateDriftMetrics, generateAlerts]);

  // Set up WebSocket for real-time updates
  useEffect(() => {
    if (!publicKey) {
      setIsConnected(false);
      return;
    }

    const dispose = createDriftSocket(
      publicKey,
      () => {
        // Handle real-time drift updates from the server
        if (driftMetrics) {
          // Update metrics with new data
          const updatedMetrics = { ...driftMetrics };
          // In a real implementation, this would merge the update properly
          setDriftMetrics(updatedMetrics);
          
          // Check for new alerts
          const newAlerts = generateAlerts(updatedMetrics);
          setAlerts(newAlerts);
        }
      },
      (connected) => setIsConnected(connected)
    );

    return () => {
      setIsConnected(false);
      dispose();
    };
  }, [publicKey, driftMetrics, generateAlerts]);

  // Update thresholds configuration
  const updateThresholds = useCallback((newThresholds: DriftThresholdConfig) => {
    setThresholds(newThresholds);
  }, []);

  // Acknowledge an alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
    ));
  }, []);

  // Trigger rebalance from an alert
  const triggerRebalance = useCallback(async (alertId: string) => {
    // In a real implementation, this would navigate to the rebalance page
    // with pre-populated data based on the alert's asset requirements
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      // Mark alert as resolved once rebalance is initiated
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, status: 'resolved' as const } : a
      ));
      // Navigate to rebalance page
      window.location.href = '/rebalance';
    }
  }, [alerts]);

  return {
    driftMetrics,
    alerts,
    thresholds,
    isConnected,
    updateThresholds,
    acknowledgeAlert,
    triggerRebalance
  };
};

// Also export as default for convenience
export default useDriftMonitoring;