export type PlanTier = 'free' | 'pro' | 'team' | 'business' | 'enterprise';

export type RecommendedTeamSize = 'solo' | 'startup' | 'small-team' | 'enterprise';

export type PlanCatalogEntry = {
  id: string;

  name: string;

  tier: PlanTier;

  recommendedTeamSize: RecommendedTeamSize;

  suitableUseCases: string[];

  advancedFeatures: boolean;
};

export const PLAN_CATALOG: Record<string, PlanCatalogEntry> = {
  'chatgpt-free': {
    id: 'chatgpt-free',

    name: 'ChatGPT Free',

    tier: 'free',

    recommendedTeamSize: 'solo',

    suitableUseCases: ['writing', 'research', 'coding'],

    advancedFeatures: false,
  },

  'chatgpt-pro': {
    id: 'chatgpt-pro',

    name: 'ChatGPT Pro',

    tier: 'pro',

    recommendedTeamSize: 'startup',

    suitableUseCases: ['coding', 'writing', 'research'],

    advancedFeatures: true,
  },

  'chatgpt-team': {
    id: 'chatgpt-team',

    name: 'ChatGPT Team',

    tier: 'team',

    recommendedTeamSize: 'small-team',

    suitableUseCases: ['coding', 'startup', 'mixed'],

    advancedFeatures: true,
  },

  'chatgpt-enterprise': {
    id: 'chatgpt-enterprise',

    name: 'ChatGPT Enterprise',

    tier: 'enterprise',

    recommendedTeamSize: 'enterprise',

    suitableUseCases: ['enterprise', 'mixed', 'ai-development'],

    advancedFeatures: true,
  },

  'cursor-pro': {
    id: 'cursor-pro',

    name: 'Cursor Pro',

    tier: 'pro',

    recommendedTeamSize: 'startup',

    suitableUseCases: ['coding', 'ai-development'],

    advancedFeatures: true,
  },

  'cursor-business': {
    id: 'cursor-business',

    name: 'Cursor Business',

    tier: 'business',

    recommendedTeamSize: 'small-team',

    suitableUseCases: ['coding', 'enterprise'],

    advancedFeatures: true,
  },

  'jira-free': {
    id: 'jira-free',

    name: 'Jira Free',

    tier: 'free',

    recommendedTeamSize: 'startup',

    suitableUseCases: ['startup', 'coding'],

    advancedFeatures: false,
  },

  'jira-enterprise': {
    id: 'jira-enterprise',

    name: 'Jira Enterprise',

    tier: 'enterprise',

    recommendedTeamSize: 'enterprise',

    suitableUseCases: ['enterprise', 'product-management'],

    advancedFeatures: true,
  },
};
