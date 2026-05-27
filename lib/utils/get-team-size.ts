export type TeamScale = 'solo' | 'startup' | 'small-team' | 'enterprise';

export const TEAM_SCALE_RANK: Record<TeamScale, number> = {
  solo: 0,
  startup: 1,
  'small-team': 2,
  enterprise: 3,
};

export const getTeamScale = (teamSize: number): TeamScale => {
  if (teamSize <= 1) {
    return 'solo';
  }
  if (teamSize <= 10) {
    return 'startup';
  }
  if (teamSize <= 50) {
    return 'small-team';
  }
  return 'enterprise';
};
