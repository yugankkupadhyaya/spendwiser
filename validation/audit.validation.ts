import { z } from 'zod';

export const toolValidationSchema = z.object({
  toolId: z.string().min(1),

  planName: z.string().min(1),

  monthlySpend: z.coerce.number().positive(),

  seatsCount: z.coerce.number().min(1),
});

export const auditFormValuesValidation = z.object({
  teamSize: z.coerce.number().min(1),

  primaryUseCase: z.string().min(1),

  tools: z.array(toolValidationSchema).min(1),
});
