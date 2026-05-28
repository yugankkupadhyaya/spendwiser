import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';
import { TOOL_CATALOG } from '../config/tool-catalog';

type ConsolidationRule = {
  groupLabel: string;
  keepPreference: string[];
  removeRationale: (keep: string, remove: string) => string;
};

const CONSOLIDATION_RULES: Record<string, ConsolidationRule> = {
  'ai-assistant': {
    groupLabel: 'AI assistant',
    keepPreference: ['cursor', 'chatgpt', 'claude', 'gemini', 'copilot'],
    removeRationale: (keep, remove) =>
      `${keep} provides comparable AI capabilities, making ${remove} redundant`,
  },
  'project-management': {
    groupLabel: 'project management tool',
    keepPreference: ['linear', 'notion', 'jira'],
    removeRationale: (keep, remove) =>
      `${keep} covers the core project management needs, allowing you to drop ${remove}`,
  },
  'design-suite': {
    groupLabel: 'design tool',
    keepPreference: ['figma', 'tailwind', 'framer-motion'],
    removeRationale: (keep, remove) =>
      `${keep} handles the majority of design workflows, making ${remove} an unnecessary duplication`,
  },
  'ai-code-editor': {
    groupLabel: 'AI code editor',
    keepPreference: ['cursor', 'copilot'],
    removeRationale: (keep, remove) =>
      `${keep} offers a more comprehensive AI development experience than ${remove}`,
  },
};

export const enrichConsolidationSuggestions = (
  data: AuditFormValues,
  findings: AuditFinding[]
): AuditFinding[] => {
  return findings.map((finding) => {
    if (finding.type !== 'DUPLICATE_TOOLING') return finding;

    const relatedToolIds = finding.relatedToolIds ?? [];
    if (relatedToolIds.length < 2) return finding;

    const groupMeta = relatedToolIds
      .map((id) => TOOL_CATALOG[id])
      .find((meta) => meta?.overlapGroup);
    const overlapGroup = groupMeta?.overlapGroup;
    if (!overlapGroup) return finding;

    const rule = CONSOLIDATION_RULES[overlapGroup];
    if (!rule) return finding;

    const sortedByPreference = [...relatedToolIds].sort(
      (a, b) => rule.keepPreference.indexOf(a) - rule.keepPreference.indexOf(b)
    );

    const keepTool = sortedByPreference[0];
    const removeTools = sortedByPreference.slice(1);

    if (!keepTool || removeTools.length === 0) return finding;

    const removeMetas = removeTools.map((id) => TOOL_CATALOG[id]).filter(Boolean);

    const rationales = removeMetas.map((r) =>
      rule.removeRationale(TOOL_CATALOG[keepTool]?.name ?? keepTool, r?.name ?? '')
    );

    const totalRemoveSpend = data.tools
      .filter((t) => removeTools.includes(t.toolId))
      .reduce((sum, t) => sum + t.monthlySpend, 0);

    return {
      ...finding,
      title: `Simplify your ${rule.groupLabel} stack`,
      description: `You have ${relatedToolIds.length} ${rule.groupLabel}s in use. Keeping ${TOOL_CATALOG[keepTool]?.name ?? keepTool} and removing ${removeMetas.map((r) => r?.name).join(', ')} would streamline operations.`,
      recommendation: `Consolidate to ${TOOL_CATALOG[keepTool]?.name ?? keepTool}. ${rationales.join('. ')}. This simplifies your toolchain and reduces cognitive overhead.`,
      estimatedSavings: Math.round(totalRemoveSpend * 0.8),
    };
  });
};
