# SpendWise Architecture

## Architecture Philosophy

SpendWise is built around a modular, pipeline-based audit engine that processes organizational SaaS configuration data through deterministic rules and generates structured optimization findings. The architecture prioritizes:

- **Determinism**: Same input always produces the same output. No stochastic models.
- **Explainability**: Every finding can be traced back to a specific rule and data point.
- **Composability**: Rules and generators are pure functions that can be combined, reordered, or extended.
- **Testability**: Each stage in the pipeline is independently testable with fixture data.

---

## System Architecture

### Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│  ┌──────────────┐    ┌──────────────────────────────────────┐   │
│  │  /audit (Form) │    │  /audit/results (Dashboard)          │   │
│  │  RHF + Zod    │    │  KPI grid + Findings + Sidebar       │   │
│  └──────┬───────┘    └────────────────▲─────────────────────┘   │
│         │                             │                         │
│         ▼                             │                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                ZUSTAND STATE LAYER                      │    │
│  │  ┌─ audit.store.ts (form input)                        │    │
│  │  └─ findings.store.ts (engine output)                  │    │
│  └──────────────────────────┬─────────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    DOMAIN LAYER (lib/audit-engine/)              │
│                              │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │                    runAuditEngine()                         │  │
│  │  Entry point. Accepts AuditFormValues, returns             │  │
│  │  AuditEngineResult { findings, summary }                   │  │
│  └──────────┬─────────────────────────────────┬───────────────┘  │
│             │                                 │                  │
│             ▼                                 ▼                  │
│  ┌────────────────────┐           ┌──────────────────────────┐  │
│  │  RULES PIPELINE     │           │  RECOMMENDATION ENGINE   │  │
│  │                     │           │                          │  │
│  │  detectUnusedSeats  │           │  generatePlanRec()       │  │
│  │  detectToolMismatch │           │  generateAlternatives()  │  │
│  │  detectPlanMismatch │           │  generateConsolidation() │  │
│  │  detectToolOverlap  │           │                          │  │
│  └──────────┬──────────┘           └───────────┬──────────────┘  │
│             │                                 │                  │
│             ▼                                 ▼                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               prioritizeFindings()                        │   │
│  │  Scores all findings: severityScore + savingsScore        │   │
│  │  + complexityBonus. Labels: critical / quick-win / long-  │   │
│  │  term.                                                    │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                      │
│                         ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          generateOptimizationSummary()                    │   │
│  │  Produces natural-language summary of the entire audit.   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            DOMAIN CATALOGS (Config Layer)                  │   │
│  │  ┌─ plan-catalog.ts — 30+ plans with pricing, tiers       │   │
│  │  └─ tool-catalog.ts  — 20 tools with categories, overlaps │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: End-to-End

### 1. Form Submission

```
User fills form → React Hook Form validation (Zod) →
  useAuditStore.setAuditData(data) →
    runAuditEngine(data) →
      useFindingsStore.setAuditFindings(result.findings) →
        router.push('/audit/results')
```

The form (`app/audit/page.tsx`) captures:
- `teamSize: number` — total headcount
- `primaryUseCase: UseCase` — 12 possible values (coding, ai-development, devops, etc.)
- `tools: ToolCardValues[]` — array of { toolId, planName, monthlySpend, seatsCount }

Zod validates:
- `teamSize` ≥ 1
- `primaryUseCase` non-empty
- Each tool: `toolId` + `planName` non-empty, `monthlySpend` > 0, `seatsCount` ≥ 1
- At least 1 tool

### 2. Engine Execution

`runAuditEngine` in `lib/audit-engine/run-audit-engine.ts`:

```typescript
export const runAuditEngine = (data: AuditFormValues): AuditEngineResult => {
  // Phase 1: Rules detect specific problems
  const ruleFindings = [
    ...detectUnusedSeats(data),
    ...detectToolMismatch(data),
    ...detectPlanMismatch(data),
    ...detectToolOverlap(data),
  ];

  // Phase 2: Generators produce recommendations
  const recommendationFindings = [
    ...generatePlanRecommendation(data, ruleFindings),
    ...generateAlternativeSuggestions(data, ruleFindings),
    ...generateConsolidationSuggestions(data, ruleFindings),
  ];

  // Phase 3: Prioritize and summarize
  const allFindings = prioritizeFindings([...ruleFindings, ...recommendationFindings]);
  const summary = generateOptimizationSummary(allFindings, data);

  return { findings: allFindings, summary };
};
```

### 3. State Persistence

Two Zustand stores, both using `persist` middleware with localStorage:

| Store | Key | Content |
|---|---|---|
| `useAuditStore` | `spendwise-audit-storage` | `AuditFormValues \| null` |
| `useFindingsStore` | `audit-findings-store` | `AuditFinding[]` |

Persistence enables page refresh resilience and cross-page state sharing without an API.

### 4. Dashboard Rendering

`app/audit/results/page.tsx`:
1. Reads `findings` from `useFindingsStore`
2. Computes derived state: `totalYearlySavings`, `criticalCount`, `quickWinCount`, `topFindings`
3. Renders KPI grid (4 cards), findings list with severity/action/priority badges, sidebar with priority breakdown and action summary

---

## The Rules Pipeline

Every rule follows the same signature:

```typescript
(data: AuditFormValues) => AuditFinding[]
```

### Rule: detectUnusedSeats

**Logic:**
```
unusedSeats = tool.seatsCount - data.teamSize
perSeatCost = tool.monthlySpend / tool.seatsCount
estimatedSavings = perSeatCost * unusedSeats
severity = unusedSeats >= 5 ? 'high' : 'medium'
```

**Example:** Team size 5, 12 ChatGPT seats at $300/mo → $25/seat → 7 unused → $175/mo waste → high severity

### Rule: detectToolMismatch

**Logic:**
```
toolMeta = TOOL_CATALOG[tool.toolId]
isSupported = toolMeta.suitableUseCases.includes(data.primaryUseCase)
if !isSupported → flag as mismatch
```

TOOL_CATALOG defines which use cases each tool supports. For example:
- `jira` supports `['coding', 'product-management', 'mixed']`
- `figma` supports `['design', 'product-management']`

A coding team paying for Figma Enterprise → mismatch.

### Rule: detectPlanMismatch (Directional)

**Logic:**
```
plan = PLAN_CATALOG[`${toolId}-${planName}`]
teamScaleRank = TEAM_SCALE_RANK[getTeamScale(teamSize)]
planTierRank = plan.tierRank
scaleDiff = planTierRank - teamScaleRank

if scaleDiff > 0:
  → OVERPROVISIONED (plan exceeds team needs)
  severity = scaleDiff >= 3 ? 'high' : scaleDiff >= 2 ? 'medium' : 'low'
  savings = tool.monthlySpend * 0.4

if scaleDiff < 0 AND teamScale === 'enterprise':
  → PLAN_MISMATCH (plan may be underpowered)
  savings = 0 (informational)
```

This is **directional** — it distinguishes between "paying too much" and "getting too little."

### Rule: detectToolOverlap

**Logic:**
```
Group tools by TOOL_CATALOG[toolId].overlapGroup
For each group with ≥2 tools:
  → DUPLICATE_TOOLING finding
  severity = group.size >= 3 ? 'high' : 'medium'
  savings = total group spend * 0.5
```

Overlap groups include:
- `ai-assistant`: ChatGPT + Claude + Gemini
- `project-management`: Jira + Linear
- `design-suite`: Figma + Tailwind + Framer Motion
- `deployment-platform`, `cloud-provider`, etc.

---

## The Recommendation Engine

Three generators that enrich the raw findings with actionable alternatives.

### generatePlanRecommendation

Uses 11 concrete downgrade paths:

| From | To | Rationale |
|---|---|---|
| ChatGPT Enterprise ($60/seat) | ChatGPT Team ($25/seat) | Same tool, lower tier |
| ChatGPT Enterprise | ChatGPT Pro ($20/seat) | Solo/startup appropriate |
| Jira Enterprise ($16/seat) | Jira Standard ($8/seat) | Small team appropriate |
| Cursor Business ($40/seat) | Cursor Pro ($20 flat) | Per-user vs flat pricing |
| Figma Enterprise ($45/seat) | Figma Pro ($12/seat) | Feature reduction |

Each path validates that the target plan's tier is within 1 rank of the team's recommended tier, preventing over-downgrading.

### generateAlternativeSuggestions

Cross-tool alternative mapping (11 entries):

| Current Tool | Alternatives |
|---|---|
| ChatGPT | Claude Pro, Cursor Pro |
| Jira | Linear Team, Notion Team |
| Kubernetes | Docker Pro, Vercel Pro |
| AWS | Vercel Pro |
| Figma | Tailwind CSS (free) |

Filters out alternatives already in use by the team to avoid suggesting a tool they already have.

### generateConsolidationSuggestions

Priority-ranked keep/remove suggestions per overlap group. Uses preference ordering:

- `ai-assistant`: Cursor > ChatGPT > Claude > Gemini > Copilot
- `project-management`: Linear > Notion > Jira
- `design-suite`: Figma > Tailwind > Framer Motion

Generates rationale strings and savings estimates (80% of removed tool spend).

---

## Prioritization System

`prioritizeFindings.ts` computes:

```
severityScore = { high: 30, medium: 20, low: 10 }
savingsScore  = { >$1000: 30, >$500: 25, >$200: 20, >$100: 15, >$50: 10, >$0: 5, $0: 0 }
complexityBonus = { consolidate/remove/simplify: 20, replace: 10, downgrade/optimize: 5 }

priorityScore = severityScore + savingsScore + complexityBonus
```

Labels:
- `critical` (≥60): Immediate action, high savings or severity
- `quick-win` (≥35): Actionable with minimal effort, good savings
- `long-term` (<35): Informational, strategic improvements

---

## State Management Architecture

### Zustand Store Design

Two independent stores with `persist` middleware:

**audit.store.ts**
```typescript
type AuditStore = {
  auditData: AuditFormValues | null;
  setAuditData: (data: AuditFormValues) => void;
  clearAuditData: () => void;
};
```

**findings.store.ts**
```typescript
type FindingsStore = {
  auditFindings: AuditFinding[];
  setAuditFindings: (findings: AuditFinding[]) => void;
};
```

Separation of concerns: form data and engine results are independent. The audit data could be used for re-auditing or comparison; findings are the output.

### Why Zustand over Redux/Context?

1. **Minimal boilerplate.** No providers, reducers, actions, or dispatch. Direct `getState`/`setState` access.
2. **Built-in persistence.** `persist` middleware works with zero configuration.
3. **Selective re-rendering.** Components subscribe to slices: `useFindingsStore(s => s.auditFindings)`.
4. **No provider nesting.** Stores are singletons. No `Provider` wrapper needed.
5. **Small bundle.** ~1KB gzip vs ~11KB for Redux Toolkit.

---

## Type Safety Strategy

### Strict Mode
TypeScript `strict: true` in tsconfig.json enables all strict checks.

### Branded Union Types
```typescript
export type UseCase =
  | 'coding' | 'ai-development' | 'devops' | 'research'
  | 'writing' | 'design' | 'product-management' | 'mixed'
  | 'startup' | 'enterprise' | 'data-analysis';
```

### Discriminated Finding Types
```typescript
type AuditFinding = {
  type: 'UNUSED_SEATS' | 'OVERPROVISIONED_PLAN' | ...;
  severity: 'low' | 'medium' | 'high';
  action: RecommendationAction;
  category: FindingCategory;
  ...
};
```

### Catalog-Driven Reasoning
Tool and plan metadata is fully typed. Invalid tool lookups return `undefined` and are handled gracefully with early `continue`.

---

## Domain Catalogs

### Plan Catalog (plan-catalog.ts)

30+ entries organized by `{toolId}-{tier}` composite keys:
```typescript
PLAN_CATALOG['chatgpt-enterprise'] = {
  id: 'chatgpt-enterprise',
  toolId: 'chatgpt',
  tier: 'enterprise',
  tierRank: 4,  // ordinal for comparison
  recommendedTeamSize: 'enterprise',
  perSeatCost: 60,
  advancedFeatures: true,
};
```

Team scale normalization:
```typescript
TEAM_SCALE_RANK: { solo: 0, startup: 1, 'small-team': 2, enterprise: 3 }
TIER_RANK: { free: 0, pro: 1, team: 2, business: 3, enterprise: 4 }
```

### Tool Catalog (tool-catalog.ts)

20 tools with category, complexity, use case support, and overlap groups:
```typescript
TOOL_CATALOG['jira'] = {
  id: 'jira',
  name: 'Jira',
  category: 'project-management',
  complexity: 'advanced',
  recommendedTeamSize: 'enterprise',
  overlapGroup: 'project-management',
};
```

---

## UI Component Architecture

### Form Page (`/audit`)

- Controlled via `react-hook-form` with `useFieldArray` for dynamic tool entries
- `zodResolver` for real-time validation
- Sidebar with live spend summary (derived from watch)
- Submit → engine → store → navigate

### Results Page (`/audit/results`)

- **State-derived rendering:** KPIs are computed from findings array, not stored separately
  - `totalYearlySavings = findings.reduce(...) * 12`
  - `criticalCount = findings.filter(p => p.priorityLabel === 'critical').length`
- **Filtering:** Client-side severity filter (`'all' | 'high' | 'medium' | 'low'`)
- **Finding cards:** Severity badge + action badge + priority badge + type + savings + description + recommendation + alternatives (collapsible)
- **Sidebar:** Priority breakdown (stacked bars) + action summary counts

### Animation Strategy

Framer Motion variants defined in `lib/motion/animation.ts`:
- `fadeInUpVariant`: 0.4s ease-out entrance
- `staggerContainerVariant`: 80ms stagger between children
- `cardAnimationVariant`: Scale + fade for list items, with 0.2s exit

Used for: form sections, findings list, empty/active state transitions.

---

## Engineering Tradeoffs

| Decision | Rationale | Cost |
|---|---|---|
| **Pure functions over classes** | Testability, composability, tree-shaking | No polymorphism for rule variants |
| **Zustand over Redux** | Minimal boilerplate, built-in persist, small bundle | No devtools middleware, no middleware chain |
| **Client-side only** | No backend = no infra cost, instant deploy | No cross-session analytics, no team accounts |
| **Catalog-driven (static JSON)** | Fast, deterministic, type-safe | Requires manual updates when tools change |
| **Flat rule pipeline** | Simple to understand and extend | No rule priority, no rule chaining |
| **No test framework yet** | Early stage, rapid iteration | Regressions possible, no CI gate |

---

## Scalability Considerations

### Current Scale
- Single-user, client-only, no API
- 20 tools, 30 plans, 12 use cases
- Analysis runs in <1ms in-browser

### Growth Path
1. **Catalog expansion:** Add entries for 100+ tools (data-driven from pricing APIs)
2. **Rule composition:** Weighted scoring, conditional rules, rule dependencies
3. **Multi-workspace:** Team accounts with aggregated analytics
4. **Scheduled auditing:** Batch processing + email reports
5. **Benchmarking:** Cross-org anonymized comparisons

### Performance Budget
- Engine: <10ms for 20 tools, <50ms for 100 tools
- Store: <100KB persisted per audit
- Bundle: <200KB JS (excluding framework)
