import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';

import { getTeamScale, TEAM_SCALE_RANK } from '../../utils/get-team-size';

import { getPlanEntry } from '../config/plan-catalog';

export const detectPlanMismatch = (data: AuditFormValues): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  const teamScale = getTeamScale(data.teamSize);
  const teamScaleRank = TEAM_SCALE_RANK[teamScale];

  for (const tool of data.tools) {
    const plan = getPlanEntry(tool.toolId, tool.planName);

    if (!plan) {
      continue;
    }

    const planTierRank = plan.tierRank;
    const scaleDiff = planTierRank - teamScaleRank;

    if (scaleDiff > 0) {
      const severity = scaleDiff >= 3 ? 'high' : scaleDiff >= 2 ? 'medium' : 'low';

      const directionLabel =
        plan.recommendedTeamSize === 'enterprise' ? 'enterprise-grade' : `${plan.recommendedTeamSize}-scale`;
      const teamLabel = teamScale === 'solo' ? 'a solo operation' : `a ${teamScale}-scale team`;

      findings.push({
        type: 'OVERPROVISIONED_PLAN',
        severity,
        action: 'downgrade',
        category: 'cost',
        title: `${plan.name} is overprovisioned for ${teamScale} team`,
        description: `${plan.name} is designed for ${directionLabel} teams, but your organization is ${teamLabel}. You are likely paying for features and capacity you do not need.`,
        recommendation: `Downgrade to a ${teamScale}-appropriate plan for ${plan.name}. Consider ${plan.toolId} Pro or Team tier to match your operational scale.`,
        estimatedSavings: Math.round(tool.monthlySpend * 0.4),
        priorityScore: 0,
        priorityLabel: 'long-term',
        relatedToolIds: [tool.toolId],
      });
    } else if (scaleDiff < 0 && teamScale === 'enterprise') {
      findings.push({
        type: 'PLAN_MISMATCH',
        severity: 'medium',
        action: 'optimize',
        category: 'operations',
        title: `${plan.name} may be underpowered for enterprise scale`,
        description: `Your organization is at enterprise scale but ${plan.name} is designed for ${plan.recommendedTeamSize} teams. You may be missing advanced features, controls, or support.`,
        recommendation: `Evaluate whether upgrading ${plan.name} to an enterprise plan provides needed security, admin, or compliance features.`,
        estimatedSavings: 0,
        priorityScore: 0,
        priorityLabel: 'long-term',
        relatedToolIds: [tool.toolId],
      });
    }
  }

  return findings;
};
