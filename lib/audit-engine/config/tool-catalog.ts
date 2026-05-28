import { UseCase } from '../../../types/usecases.types';

export type ToolCategory =
  | 'coding'
  | 'ai'
  | 'design'
  | 'productivity'
  | 'research'
  | 'devops'
  | 'project-management'
  | 'communication'
  | 'cloud';

export type ToolComplexity = 'simple' | 'moderate' | 'advanced' | 'enterprise';

export type ToolCatalogEntry = {
  id: string;

  name: string;

  category: ToolCategory;

  suitableUseCases: UseCase[];

  complexity: ToolComplexity;

  recommendedTeamSize: 'solo' | 'startup' | 'small-team' | 'enterprise';

  overlapGroup?: string;
};

// export const TOOL_CATALOG: Record<string, ToolCatalogEntry> = {
//   chatgpt: {
//     id: 'chatgpt',

//     name: 'ChatGPT',

//     category: 'ai',

//     suitableUseCases: ['coding', 'research', 'writing', 'mixed'],

//     complexity: 'simple',

//     recommendedTeamSize: 'startup',

//     overlapGroup: 'ai-assistant',
//   },

//   claude: {
//     id: 'claude',

//     name: 'Claude',

//     category: 'ai',

//     suitableUseCases: ['writing', 'research', 'coding'],

//     complexity: 'simple',

//     recommendedTeamSize: 'startup',

//     overlapGroup: 'ai-assistant',
//   },

//   cursor: {
//     id: 'cursor',

//     name: 'Cursor',

//     category: 'coding',

//     suitableUseCases: ['coding', 'ai-development'],

//     complexity: 'moderate',

//     recommendedTeamSize: 'startup',

//     overlapGroup: 'ai-code-editor',
//   },

//   copilot: {
//     id: 'copilot',

//     name: 'GitHub Copilot',

//     category: 'coding',

//     suitableUseCases: ['coding', 'ai-development'],

//     complexity: 'simple',

//     recommendedTeamSize: 'small-team',

//     overlapGroup: 'ai-code-assistant',
//   },

//   figma: {
//     id: 'figma',

//     name: 'Figma',

//     category: 'design',

//     suitableUseCases: ['design', 'product-management'],

//     complexity: 'moderate',

//     recommendedTeamSize: 'small-team',

//     overlapGroup: 'design-suite',
//   },

//   jira: {
//     id: 'jira',

//     name: 'Jira',

//     category: 'project-management',

//     suitableUseCases: ['coding', 'product-management', 'mixed'],

//     complexity: 'advanced',

//     recommendedTeamSize: 'enterprise',

//     overlapGroup: 'project-management',
//   },

//   linear: {
//     id: 'linear',

//     name: 'Linear',

//     category: 'project-management',

//     suitableUseCases: ['coding', 'startup', 'product-management'],

//     complexity: 'moderate',

//     recommendedTeamSize: 'startup',

//     overlapGroup: 'project-management',
//   },

//   slack: {
//     id: 'slack',

//     name: 'Slack',

//     category: 'communication',

//     suitableUseCases: ['mixed', 'startup', 'coding'],

//     complexity: 'simple',

//     recommendedTeamSize: 'small-team',

//     overlapGroup: 'communication',
//   },

//   docker: {
//     id: 'docker',

//     name: 'Docker',

//     category: 'devops',

//     suitableUseCases: ['devops', 'coding', 'ai-development'],

//     complexity: 'advanced',

//     recommendedTeamSize: 'small-team',

//     overlapGroup: 'containerization',
//   },

//   kubernetes: {
//     id: 'kubernetes',

//     name: 'Kubernetes',

//     category: 'devops',

//     suitableUseCases: ['devops', 'enterprise'],

//     complexity: 'enterprise',

//     recommendedTeamSize: 'enterprise',

//     overlapGroup: 'container-orchestration',
//   },

//   aws: {
//     id: 'aws',

//     name: 'AWS',

//     category: 'cloud',

//     suitableUseCases: ['devops', 'ai-development', 'startup'],

//     complexity: 'advanced',

//     recommendedTeamSize: 'small-team',

//     overlapGroup: 'cloud-provider',
//   },
// };

export const TOOL_CATALOG: Record<string, ToolCatalogEntry> = {
  chatgpt: {
    id: 'chatgpt',

    name: 'ChatGPT',

    category: 'ai',

    suitableUseCases: ['coding', 'research', 'writing', 'mixed'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'ai-assistant',
  },

  claude: {
    id: 'claude',

    name: 'Claude',

    category: 'ai',

    suitableUseCases: ['writing', 'research', 'coding'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'ai-assistant',
  },

  cursor: {
    id: 'cursor',

    name: 'Cursor',

    category: 'coding',

    suitableUseCases: ['coding', 'ai-development'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',

    overlapGroup: 'ai-code-editor',
  },

  copilot: {
    id: 'copilot',

    name: 'GitHub Copilot',

    category: 'coding',

    suitableUseCases: ['coding', 'ai-development'],

    complexity: 'simple',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'ai-code-editor',
  },

  gemini: {
    id: 'gemini',

    name: 'Gemini',

    category: 'ai',

    suitableUseCases: ['research', 'writing', 'coding'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'ai-assistant',
  },

  notion: {
    id: 'notion',

    name: 'Notion',

    category: 'productivity',

    suitableUseCases: ['writing', 'research', 'product-management'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'workspace',
  },

  figma: {
    id: 'figma',

    name: 'Figma',

    category: 'design',

    suitableUseCases: ['design', 'product-management'],

    complexity: 'moderate',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'design-suite',
  },

  jira: {
    id: 'jira',

    name: 'Jira',

    category: 'project-management',

    suitableUseCases: ['coding', 'product-management', 'mixed'],

    complexity: 'advanced',

    recommendedTeamSize: 'enterprise',

    overlapGroup: 'project-management',
  },

  linear: {
    id: 'linear',

    name: 'Linear',

    category: 'project-management',

    suitableUseCases: ['coding', 'startup', 'product-management'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',

    overlapGroup: 'project-management',
  },

  slack: {
    id: 'slack',

    name: 'Slack',

    category: 'communication',

    suitableUseCases: ['mixed', 'startup', 'coding'],

    complexity: 'simple',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'communication',
  },

  docker: {
    id: 'docker',

    name: 'Docker',

    category: 'devops',

    suitableUseCases: ['devops', 'coding', 'ai-development'],

    complexity: 'advanced',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'containerization',
  },

  kubernetes: {
    id: 'kubernetes',

    name: 'Kubernetes',

    category: 'devops',

    suitableUseCases: ['devops', 'enterprise'],

    complexity: 'enterprise',

    recommendedTeamSize: 'enterprise',

    overlapGroup: 'container-orchestration',
  },

  aws: {
    id: 'aws',

    name: 'AWS',

    category: 'cloud',

    suitableUseCases: ['devops', 'ai-development', 'startup'],

    complexity: 'advanced',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'cloud-provider',
  },

  vercel: {
    id: 'vercel',

    name: 'Vercel',

    category: 'cloud',

    suitableUseCases: ['coding', 'startup'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'deployment-platform',
  },

  redis: {
    id: 'redis',

    name: 'Redis',

    category: 'cloud',

    suitableUseCases: ['coding', 'devops', 'ai-development'],

    complexity: 'advanced',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'cache-database',
  },

  kafka: {
    id: 'kafka',

    name: 'Kafka',

    category: 'devops',

    suitableUseCases: ['enterprise', 'ai-development', 'data-analysis'],

    complexity: 'enterprise',

    recommendedTeamSize: 'enterprise',

    overlapGroup: 'event-streaming',
  },

  postgresql: {
    id: 'postgresql',

    name: 'PostgreSQL',

    category: 'cloud',

    suitableUseCases: ['coding', 'data-analysis', 'startup'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',

    overlapGroup: 'database',
  },

  prisma: {
    id: 'prisma',

    name: 'Prisma',

    category: 'coding',

    suitableUseCases: ['coding', 'startup'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'orm',
  },

  tailwind: {
    id: 'tailwind',

    name: 'Tailwind CSS',

    category: 'design',

    suitableUseCases: ['coding', 'design'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',

    overlapGroup: 'ui-framework',
  },

  'framer-motion': {
    id: 'framer-motion',

    name: 'Framer Motion',

    category: 'design',

    suitableUseCases: ['coding', 'design'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',

    overlapGroup: 'animation-library',
  },

  windsurf: {
    id: 'windsurf',

    name: 'Windsurf',

    category: 'coding',

    suitableUseCases: ['coding', 'ai-development'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',

    overlapGroup: 'ai-code-editor',
  },

  'openai-api': {
    id: 'openai-api',

    name: 'OpenAI API',

    category: 'ai',

    suitableUseCases: ['ai-development', 'coding', 'data-analysis'],

    complexity: 'advanced',

    recommendedTeamSize: 'small-team',
  },

  'anthropic-api': {
    id: 'anthropic-api',

    name: 'Anthropic API',

    category: 'ai',

    suitableUseCases: ['ai-development', 'coding', 'research'],

    complexity: 'advanced',

    recommendedTeamSize: 'small-team',
  },

  'notion-ai': {
    id: 'notion-ai',

    name: 'Notion AI',

    category: 'productivity',

    suitableUseCases: ['writing', 'research', 'product-management'],

    complexity: 'moderate',

    recommendedTeamSize: 'small-team',

    overlapGroup: 'ai-assistant',
  },

  perplexity: {
    id: 'perplexity',

    name: 'Perplexity',

    category: 'research',

    suitableUseCases: ['research', 'writing', 'data-analysis'],

    complexity: 'simple',

    recommendedTeamSize: 'startup',
  },

  midjourney: {
    id: 'midjourney',

    name: 'Midjourney',

    category: 'design',

    suitableUseCases: ['design'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',
  },

  'mongodb-atlas': {
    id: 'mongodb-atlas',

    name: 'MongoDB Atlas',

    category: 'cloud',

    suitableUseCases: ['coding', 'data-analysis', 'startup'],

    complexity: 'moderate',

    recommendedTeamSize: 'startup',

    overlapGroup: 'database',
  },
};
