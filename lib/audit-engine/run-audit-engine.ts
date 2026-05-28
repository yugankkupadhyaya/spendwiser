import { AuditFormValues } from '../../types/audit.types';

import { detectPlanMismatch } from './rules/detect-plan-mismatch';
import { detectToolMismatch } from './rules/detect-tool-mismatch';
import { detectUnusedSeats } from './rules/detect-unused-seats.rule';
import { detectToolOverlap } from './rules/detect-tool-overlap';

import { enrichPlanRecommendations } from './recommendations/enrichPlanRecommendations';
import { enrichAlternativeSuggestions } from './recommendations/enrichAlternativeSuggestions';
import { enrichConsolidationSuggestions } from './recommendations/enrichConsolidationSuggestions';
import { generateAlternativeSuggestions } from './recommendations/generateAlternativeSuggestions';
import { generateToolRecommendations } from './recommendations/generateToolRecommendations';
import { prioritizeFindings } from './recommendations/prioritizeFindings';

import { generateFinalSummary } from './recommendations/generateFinalSummary';

import { AuditEngineResult } from '../../types/audit-engine.types';

export const runAuditEngine = (data: AuditFormValues): AuditEngineResult => {
  let findings = [
    ...detectUnusedSeats(data),
    ...detectToolMismatch(data),
    ...detectPlanMismatch(data),
    ...detectToolOverlap(data),
  ];

  findings = enrichPlanRecommendations(data, findings);
  findings = enrichAlternativeSuggestions(data, findings);
  findings = enrichConsolidationSuggestions(data, findings);
  findings = [
    ...findings,
    ...generateAlternativeSuggestions(data, findings),
    ...generateToolRecommendations(data, findings),
  ];

  findings = prioritizeFindings(findings);

  const summary = generateFinalSummary(findings, data);

  return { findings, summary };
};
