export type ToolCardValues = {
  toolId: string;
  planName: string;
  monthlySpend: number;
  seatsCount: number;
};

export type AuditFormValues = {
  teamSize: number;
  primaryUseCase: string;
  tools: ToolCardValues[];
};
