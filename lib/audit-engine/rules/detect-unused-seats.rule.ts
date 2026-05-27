import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';

export const detectUnusedSeats = (data: AuditFormValues): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  for (const tool of data.tools) {
    const seatsCount = tool.seatsCount;
    const monthlySpend = tool.monthlySpend;
    const teamSize = data.teamSize;

    
    const unusedSeats = seatsCount - teamSize;

    
    if (unusedSeats <= 0) {
      continue;
    }

   
    const perSeatCost = monthlySpend / seatsCount;

    
    const estimatedSavings = Math.round(perSeatCost * unusedSeats);

    findings.push({
      type: 'UNUSED_SEATS',

      severity: unusedSeats >= 5 ? 'high' : 'medium',

      title: `Unused ${tool.toolId} seats detected`,

      description: `${unusedSeats} purchased seats appear unused based on current team size.`,

      recommendation: 'Reduce unused seats to optimize monthly SaaS spend.',

      estimatedSavings,
    });
  }

  return findings;
};
