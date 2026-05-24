import { Variants } from "framer-motion";

export const SUPPORTED_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'copilot', name: 'GitHub Copilot' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'openai-api', name: 'OpenAI API' },
  { id: 'anthropic-api', name: 'Anthropic API' },
  { id: 'windsurf', name: 'Windsurf' },
];

export const USE_CASES = [
  { id: 'coding', name: 'Coding & Engineering' },
  { id: 'writing', name: 'Writing & Marketing' },
  { id: 'research', name: 'Research & Strategy' },
  { id: 'data-analysis', name: 'Data Analysis & BI' },
  { id: 'mixed', name: 'Mixed Operations' },
];

export const fadeInUpVariant: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};
export const cardAnimationVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};
