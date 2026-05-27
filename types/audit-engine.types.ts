export type AuditFinding = {
  type:
    | 'UNUSED_SEATS'
    | 'OVERPROVISIONED_PLAN'
    | 'TOOL_MISMATCH'
    | 'DUPLICATE_TOOLING'
    | 'PLAN_MISMATCH';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
  estimatedSavings: number;
};
