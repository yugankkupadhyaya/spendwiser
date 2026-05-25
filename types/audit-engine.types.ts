export type AuditFinding = {
  type: 'UNUSED_SEATS' | 'OVERPROVISIONED_PLAN' | 'DUPLICATE_TOOLING';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
  estimatedSavings: number;
};
