/**
 * Analysis utilities for portfolio drift detection and recommendations.
 */

import { PortfolioDriftMetrics, DriftAnalysis } from '@/types/drift';

/**
 * Analyzes portfolio drift metrics and generates comprehensive analysis
 * with root causes, recommendations, and urgency assessment.
 */
export function analyzeDrift(metrics: PortfolioDriftMetrics): DriftAnalysis {
  const criticalAssets = metrics.assetDrifts.filter(a => a.severity === 'critical');
  const highAssets = metrics.assetDrifts.filter(a => a.severity === 'high');
  
  // Determine rebalance urgency
  const rebalanceUrgency = criticalAssets.length > 0 ? 'high' : 
                           highAssets.length > 1 ? 'medium' : 'low';

  // Generate summary
  const summary = generateSummary(metrics, criticalAssets, highAssets);
  
  // Identify potential root causes
  const rootCauses = identifyRootCauses(metrics);
  
  // Generate recommendations
  const recommendations = generateRecommendations(metrics, rebalanceUrgency);
  
  // Calculate estimated savings
  const estimatedSavings = calculateEstimatedSavings(metrics);

  return {
    summary,
    rootCauses,
    recommendations,
    rebalanceUrgency,
    estimatedSavings
  };
}

function generateSummary(
  metrics: PortfolioDriftMetrics, 
  criticalAssets: any[], 
  highAssets: any[]
): string {
  if (criticalAssets.length === 0 && highAssets.length === 0) {
    return 'Your portfolio is well-balanced with minimal drift from target allocations. Continue monitoring to maintain optimal allocation.';
  }

  const assetText = criticalAssets.length > 0 
    ? `${criticalAssets.length} asset(s) with critical drift and ${highAssets.length} with high drift`
    : `${highAssets.length} asset(s) with significant drift`;

  return `Your portfolio has an overall drift of ${metrics.overallDrift.toFixed(1)}%. ${assetText}. Immediate attention is recommended to restore target allocations.`;
}

function identifyRootCauses(metrics: PortfolioDriftMetrics): string[] {
  const rootCauses: string[] = [];
  const significantDrifts = metrics.assetDrifts.filter(a => a.driftPercent > 5);
  
  // Check for asymmetric price movements
  const assetsWithLargeGains = significantDrifts.filter(a => a.currentPercent > a.targetPercent);
  const assetsWithLargeDeclines = significantDrifts.filter(a => a.currentPercent < a.targetPercent);
  
  if (assetsWithLargeGains.length > 0) {
    rootCauses.push(`${assetsWithLargeGains.map(a => a.code).join(', ')} has outperformed other assets, increasing its portfolio weight beyond targets`);
  }
  
  if (assetsWithLargeDeclines.length > 0) {
    rootCauses.push(`${assetsWithLargeDeclines.map(a => a.code).join(', ')} has underperformed, reducing its portfolio weight below targets`);
  }
  
  // Check for recent transactions that weren't followed by rebalancing
  if (metrics.assetDrifts.some(a => {
    const recent = new Date(a.lastUpdated);
    const hoursAgo = (Date.now() - recent.getTime()) / (1000 * 60 * 60);
    return hoursAgo < 24 && a.driftPercent > 5;
  })) {
    rootCauses.push('Recent transactions may have disrupted your target allocation');
  }
  
  // Market volatility factor
  if (metrics.overallDrift > 15) {
    rootCauses.push('High market volatility has caused significant shifts in portfolio values');
  }

  return rootCauses;
}

function generateRecommendations(
  metrics: PortfolioDriftMetrics, 
  urgency: 'low' | 'medium' | 'high'
): string[] {
  const recommendations: string[] = [];
  
  if (urgency === 'high') {
    recommendations.push('Execute an immediate rebalance to correct critical allocation deviations');
    recommendations.push('Review your drift thresholds to ensure they align with your risk tolerance');
    recommendations.push('Consider setting up automatic rebalancing to prevent future severe drift');
  } else if (urgency === 'medium') {
    recommendations.push('Plan a rebalance within the next 7 days to address drift');
    recommendations.push('Review which assets need adjustment and calculate transaction costs');
    recommendations.push('Monitor volatile assets closely for further deviations');
  } else {
    recommendations.push('Maintain current allocations, drift is within acceptable limits');
    recommendations.push('Continue periodic monitoring to catch drift early');
    recommendations.push('Consider reviewing your target allocations during your next portfolio check-in');
  }
  
  // Add specific recommendations based on drift patterns
  const overWeighted = metrics.assetDrifts.filter(a => a.currentPercent > a.targetPercent && a.driftPercent > 3);
  const underWeighted = metrics.assetDrifts.filter(a => a.currentPercent < a.targetPercent && a.driftPercent > 3);
  
  if (overWeighted.length > 0) {
    recommendations.push(`Consider reducing exposure to ${overWeighted.map(a => a.code).join(', ')} which is now overweight`);
  }
  
  if (underWeighted.length > 0) {
    recommendations.push(`Increase allocation to ${underWeighted.map(a => a.code).join(', ')} which is currently underweight`);
  }

  return recommendations;
}

function calculateEstimatedSavings(_metrics: PortfolioDriftMetrics): number {
  // Simplified calculation of potential value recovery after rebalancing
  // This would be more sophisticated in a production environment
  return 0;
}