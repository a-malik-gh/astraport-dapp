export type AuditEventType =
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'trade_executed'
  | 'rebalance_triggered'
  | 'risk_alert'
  | 'ai_recommendation_applied'
  | 'settings_changed'
  | 'export_generated';

export type AuditEventResult = 'success' | 'failure' | 'pending';

export interface AuditEvent {
  id: string;
  timestamp: number; // epoch ms, consistente con AIInsight.timestamp
  eventType: AuditEventType;
  action: string; // descripción legible, ej. "Swapped XLM for USDC"
  result: AuditEventResult;
  actor?: string; // publicKey o 'system'
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}