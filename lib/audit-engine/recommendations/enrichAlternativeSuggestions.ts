import { AuditFinding, AlternativeSuggestion } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';
import { TOOL_CATALOG } from '../config/tool-catalog';

const TOOL_ALTERNATIVES: Record<string, { toolId: string; planName: string; estimatedMonthlyCost: number; rationale: string }[]> = {
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

export const enrichAlternativeSuggestions = (
  data: AuditFormValues,
  findings: AuditFinding[]
): AuditFinding[] => {
  const toolIdsInUse = new Set(data.tools.map((t) => t.toolId));

  return findings.map((finding) => {
    if (finding.type !== 'TOOL_MISMATCH') return finding;

    const toolId = finding.relatedToolIds?.[0];
    if (!toolId) return finding;

    const tool = data.tools.find((t) => t.toolId === toolId);
    if (!tool) return finding;

    const alternativesDefs = TOOL_ALTERNATIVES[toolId];
    if (!alternativesDefs) return finding;

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

    if (alternatives.length === 0) return finding;

    return {
      ...finding,
      alternatives,
      recommendation: `Review whether this tool is actively contributing to your team workflows. Consider alternatives: ${alternatives.map((a) => a.name).join(', ')}.`,
      estimatedSavings: Math.max(
        finding.estimatedSavings,
        Math.round(alternatives.reduce((s, a) => s + a.estimatedSavings, 0) / alternatives.length)
      ),
    };
  });
};
