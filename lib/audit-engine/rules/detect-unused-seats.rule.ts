import { AuditFormValues } from '../../../types/audit.types';

export const detectUnusedSeats = (data: AuditFormValues) => {
  const teamSize = data.teamSize;
  const seatsCount = data.tools[1].seatsCount;
  const monthlySpend = data.tools[1].monthlySpend;

  const perPersonSpend = monthlySpend / teamSize;
  const unusedSeats = teamSize - seatsCount;
  const totalSavings = perPersonSpend * unusedSeats;
  return totalSavings;
};
