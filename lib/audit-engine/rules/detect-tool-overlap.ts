import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';

import { TOOL_CATALOG } from '../config/tool-catalog';

const OVERLAP_NAMES: Record<string, string> = {
  'ai-assistant': 'AI assistant',
  'ai-code-editor': 'AI code editor',
  'project-management': 'project management tool',
  'design-suite': 'design tool',
  communication: 'communication platform',
  'containerization': 'containerization tool',
  'container-orchestration': 'container orchestration platform',
  'cloud-provider': 'cloud provider',
  'deployment-platform': 'deployment platform',
  'cache-database': 'cache/database tool',
  'database': 'database tool',
  'orm': 'ORM tool',
  'ui-framework': 'UI framework',
  'animation-library': 'animation library',
};

export const detectToolOverlap = (data: AuditFormValues): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  const groups: Record<string, string[]> = {};

  for (const tool of data.tools) {
    const meta = TOOL_CATALOG[tool.toolId];
    if (!meta || !meta.overlapGroup) {
      continue;
    }

    if (!groups[meta.overlapGroup]) {
      groups[meta.overlapGroup] = [];
    }
    groups[meta.overlapGroup].push(meta.name);
  }

  for (const [group, toolNames] of Object.entries(groups)) {
    if (toolNames.length < 2) {
      continue;
    }

    const categoryLabel = OVERLAP_NAMES[group] ?? group;

    const totalSpend = data.tools
      .filter((t) => {
        const meta = TOOL_CATALOG[t.toolId];
        return meta && meta.overlapGroup === group;
      })
      .reduce((sum, t) => sum + t.monthlySpend, 0);

    const keepCandidate = toolNames[0];
    const removeCandidates = toolNames.slice(1);

    findings.push({
      type: 'DUPLICATE_TOOLING',
      severity: toolNames.length >= 3 ? 'high' : 'medium',
      action: 'consolidate',
      category: 'efficiency',
      title: `Multiple ${categoryLabel}s detected`,
      description: `Your stack includes ${toolNames.length} ${categoryLabel}s: ${toolNames.join(', ')}. These tools serve overlapping purposes and likely create redundant spend.`,
      recommendation: `Consolidate to a single ${categoryLabel}. Consider keeping ${keepCandidate} and removing ${removeCandidates.join(', ')} to simplify your stack.`,
      estimatedSavings: Math.round(totalSpend * 0.5),
      priorityScore: 0,
      priorityLabel: 'long-term',
      relatedToolIds: data.tools
        .filter((t) => {
          const meta = TOOL_CATALOG[t.toolId];
          return meta && meta.overlapGroup === group;
        })
        .map((t) => t.toolId),
    });
  }

  return findings;
};
