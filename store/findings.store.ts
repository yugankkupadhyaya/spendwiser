import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuditFinding } from '../types/audit-engine.types';

type FindingsStore = {
  auditFindings: AuditFinding[];

  setAuditFindings: (findings: AuditFinding[]) => void;
};

export const useFindingsStore = create<FindingsStore>()(
  persist(
    (set) => ({
      auditFindings: [],

      setAuditFindings: (findings) =>
        set({
          auditFindings: findings,
        }),
    }),

    {
      name: 'audit-findings-store',
    }
  )
);
