import {
  AuditFinding,
  PriorityLabel,
  RecommendationAction,
} from '../../../types/audit-engine.types';

const SEVERITY_SCORES: Record<string, number> = {
  high: 30,
  medium: 20,
  low: 10,
};

const ACTION_COMPLEXITY_BONUS: Record<RecommendationAction, number> = {
  consolidate: 20,
  remove: 20,
  simplify: 20,
  replace: 10,
  downgrade: 5,
  optimize: 5,
};

const PRIORITY_THRESHOLDS: { label: PriorityLabel; minScore: number }[] = [
  { label: 'critical', minScore: 60 },
  { label: 'quick-win', minScore: 35 },
  { label: 'long-term', minScore: 0 },
];

function computeSavingsScore(estimatedSavings: number): number {
  if (estimatedSavings > 1000) return 30;
  if (estimatedSavings > 500) return 25;
  if (estimatedSavings > 200) return 20;
  if (estimatedSavings > 100) return 15;
  if (estimatedSavings > 50) return 10;
  if (estimatedSavings > 0) return 5;
  return 0;
}

function computePriorityLabel(score: number): PriorityLabel {
  for (const threshold of PRIORITY_THRESHOLDS) {
    if (score >= threshold.minScore) {
      return threshold.label;
    }
  }
  return 'long-term';
}

export const prioritizeFindings = (
  findings: AuditFinding[]
): AuditFinding[] => {
  return findings.map((finding) => {
    const severityScore = SEVERITY_SCORES[finding.severity] ?? 10;
    const savingsScore = computeSavingsScore(finding.estimatedSavings);
    const complexityBonus = ACTION_COMPLEXITY_BONUS[finding.action] ?? 0;

    const priorityScore = severityScore + savingsScore + complexityBonus;
    const priorityLabel = computePriorityLabel(priorityScore);

    return {
      ...finding,
      priorityScore,
      priorityLabel,
    };
  });
};
