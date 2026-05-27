# SpendWise — Prompts & Development Guide

## Overview

This document catalogs the prompts, thought frameworks, and query patterns used during SpendWise's development. These prompts were used to scaffold the architecture, generate domain catalogs, and reason about engineering tradeoffs.

---

## Architecture & Planning Prompts

### Initial System Prompt

Used to bootstrap the audit engine architecture:

> Build a modular audit engine for analyzing organizational SaaS spend.
> The engine should:
> 1. Accept structured input (teamSize, useCase, tools[])
> 2. Run deterministic rules (unused seats, tool mismatch, plan mismatch)
> 3. Return structured findings with severity and savings estimates
> 4. Be pure, testable, and composable
>
> Architecture preferences:
> - Pure functions over classes
> - Catalog-driven (typed static data for tools and plans)
> - Flat pipeline (rules run independently, results merge)
> - TypeScript strict mode
> - Zustand for state persistence

**Output:** The initial engine structure with 3 rules, 2 catalogs, and the orchestrator.

### Recommendation Engine Prompt

> Evolve the audit engine into a recommendation intelligence system.
>
> Current limitations:
> - Recommendations are static strings
> - No alternative suggestions
> - No overlap detection
> - No prioritization
>
> Requirements:
> - Downgrade paths with cost projections
> - Cross-tool alternatives (e.g., "Replace Jira with Linear")
> - Overlap detection (duplicate AI assistants, multiple PM tools)
> - Scoring and prioritization (severity + savings + complexity)
> - Natural-language optimization summary
>
> All logic must remain deterministic and rule-based. No ML.

**Output:** The 4 recommendation generator modules and the prioritization engine.

---

## Domain Catalog Generation Prompts

### Plan Catalog Generation

> Generate a comprehensive plan catalog for AI and dev tools.
>
> For each tool, include:
> - Plan tiers (free, pro, team, business, enterprise)
> - Pricing (per-seat or flat)
> - Team size recommendations (solo, startup, small-team, enterprise)
> - Use case suitability
>
> Tools to cover:
> - ChatGPT, Claude, Gemini (AI assistants)
> - Cursor, Copilot (AI coding)
> - Jira, Linear, Notion (project management)
> - Slack, Figma (collaboration)
> - Docker, Kubernetes, AWS, Vercel (infrastructure)
>
> Format entries as typed records with tierRank ordinal for comparison.

**Output:** 30+ plan catalog entries with tierRank, pricing, and team scale recommendations.

### Tool Overlap Mapping

> Define overlap groups for tool consolidation detection.
>
> Tools that serve the same purpose should share an overlapGroup:
> - AI assistants: ChatGPT, Claude, Gemini
> - Project management: Jira, Linear
> - Design tools: Figma, Tailwind, Framer Motion
> - Container orchestration: Kubernetes, Docker Compose
>
> For consolidation suggestions, define preference ordering and rationale templates.

**Output:** OVERLAP_NAMES mapping, CONSOLIDATION_RULES with keepPreference ordering.

---

## Engineering Decision Prompts

### State Management

> Evaluate state management options for a client-only Next.js app with:
> - 2 stores (form data, findings/results)
> - Cross-page state sharing (/audit → /audit/results)
> - Persistence across page refreshes
> - Minimal bundle size
>
> Compare: Zustand vs Redux Toolkit vs React Context.
> Recommendation should include bundle size comparison and code example.

**Decision rationale:** Zustand wins on all dimensions for this use case:
- ~1KB gzip vs ~11KB Redux Toolkit
- No provider nesting
- Built-in persist middleware (localStorage)
- Direct state access outside components

### Rule Engine Architecture

> Compare flat pipeline vs middleware-style rule engine for the audit system.
>
> Flat pipeline: `const findings = [...rule1(data), ...rule2(data), ...rule3(data)];`
> Middleware: each rule receives findings so far and can modify or filter them.
>
> For v0.1, which is simpler and more maintainable?

**Decision:** Flat pipeline. It's simpler, more composable, and rules don't need to know about each other. If rule interdependency becomes necessary, add a shared context object rather than a middleware chain.

---

## Code Generation Patterns

### New Rule Template

```
Create a new audit rule following this template:

```typescript
import { AuditFinding } from '../../../types/audit-engine.types';
import { AuditFormValues } from '../../../types/audit.types';

export const detectPatternName = (data: AuditFormValues): AuditFinding[] => {
  const findings: AuditFinding[] = [];
  
  for (const tool of data.tools) {
    // Detection logic here
    if (condition) {
      findings.push({
        type: 'FINDING_TYPE',       // from AuditFinding type union
        severity: 'medium',         // 'low' | 'medium' | 'high'
        action: 'optimize',         // from RecommendationAction
        category: 'cost',           // from FindingCategory
        title: '...',
        description: '...',
        recommendation: '...',
        estimatedSavings: n,
        priorityScore: 0,
        priorityLabel: 'long-term',
        relatedToolIds: [tool.toolId],
      });
    }
  }
  
  return findings;
};
```

### Adding a Downgrade Path

```
Add a new downgrade path to DOWNGRADE_PATHS in generatePlanRecommendation.ts:

{ fromPlanId: 'slack-business', toPlanId: 'slack-pro', label: 'Slack Pro' }

Verify:
1. Both plan IDs exist in PLAN_CATALOG
2. The target plan's tier rank is <= team scale rank + 1 (prevent over-downgrading)
3. The label matches the target plan's display name
```

---

## Debugging Patterns

### Plan Catalog Lookup Debug

```
Problem: detectPlanMismatch returns empty for a tool with known plan.
Check:
1. tool.toolId matches a key in TOOL_CATALOG
2. tool.planName is a valid tier ID (free/pro/team/business/enterprise)
3. PLAN_CATALOG has key `${tool.toolId}-${tool.planName.toLowerCase()}`
4. getPlanEntry(toolId, planName) returns a value
```

### Finding Persistence Debug

```
Problem: Old findings appear after type changes.
Root cause: Zustand persist stores raw JSON. Adding new fields to AuditFinding 
makes old data incompatible.
Mitigation:
- Clear localStorage: localStorage.removeItem('audit-findings-store')
- Or add store versioning with migration function
```

---

## Future Prompt Ideas

### Pricing API Integration

> Design a pricing API integration for SpendWise.
> The API should:
> - Fetch real-time pricing for supported tools
> - Support per-seat, flat, and usage-based models
> - Cache responses with TTL
> - Fall back to static data when API is unreachable
>
> Consider: API providers, rate limiting, data format, error handling.

### Multi-Workspace Architecture

> Design the backend architecture for multi-workspace SpendWise.
> Requirements:
> - Team accounts with invite flow
> - Aggregated audits across departments
> - Historical trend tracking
> - Role-based access
>
> Consider: Data model, API design, auth (Clerk/Auth0/NextAuth), database (Postgres/PlanetScale).
