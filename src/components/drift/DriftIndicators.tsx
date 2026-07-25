import React from 'react';
import { DriftSeverity, SEVERITY_COLORS, SEVERITY_LABELS } from '@/types/drift';

interface DriftIndicatorsProps {
  driftPercent: number;
  severity?: DriftSeverity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const DriftIndicators: React.FC<DriftIndicatorsProps> = ({ 
  driftPercent, 
  severity, 
  size = 'md',
  showLabel = true
}) => {
  // Calculate severity if not provided
  const calculatedSeverity = severity || getSeverityFromDrift(driftPercent);
  
  const colors = SEVERITY_COLORS[calculatedSeverity];
  const label = SEVERITY_LABELS[calculatedSeverity];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size]} ${colors.bg} ${colors.text} border ${colors.border}`}>
      <span className={`w-2 h-2 rounded-full ${
        calculatedSeverity === 'critical' ? 'bg-red-500 animate-pulse' :
        calculatedSeverity === 'high' ? 'bg-orange-500' :
        calculatedSeverity === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`}></span>
      {showLabel && (
        <>
          {label} ({driftPercent.toFixed(1)}%)
        </>
      )}
    </span>
  );
};

// Helper function to determine severity from drift percentage
export function getSeverityFromDrift(driftPercent: number): DriftSeverity {
  if (driftPercent >= 10) return 'critical';
  if (driftPercent >= 7) return 'high';
  if (driftPercent >= 5) return 'medium';
  return 'low';
}

export default DriftIndicators;