import { z } from 'zod';
import { SUPPORTED_TOOLS, USE_CASES } from '../constants/audit.constants';
import { PLAN_TIERS } from '../constants/plan-tier.constants';

const TOOL_IDS = SUPPORTED_TOOLS.map((t) => t.id) as [string, ...string[]];
const USE_CASE_IDS = USE_CASES.map((uc) => uc.id) as [string, ...string[]];
const PLAN_IDS = PLAN_TIERS.map((t) => t.id) as [string, ...string[]];

export const toolValidationSchema = z.object({
  toolId: z.enum(TOOL_IDS),

  planName: z.enum(PLAN_IDS),

  monthlySpend: z.coerce.number().positive(),

  seatsCount: z.coerce.number().min(1),
});

export const auditFormValuesValidation = z.object({
  teamSize: z.coerce.number().min(1),

  primaryUseCase: z.enum(USE_CASE_IDS),

  tools: z.array(toolValidationSchema).min(1),
});
