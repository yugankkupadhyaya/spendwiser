import { AuditFinding, AlternativeSuggestion } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';
import { getPlanEntry, PLAN_CATALOG, TIER_RANK } from '../config/plan-catalog';
import { getTeamScale, TEAM_SCALE_RANK } from '../../utils/get-team-size';

type DowngradePath = {
  fromPlanId: string;
  toPlanId: string;
  label: string;
};

const DOWNGRADE_PATHS: DowngradePath[] = [
  { fromPlanId: 'chatgpt-enterprise', toPlanId: 'chatgpt-team', label: 'ChatGPT Team' },
  { fromPlanId: 'chatgpt-enterprise', toPlanId: 'chatgpt-pro', label: 'ChatGPT Pro' },
  { fromPlanId: 'chatgpt-team', toPlanId: 'chatgpt-pro', label: 'ChatGPT Pro' },
  { fromPlanId: 'chatgpt-pro', toPlanId: 'chatgpt-free', label: 'ChatGPT Free' },
  { fromPlanId: 'jira-enterprise', toPlanId: 'jira-standard', label: 'Jira Standard' },
  { fromPlanId: 'jira-enterprise', toPlanId: 'jira-free', label: 'Jira Free' },
  { fromPlanId: 'cursor-business', toPlanId: 'cursor-pro', label: 'Cursor Pro' },
  { fromPlanId: 'figma-enterprise', toPlanId: 'figma-pro', label: 'Figma Pro' },
  { fromPlanId: 'slack-business', toPlanId: 'slack-pro', label: 'Slack Pro' },
  { fromPlanId: 'docker-business', toPlanId: 'docker-pro', label: 'Docker Pro' },
  { fromPlanId: 'notion-enterprise', toPlanId: 'notion-team', label: 'Notion Team' },
];

export const generatePlanRecommendation = (
  data: AuditFormValues,
  _findings: AuditFinding[]
): AuditFinding[] => {
  void _findings;
  const findings: AuditFinding[] = [];
  const teamScale = getTeamScale(data.teamSize);
  const teamScaleRank = TEAM_SCALE_RANK[teamScale];

  for (const tool of data.tools) {
    const currentPlan = getPlanEntry(tool.toolId, tool.planName);
    if (!currentPlan) {
      continue;
    }

    const planTierRank = TIER_RANK[currentPlan.tier];
    const scaleDiff = planTierRank - teamScaleRank;

    if (scaleDiff <= 0) {
      continue;
    }

    const alternatives: AlternativeSuggestion[] = [];

    const applicablePaths = DOWNGRADE_PATHS.filter(
      (p) => p.fromPlanId === currentPlan.id
    );

    for (const path of applicablePaths) {
      const targetPlan = PLAN_CATALOG[path.toPlanId];
      if (!targetPlan) {
        continue;
      }

      const targetTierRank = TIER_RANK[targetPlan.tier];
      const targetScaleDiff = targetTierRank - teamScaleRank;

      if (targetScaleDiff > 1) {
        continue;
      }

      const monthlyFlatCost =
        targetPlan.perSeatCost != null
          ? targetPlan.perSeatCost * data.teamSize
          : targetPlan.monthlyFlatCost ?? 0;

      alternatives.push({
        toolId: tool.toolId,
        name: path.label,
        planName: targetPlan.id,
        estimatedMonthlyCost: monthlyFlatCost,
        estimatedSavings: Math.max(0, tool.monthlySpend - monthlyFlatCost),
        rationale: `Better aligned with ${teamScale}-scale operations while retaining core functionality`,
      });
    }

    if (alternatives.length > 0) {
      const bestAlternative = alternatives[0];

      findings.push({
        type: 'OVERPROVISIONED_PLAN',
        severity: scaleDiff >= 3 ? 'high' : scaleDiff >= 2 ? 'medium' : 'low',
        action: 'downgrade',
        category: 'cost',
        title: `Downgrade ${currentPlan.name} to ${bestAlternative.name}`,
        description: `${currentPlan.name} is designed for ${currentPlan.recommendedTeamSize} teams, but your team is at ${teamScale} scale. Downgrading could save approximately $${bestAlternative.estimatedSavings}/mo.`,
        recommendation: `Switch from ${currentPlan.name} to ${bestAlternative.name} to better match your team scale and reduce overhead spend.`,
        estimatedSavings: bestAlternative.estimatedSavings,
        priorityScore: 0,
        priorityLabel: 'long-term',
        alternatives,
        relatedToolIds: [tool.toolId],
      });
    }
  }

  return findings;
};
