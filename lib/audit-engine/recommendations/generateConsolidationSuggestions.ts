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

export const generateConsolidationSuggestions = (
  data: AuditFormValues,
  findings: AuditFinding[]
): AuditFinding[] => {
  const newFindings: AuditFinding[] = [];

  const existingOverlapTypes = new Set(
    findings
      .filter((f) => f.type === 'DUPLICATE_TOOLING')
      .map((f) => JSON.stringify(f.relatedToolIds?.sort()))
  );

  const groups: Record<string, string[]> = {};

  for (const tool of data.tools) {
    const meta = TOOL_CATALOG[tool.toolId];
    if (!meta || !meta.overlapGroup) {
      continue;
    }
    if (!groups[meta.overlapGroup]) {
      groups[meta.overlapGroup] = [];
    }
    groups[meta.overlapGroup].push(tool.toolId);
  }

  for (const [group, toolIds] of Object.entries(groups)) {
    if (toolIds.length < 2) {
      continue;
    }

    const existingKey = JSON.stringify([...toolIds].sort());
    if (existingOverlapTypes.has(existingKey)) {
      continue;
    }

    const rule = CONSOLIDATION_RULES[group];
    if (!rule) {
      continue;
    }

    const sortedByPreference = [...toolIds].sort(
      (a, b) => rule.keepPreference.indexOf(a) - rule.keepPreference.indexOf(b)
    );

    const keepTool = sortedByPreference[0];
    const removeTools = sortedByPreference.slice(1);

    if (!keepTool || removeTools.length === 0) {
      continue;
    }

    const keepMeta = TOOL_CATALOG[keepTool];
    const removeMetas = removeTools.map((id) => TOOL_CATALOG[id]).filter(Boolean);

    const totalRemoveSpend = data.tools
      .filter((t) => removeTools.includes(t.toolId))
      .reduce((sum, t) => sum + t.monthlySpend, 0);

    const rationales = removeMetas.map((r) =>
      rule.removeRationale(keepMeta?.name ?? keepTool, r?.name ?? '')
    );

    newFindings.push({
      type: 'DUPLICATE_TOOLING',
      severity: removeTools.length >= 2 ? 'high' : 'medium',
      action: 'consolidate',
      category: 'operations',
      title: `Simplify your ${rule.groupLabel} stack`,
      description: `You have ${toolIds.length} ${rule.groupLabel}s in use. Keeping ${keepMeta?.name ?? keepTool} and removing ${removeMetas.map((r) => r?.name).join(', ')} would streamline operations.`,
      recommendation: `Consolidate to ${keepMeta?.name ?? keepTool}. ${rationales.join('. ')}. This simplifies your toolchain and reduces cognitive overhead.`,
      estimatedSavings: Math.round(totalRemoveSpend * 0.8),
      priorityScore: 0,
      priorityLabel: 'long-term',
      relatedToolIds: [keepTool, ...removeTools],
    });
  }

  return newFindings;
};
