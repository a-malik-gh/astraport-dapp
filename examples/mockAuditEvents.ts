// src/examples/mockAuditEvents.ts
import type { AuditEvent } from '@/types';

export const mockAuditEvents: AuditEvent[] = Array.from({ length: 1200 }, (_, i) => {
  const types: AuditEvent['eventType'][] = [
    'wallet_connected', 'trade_executed', 'rebalance_triggered',
    'risk_alert', 'ai_recommendation_applied', 'settings_changed', 'export_generated',
  ];
  const results: AuditEvent['result'][] = ['success', 'failure', 'pending'];
  const eventType = types[i % types.length];
  return {
    id: `evt_${i}`,
    timestamp: Date.now() - i * 3_600_000, 
    eventType,
    action: `Sample action for ${eventType}`,
    result: results[i % results.length],
    actor: 'GABC...MOCK',
    before: eventType === 'settings_changed' ? { riskTolerance: 'medium' } : undefined,
    after: eventType === 'settings_changed' ? { riskTolerance: 'high' } : undefined,
  };
});