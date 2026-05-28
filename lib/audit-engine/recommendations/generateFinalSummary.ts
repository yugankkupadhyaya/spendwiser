import { AuditFinding, OptimizationSummary } from '../../../types/audit-engine.types';
import { getTeamScale } from '../../utils/get-team-size';
import { AuditFormValues } from '../../../types/audit.types';

export function generateFinalSummary(
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
  const monthlySpendTotal = data.tools.reduce((sum, t) => sum + t.monthlySpend, 0);

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
    const organizationLabel = toolCount > 8 ? 'organization' : 'engineering team';
    const yearlySpend = monthlySpendTotal * 12;
    const savingsPercent =
      yearlySpend > 0
        ? Math.min(60, Math.max(10, Math.round((totalEstimatedYearlySavings / yearlySpend) * 100)))
        : 0;

    const reasonParts: string[] = [];
    if (overprovisionedCount > 0) {
      reasonParts.push(`downgrading ${overprovisionedCount} overprovisioned plan(s)`);
    }
    if (overlapCount > 0) {
      reasonParts.push(`consolidating ${overlapCount} overlapping tool area(s)`);
    }
    if (mismatchCount > 0) {
      reasonParts.push(`replacing ${mismatchCount} misaligned tool(s)`);
    }
    if (unusedSeatsCount > 0) {
      reasonParts.push(`rightsizing ${unusedSeatsCount} seat allocation(s)`);
    }

    if (reasonParts.length > 0) {
      const lastPart = reasonParts.pop();
      const joined =
        reasonParts.length > 0
          ? `${reasonParts.join(', ')}, and ${lastPart}`
          : lastPart!;

      if (savingsPercent >= 30) {
        summary = `Your stack appears overprovisioned for a ${teamScale}-scale ${organizationLabel}. ${joined} could reduce spend by approximately ${savingsPercent}%.`;
      } else if (savingsPercent >= 10) {
        summary = `Your ${teamScale}-scale ${organizationLabel} has optimization opportunities. ${joined} could reduce operational spend by ~${savingsPercent}%.`;
      } else {
        summary = `Minor optimizations identified for your ${teamScale}-scale stack. ${joined} for modest savings potential.`;
      }
    } else {
      summary = `Your ${teamScale}-scale stack has ${findings.length} finding(s) to review. Prioritize critical and quick-win items for maximum impact.`;
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
