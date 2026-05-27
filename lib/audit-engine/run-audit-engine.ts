import { AuditFormValues } from '../../types/audit.types';

import { detectPlanMismatch } from './rules/detect-plan-mismatch';
import { detectToolMismatch } from './rules/detect-tool-mismatch';
import { detectUnusedSeats } from './rules/detect-unused-seats.rule';
import { detectToolOverlap } from './rules/detect-tool-overlap';

import { generatePlanRecommendation } from './recommendations/generatePlanRecommendation';
import { generateAlternativeSuggestions } from './recommendations/generateAlternativeSuggestions';
import { generateConsolidationSuggestions } from './recommendations/generateConsolidationSuggestions';
import { prioritizeFindings } from './recommendations/prioritizeFindings';

import { generateOptimizationSummary } from './generate-optimization-summary';

import { AuditEngineResult } from '../../types/audit-engine.types';

export const runAuditEngine = (data: AuditFormValues): AuditEngineResult => {
  const ruleFindings = [
    ...detectUnusedSeats(data),
    ...detectToolMismatch(data),
    ...detectPlanMismatch(data),
    ...detectToolOverlap(data),
  ];

  const recommendationFindings = [
    ...generatePlanRecommendation(data, ruleFindings),
    ...generateAlternativeSuggestions(data, ruleFindings),
    ...generateConsolidationSuggestions(data, ruleFindings),
  ];

  const allFindings = prioritizeFindings([...ruleFindings, ...recommendationFindings]);

  const summary = generateOptimizationSummary(allFindings, data);

  return { findings: allFindings, summary };
};
