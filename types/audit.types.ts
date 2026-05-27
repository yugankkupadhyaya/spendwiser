import { UseCase } from './usecases.types';

export type ToolCardValues = {
  toolId: string;
  planName: string;
  monthlySpend: number;
  seatsCount: number;
};

export type AuditFormValues = {
  teamSize: number;
  primaryUseCase: UseCase;
  tools: ToolCardValues[];
};
