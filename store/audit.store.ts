import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuditFormValues } from '../types/audit.types';

type AuditStore = {
  auditData: AuditFormValues | null;

  setAuditData: (data: AuditFormValues) => void;

  clearAuditData: () => void;
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      auditData: null,

      setAuditData: (data) =>
        set({
          auditData: data,
        }),

      clearAuditData: () =>
        set({
          auditData: null,
        }),
    }),

    {
      name: 'spendwise-audit-storage',
    }
  )
);
