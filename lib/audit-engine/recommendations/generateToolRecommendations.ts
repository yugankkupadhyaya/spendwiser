import { AuditFinding, AlternativeSuggestion } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';
import { TOOL_CATALOG } from '../config/tool-catalog';

type ToolRecommendationRule = {
  condition: (toolId: string, data: AuditFormValues) => boolean;
  generate: (
    toolId: string,
    tool: AuditFormValues['tools'][number],
    data: AuditFormValues
  ) => AuditFinding | null;
};

const COMPLEXITY_UPGRADE_RULES: Record<string, { threshold: number; from: string; to: string }> = {
  kubernetes: { threshold: 5, from: 'kubernetes', to: 'docker' },
  aws: { threshold: 3, from: 'aws', to: 'vercel' },
  kafka: { threshold: 10, from: 'kafka', to: 'postgresql' },
};

const RULES: ToolRecommendationRule[] = [
  {
    condition: (toolId, data) => {
      const meta = TOOL_CATALOG[toolId];
      if (!meta) return false;
      return meta.complexity === 'enterprise' && data.teamSize < 20;
    },
    generate: (toolId, tool, data) => {
      const meta = TOOL_CATALOG[toolId];
      if (!meta) return null;

      const downgradeRule = COMPLEXITY_UPGRADE_RULES[toolId];
      const altMeta = downgradeRule ? TOOL_CATALOG[downgradeRule.to] : null;

      const alternatives: AlternativeSuggestion[] = altMeta
        ? [
            {
              toolId: altMeta.id,
              name: altMeta.name,
              planName: 'pro',
              estimatedMonthlyCost: Math.round(tool.monthlySpend * 0.3),
              estimatedSavings: Math.round(tool.monthlySpend * 0.7),
              rationale: `${altMeta.name} provides sufficient capabilities for a ${data.teamSize}-person team without enterprise complexity overhead`,
            },
          ]
        : [];

      return {
        type: 'TOOL_MISMATCH',
        severity: data.teamSize < 10 ? 'medium' : 'low',
        action: 'simplify',
        category: 'architecture',
        title: `${meta.name} may be too complex for your team scale`,
        description: `${meta.name} is designed for ${meta.recommendedTeamSize}+ teams, but your organization has only ${data.teamSize} people. The operational overhead may outweigh benefits.`,
        recommendation: alternatives.length > 0
          ? `Consider ${alternatives[0].name} as a simpler alternative. It covers core functionality with less operational complexity.`
          : `Evaluate whether the full capabilities of ${meta.name} are utilized at your current scale.`,
        estimatedSavings: alternatives[0]?.estimatedSavings ?? Math.round(tool.monthlySpend * 0.5),
        priorityScore: 0,
        priorityLabel: 'long-term',
        alternatives,
        relatedToolIds: [toolId],
      };
    },
  },
  {
    condition: (toolId, data) => {
      const meta = TOOL_CATALOG[toolId];
      if (!meta) return false;
      return meta.complexity === 'simple' && data.teamSize > 50;
    },
    generate: (toolId, tool, data) => {
      const meta = TOOL_CATALOG[toolId];
      if (!meta) return null;

      return {
        type: 'PLAN_MISMATCH',
        severity: 'low',
        action: 'optimize',
        category: 'operations',
        title: `${meta.name} may be insufficient for your team scale`,
        description: `${meta.name} is designed for ${meta.recommendedTeamSize} teams, but your organization has ${data.teamSize} people. You may need additional features, admin controls, or support.`,
        recommendation: `Evaluate whether upgrading to a higher tier or switching to a more scalable tool provides the features needed for your team.`,
        estimatedSavings: 0,
        priorityScore: 0,
        priorityLabel: 'long-term',
        relatedToolIds: [toolId],
      };
    },
  },
];

export const generateToolRecommendations = (
  data: AuditFormValues,
  existingFindings: AuditFinding[]
): AuditFinding[] => {
  const findings: AuditFinding[] = [];
  const existingToolTypes = new Set(
    existingFindings.map((f) => `${f.type}:${f.relatedToolIds?.[0]}`)
  );

  for (const tool of data.tools) {
    for (const rule of RULES) {
      if (!rule.condition(tool.toolId, data)) continue;

      const finding = rule.generate(tool.toolId, tool, data);
      if (!finding) continue;

      const key = `${finding.type}:${finding.relatedToolIds?.[0]}`;
      if (existingToolTypes.has(key)) continue;

      findings.push(finding);
    }
  }

  return findings;
};
