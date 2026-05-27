export type TeamScale = 'solo' | 'startup' | 'small-team' | 'enterprise';

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
