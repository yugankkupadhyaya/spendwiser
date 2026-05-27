import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';

import { TOOL_CATALOG } from '../config/tool-catalog';

export const detectToolMismatch = (
  data: AuditFormValues
): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  const primaryUseCase = data.primaryUseCase;

  for (const tool of data.tools) {
    const toolMetadata = TOOL_CATALOG[tool.toolId];

    // Skip if tool metadata does not exist
    if (!toolMetadata) {
      continue;
    }

    const isSupportedUseCase =
      toolMetadata.suitableUseCases.includes(primaryUseCase);

    // If tool does not align with team's main use case
    if (!isSupportedUseCase) {
      findings.push({
        type: 'TOOL_MISMATCH',

        severity: 'medium',

        title: `${toolMetadata.name} may not align with your workflow`,

        description: `${toolMetadata.name} is not commonly optimized for ${primaryUseCase} focused teams.`,

        recommendation:
          'Review whether this tool is actively contributing to your team workflows or if a better-aligned alternative exists.',

        estimatedSavings: tool.monthlySpend,
      });
    }
  }

  return findings;
};
