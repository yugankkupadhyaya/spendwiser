import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuditFinding, OptimizationSummary } from '../types/audit-engine.types';

type FindingsStore = {
  auditFindings: AuditFinding[];
  auditSummary: OptimizationSummary | null;

  setAuditFindings: (findings: AuditFinding[]) => void;
  setAuditSummary: (summary: OptimizationSummary) => void;
};

export const useFindingsStore = create<FindingsStore>()(
  persist(
    (set) => ({
      auditFindings: [],
      auditSummary: null,

      setAuditFindings: (findings) =>
        set({
          auditFindings: findings,
        }),

      setAuditSummary: (summary) =>
        set({
          auditSummary: summary,
        }),
    }),

    {
      name: 'audit-findings-store',
    }
  )
);
