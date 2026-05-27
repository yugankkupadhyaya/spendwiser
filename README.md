# SpendWise — AI SaaS Optimization Platform

**Version:** 0.1.0 (Pre-release)
**Stack:** Next.js 16 · TypeScript · TailwindCSS v4 · Zustand · Framer Motion
**Status:** Active Development

---

## Overview

SpendWise is a deterministic audit engine and recommendation intelligence system that analyzes organizational SaaS spend — with a focus on AI tooling. It detects overprovisioned plans, unused seats, tool misalignment, and duplicate subscriptions, then generates prioritized, actionable optimization recommendations.

Unlike generic spend management tools, SpendWise is purpose-built for the AI engineering stack: ChatGPT, Claude, Cursor, Copilot, Jira, Linear, Kubernetes, Vercel, and 14 other tools in its domain catalog.

---

## Core Capabilities

| Feature | Description |
|---|---|
| **Unused Seat Detection** | Compares purchased seats against actual team size; calculates per-seat waste |
| **Plan Overprovisioning** | Ordinal tier comparison (free → pro → team → business → enterprise) flags plans that exceed team scale |
| **Tool-Use Case Alignment** | Validates each tool against the team's primary workflow (coding, AI-dev, devops, etc.) |
| **Duplicate Tooling Detection** | Groups tools by overlap category (ai-assistant, project-management, design-suite) and flags redundancy |
| **Downgrade Paths** | 11 concrete plan downgrade routes with cost projections (e.g., ChatGPT Enterprise → Team) |
| **Cross-Tool Alternatives** | Suggests cheaper or simpler alternatives (e.g., Jira → Linear, Kubernetes → Docker Compose) |
| **Consolidation Recommendations** | Priority-ranked keep/remove suggestions per overlap group |
| **Prioritization Scoring** | `severityScore + savingsScore + complexityBonus` → labels: critical, quick-win, long-term |
| **Optimization Summary** | Dynamic prose summary with estimated annual savings and action breakdown |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | TailwindCSS v4 |
| State Management | Zustand 5 with persist middleware |
| Forms | React Hook Form 7 + Zod 4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Notifications | Sonner |
| Linting | ESLint 9 + Next.js config |

---

## Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                    User Input                       │
│  (teamSize, primaryUseCase, tools[])                │
└──────────────────┬─────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────┐
│              runAuditEngine(data)                    │
├────────────────────────────────────────────────────┤
│  Phase 1: Rules Pipeline                            │
│  ├─ detectUnusedSeats()                             │
│  ├─ detectToolMismatch()                            │
│  ├─ detectPlanMismatch()                            │
│  └─ detectToolOverlap()                             │
│                                                     │
│  Phase 2: Recommendation Generators                 │
│  ├─ generatePlanRecommendation()                    │
│  ├─ generateAlternativeSuggestions()                │
│  └─ generateConsolidationSuggestions()              │
│                                                     │
│  Phase 3: Prioritization + Summary                  │
│  ├─ prioritizeFindings()                            │
│  └─ generateOptimizationSummary()                   │
└──────────────────┬─────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────┐
│           AuditEngineResult                         │
│  { findings: AuditFinding[], summary: string }       │
└──────────────────┬─────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────┐
│           Zustand Stores → Pages                    │
│  ┌─ audit.store.ts    (form data)                   │
│  └─ findings.store.ts (results)                     │
│                                                     │
│  ┌─ /audit          (form page)                     │
│  └─ /audit/results  (dashboard page)                │
└────────────────────────────────────────────────────┘
```

---

## Project Structure

```
spendwiser/
├── app/
│   ├── page.tsx              # Landing page with hero + ROI simulator
│   ├── layout.tsx            # Root layout with metadata + fonts
│   ├── audit/
│   │   ├── page.tsx          # Multi-tool audit form (react-hook-form + Zod)
│   │   └── results/
│   │       └── page.tsx      # Findings dashboard with KPIs + filtering
│   └── globals.css           # Tailwind imports + base styles
│
├── lib/
│   ├── audit-engine/
│   │   ├── run-audit-engine.ts          # Orchestrator entry point
│   │   ├── generate-optimization-summary.ts  # Summary generator
│   │   ├── config/
│   │   │   ├── plan-catalog.ts          # 30+ plan entries with pricing + tier ranks
│   │   │   └── tool-catalog.ts          # 20 tool definitions with categories + overlaps
│   │   ├── rules/
│   │   │   ├── detect-unused-seats.rule.ts
│   │   │   ├── detect-tool-mismatch.ts
│   │   │   ├── detect-plan-mismatch.ts
│   │   │   └── detect-tool-overlap.ts
│   │   └── recommendations/
│   │       ├── generatePlanRecommendation.ts
│   │       ├── generateAlternativeSuggestions.ts
│   │       ├── generateConsolidationSuggestions.ts
│   │       └── prioritizeFindings.ts
│   ├── utils/
│   │   └── get-team-size.ts            # Team scale classifier
│   └── motion/
│       └── animation.ts                # Framer Motion variants
│
├── types/
│   ├── audit-engine.types.ts           # Core AuditFinding + engine types
│   ├── audit.types.ts                  # Form input types
│   └── usecases.types.ts               # UseCase union type
│
├── constants/
│   ├── audit.constants.ts              # 20 supported tools, 12 use cases
│   └── plan-tier.constants.ts          # 5 plan tiers (free→enterprise)
│
├── store/
│   ├── audit.store.ts                  # Zustand persist: form data
│   └── findings.store.ts               # Zustand persist: audit results
│
└── validation/
    └── audit.validation.ts             # Zod schemas for form validation
```

---

## Key Domain Models

### AuditFinding
```typescript
{
  type: 'UNUSED_SEATS' | 'OVERPROVISIONED_PLAN' | 'TOOL_MISMATCH' | 'DUPLICATE_TOOLING' | 'PLAN_MISMATCH';
  severity: 'low' | 'medium' | 'high';
  action: 'downgrade' | 'replace' | 'consolidate' | 'remove' | 'simplify' | 'optimize';
  category: 'cost' | 'efficiency' | 'architecture' | 'operations';
  priorityScore: number;     // 0-100 computed score
  priorityLabel: 'critical' | 'quick-win' | 'long-term';
  estimatedSavings: number;  // monthly
  alternatives?: AlternativeSuggestion[];  // downgrade paths or tool swaps
  relatedToolIds?: string[];
}
```

### PlanCatalogEntry
```typescript
{
  id: string;                // e.g., 'chatgpt-enterprise'
  toolId: string;            // e.g., 'chatgpt'
  tier: PlanTier;            // 'free' | 'pro' | 'team' | 'business' | 'enterprise'
  tierRank: number;          // ordinal: 0-4 for deterministic comparison
  recommendedTeamSize: TeamScale;
  perSeatCost?: number;      // per-user pricing
  monthlyFlatCost?: number;  // flat-rate pricing
}
```

### ToolCatalogEntry
```typescript
{
  id: string;                // e.g., 'jira'
  category: ToolCategory;    // 'project-management' | 'ai' | 'devops' | etc.
  complexity: ToolComplexity;
  recommendedTeamSize: TeamScale;
  overlapGroup?: string;     // for duplicate detection — e.g., 'ai-assistant'
}
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Lint
pnpm lint
```

The app runs at `http://localhost:3000`. Navigate to `/audit` to run an audit.

---

## Design Principles

1. **Deterministic, not ML.** All heuristics are rule-based, ordinal, and fully explainable. No black-box decisions.
2. **Pure functions.** Every rule is a pure `(data) => AuditFinding[]` function. No side effects, no state.
3. **Catalog-driven reasoning.** Knowledge about tools, plans, and pricing lives in typed catalogs, not scattered across the codebase.
4. **Low coupling, high cohesion.** Rules, generators, and UI are independently testable and swappable.
5. **Domain-driven types.** Every concept has a dedicated type. No `any`, no `stringly-typed` identifiers.

---

## Development Roadmap

| Phase | Focus |
|---|---|
| Current (0.1) | Core audit engine, 3 detection rules, results dashboard |
| Current (0.2) | Recommendation intelligence, overlap detection, prioritization, alternatives |
| Next (0.3) | Pricing API integration, expanded catalog (100+ tools), usage-based billing detection |
| Future (1.0) | Multi-workspace, team collaboration, scheduled audits, benchmarking |

---

## License

Private · Pre-release · Not for distribution
