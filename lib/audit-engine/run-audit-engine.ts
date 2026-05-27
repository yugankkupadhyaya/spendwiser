import { AuditFormValues } from '../../types/audit.types';

import { detectPlanMismatch } from './rules/detect-plan-mismatch';
import { detectToolMismatch } from './rules/detect-tool-mismatch';
import { detectUnusedSeats } from './rules/detect-unused-seats.rule';

import { AuditFinding } from '../../types/audit-engine.types';

export const runAuditEngine = (data: AuditFormValues): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  const unusedSeatFindings = detectUnusedSeats(data);

  const toolMismatchFindings = detectToolMismatch(data);

  const planMismatchFindings = detectPlanMismatch(data);

  findings.push(...unusedSeatFindings, ...toolMismatchFindings, ...planMismatchFindings);

  return findings;
};
