import { AuditFinding, OptimizationSummary } from '../../types/audit-engine.types';
import { getTeamScale } from '../utils/get-team-size';
import { AuditFormValues } from '../../types/audit.types';

export function generateOptimizationSummary(
  findings: AuditFinding[],
  data: AuditFormValues
): OptimizationSummary {
  const totalEstimatedYearlySavings = findings.reduce(
    (sum, f) => sum + f.estimatedSavings * 12,
    0
  );
  const criticalCount = findings.filter((f) => f.priorityLabel === 'critical').length;
  const quickWinCount = findings.filter((f) => f.priorityLabel === 'quick-win').length;
  const longTermCount = findings.filter((f) => f.priorityLabel === 'long-term').length;
  const consolidationOpportunities = findings.filter(
    (f) => f.action === 'consolidate' || f.action === 'remove'
  ).length;
  const stackSimplificationCount = findings.filter(
    (f) => f.action === 'simplify' || f.action === 'consolidate'
  ).length;

  const teamScale = getTeamScale(data.teamSize);
  const toolCount = data.tools.length;

  const overprovisionedCount = findings.filter(
    (f) => f.type === 'OVERPROVISIONED_PLAN'
  ).length;
  const overlapCount = findings.filter((f) => f.type === 'DUPLICATE_TOOLING').length;
  const mismatchCount = findings.filter((f) => f.type === 'TOOL_MISMATCH').length;
  const unusedSeatsCount = findings.filter((f) => f.type === 'UNUSED_SEATS').length;

  let summary = '';

  if (findings.length === 0) {
    summary =
      'Your stack is efficiently configured for your team scale. No optimization opportunities detected.';
  } else {
    const parts: string[] = [];

    if (overprovisionedCount > 0) {
      parts.push(
        `Your stack has ${overprovisionedCount} overprovisioned plan(s) for a ${teamScale}-scale team`
      );
    }
    if (overlapCount > 0) {
      parts.push(
        `${overlapCount} tool overlap area(s) detected that could be consolidated`
      );
    }
    if (mismatchCount > 0) {
      parts.push(
        `${mismatchCount} tool(s) may not align with your primary workflow`
      );
    }
    if (unusedSeatsCount > 0) {
      parts.push(`${unusedSeatsCount} tool(s) have unused seats`);
    }

    if (parts.length > 0) {
      const joined = parts.join(', ');
      summary = `Your stack is overprovisioned for a ${teamScale}-scale ${toolCount > 5 ? 'organization' : 'engineering team'}. ${joined}. Consolidating and downgrading could reduce operational spend by ~${Math.min(100, Math.round((criticalCount + quickWinCount) / Math.max(1, findings.length) * 100))}%.`;
    } else {
      summary = `Minor optimizations identified for your ${teamScale}-scale stack. Review findings for details.`;
    }
  }

  return {
    summary,
    totalEstimatedYearlySavings,
    criticalCount,
    quickWinCount,
    longTermCount,
    consolidationOpportunities,
    stackSimplificationCount,
  };
}
