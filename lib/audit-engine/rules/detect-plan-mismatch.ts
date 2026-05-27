import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';

import { getTeamScale } from '../../utils/get-team-size';

import { PLAN_CATALOG } from '../config/plan-catalog';

export const detectPlanMismatch = (data: AuditFormValues): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  const teamScale = getTeamScale(data.teamSize);

  for (const tool of data.tools) {
    const planMetadata = PLAN_CATALOG[tool.planName.toLowerCase()];

    // Skip unknown plans
    if (!planMetadata) {
      continue;
    }

    const recommendedScale = planMetadata.recommendedTeamSize;

    const isMismatch = recommendedScale !== teamScale;

    if (isMismatch) {
      findings.push({
        type: 'PLAN_MISMATCH',

        severity: 'medium',

        title: `${planMetadata.name} may be overprovisioned`,

        description: `${planMetadata.name} is generally recommended for ${recommendedScale} teams, while your organization appears closer to ${teamScale} scale.`,

        recommendation:
          'Review whether the current pricing tier is necessary for your operational scale.',

        estimatedSavings: Math.round(tool.monthlySpend * 0.3),
      });
    }
  }

  return findings;
};
