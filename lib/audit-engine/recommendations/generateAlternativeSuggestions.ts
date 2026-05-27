import { AuditFinding, AlternativeSuggestion } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';
import { TOOL_CATALOG } from '../config/tool-catalog';

type AlternativeDef = {
  toolId: string;
  planName: string;
  estimatedMonthlyCost: number;
  rationale: string;
};

const TOOL_ALTERNATIVES: Record<string, AlternativeDef[]> = {
  chatgpt: [
    {
      toolId: 'claude',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'Comparable AI assistant with strong reasoning and coding capabilities at lower seat cost',
    },
    {
      toolId: 'cursor',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'AI-native code editor that bundles assistant functionality with development workflow',
    },
  ],
  claude: [
    {
      toolId: 'chatgpt',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'Broader ecosystem integration and plugin support at similar price point',
    },
    {
      toolId: 'gemini',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'Competitive AI assistant with strong Google Workspace integration',
    },
  ],
  cursor: [
    {
      toolId: 'copilot',
      planName: 'pro',
      estimatedMonthlyCost: 10,
      rationale: 'Lower per-seat cost with strong IDE integration for coding workflows',
    },
  ],
  copilot: [
    {
      toolId: 'cursor',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'More advanced AI-native editing experience for development teams',
    },
  ],
  jira: [
    {
      toolId: 'linear',
      planName: 'team',
      estimatedMonthlyCost: 8,
      rationale: 'Modern issue tracking with less operational overhead and faster UX for engineering teams',
    },
    {
      toolId: 'notion',
      planName: 'team',
      estimatedMonthlyCost: 10,
      rationale: 'All-in-one workspace combining docs, wikis, and lightweight project management',
    },
  ],
  linear: [
    {
      toolId: 'notion',
      planName: 'team',
      estimatedMonthlyCost: 10,
      rationale: 'Broader workspace functionality beyond issue tracking for mixed teams',
    },
  ],
  kubernetes: [
    {
      toolId: 'docker',
      planName: 'pro',
      estimatedMonthlyCost: 5,
      rationale: 'Simpler container management without orchestration overhead for small deployments',
    },
    {
      toolId: 'vercel',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'Zero-configuration deployment platform ideal for frontend and lightweight backend services',
    },
  ],
  aws: [
    {
      toolId: 'vercel',
      planName: 'pro',
      estimatedMonthlyCost: 20,
      rationale: 'Simpler deployment platform with built-in CI/CD and lower operational complexity',
    },
  ],
  figma: [
    {
      toolId: 'tailwind',
      planName: 'free',
      estimatedMonthlyCost: 0,
      rationale: 'Free utility-first CSS framework that reduces design-to-code friction for development teams',
    },
  ],
};

export const generateAlternativeSuggestions = (
  data: AuditFormValues,
  _findings: AuditFinding[]
): AuditFinding[] => {
  void _findings;
  const findings: AuditFinding[] = [];
  const toolIdsInUse = new Set(data.tools.map((t) => t.toolId));

  for (const tool of data.tools) {
    const alternativesDefs = TOOL_ALTERNATIVES[tool.toolId];
    if (!alternativesDefs) {
      continue;
    }

    const alternatives: AlternativeSuggestion[] = alternativesDefs
      .filter((alt) => !toolIdsInUse.has(alt.toolId))
      .map((alt) => {
        const altMeta = TOOL_CATALOG[alt.toolId];
        return {
          toolId: alt.toolId,
          name: altMeta?.name ?? alt.toolId,
          planName: alt.planName,
          estimatedMonthlyCost: alt.estimatedMonthlyCost,
          estimatedSavings: Math.max(0, tool.monthlySpend - alt.estimatedMonthlyCost),
          rationale: alt.rationale,
        };
      });

    if (alternatives.length === 0) {
      continue;
    }

    const totalSavings = alternatives.reduce((s, a) => s + a.estimatedSavings, 0);
    const savingsPerAlt = alternatives.length;
    const avgSavings = savingsPerAlt > 0 ? Math.round(totalSavings / savingsPerAlt) : 0;

    findings.push({
      type: 'TOOL_MISMATCH',
      severity: 'low',
      action: 'replace',
      category: 'cost',
      title: `Consider alternatives to ${TOOL_CATALOG[tool.toolId]?.name ?? tool.toolId}`,
      description: `Your team uses ${TOOL_CATALOG[tool.toolId]?.name ?? tool.toolId} at $${tool.monthlySpend}/mo. There are ${alternatives.length} alternative tool(s) worth evaluating that may better fit your workflow or budget.`,
      recommendation: `Evaluate alternatives: ${alternatives.map((a) => a.name).join(', ')}. These options may provide similar value at lower cost or with better team alignment.`,
      estimatedSavings: avgSavings,
      priorityScore: 0,
      priorityLabel: 'long-term',
      alternatives,
      relatedToolIds: [tool.toolId, ...alternatives.map((a) => a.toolId)],
    });
  }

  return findings;
};
