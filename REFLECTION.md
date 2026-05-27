# SpendWise — Engineering Reflection

## What We Built

SpendWise is a deterministic SaaS optimization engine that analyzes organizational AI tooling configurations and produces prioritized, actionable recommendations. It runs entirely in the browser, has zero backend dependencies, and produces results in milliseconds.

The core insight: most engineering teams are burning money on overprovisioned SaaS subscriptions, and they know it — but they don't have a systematic way to analyze their stack. Spreadsheets are fragile. Gut checks are unreliable. Dedicated procurement tools are expensive and require backend integration.

SpendWise fills the gap: a lightweight, privacy-first audit that takes 3 minutes and produces procurement-grade analysis.

---

## What Went Well

### 1. The Rule Pipeline Pattern
The flat array pipeline (`rules → generators → prioritizer`) is simple, extensible, and testable. Adding a new rule requires:
1. Create a file in `rules/`
2. Export a function with signature `(data: AuditFormValues) => AuditFinding[]`
3. Add to the pipeline in `run-audit-engine.ts`

No dependency injection. No configuration. No registration pattern.

```typescript
// Adding a new rule is a 3-step process
// 1. Write the function
export const detectNewThing = (data: AuditFormValues): AuditFinding[] => { ... };

// 2. Add to orchestrator
const ruleFindings = [
  ...detectUnusedSeats(data),
  ...detectNewThing(data),  // <-- one line
];
```

This made the Phase 3 expansion (adding 3 generators and 1 rule) straightforward.

### 2. The Catalog-Driven Architecture
Tool and plan metadata lives in typed catalogs, not scattered across the codebase. This means:
- Adding a new tool: add entry to `TOOL_CATALOG` and entries to `PLAN_CATALOG`
- Changing pricing: edit one value in one file
- Adding overlap groups: edit one field in one entry

The catalogs are the source of truth for the entire engine. Rules don't hardcode tool names or prices.

### 3. Deterministic Priorities
The prioritization formula (`severityScore + savingsScore + complexityBonus`) is transparent and debuggable. We can explain to a user why a finding scored 72 ("critical") vs 28 ("long-term"):
- 30 points from high severity (3+ overlapping tools)
- 20 points from $600/mo estimated savings
- 22 points from consolidation complexity bonus

This is crucial for enterprise trust. Black-box scoring would be a dealbreaker.

### 4. Client-Only Architecture for v0
Shipping without a backend forced simplicity. No database schema design. No API versioning. No auth. No rate limiting. The entire product is:
- One form page
- One engine module
- One dashboard page

This let us focus entirely on the audit logic and UX. A backend can be added later as a conscious investment, not a default assumption.

---

## What We'd Do Differently

### 1. Test-First Development
We built the entire engine without a single test file. This was a mistake. The plan catalog lookup bug (BUG-001) would have been caught by a simple test:
```typescript
it('detects enterprise plan for small team', () => {
  const data = { teamSize: 3, primaryUseCase: 'coding', tools: [{ toolId: 'chatgpt', planName: 'enterprise', monthlySpend: 600, seatsCount: 3 }] };
  const findings = detectPlanMismatch(data);
  expect(findings).toHaveLength(1);
  expect(findings[0].type).toBe('OVERPROVISIONED_PLAN');
});
```

We're prioritizing test infrastructure (Vitest) for v0.2.

### 2. Store Versioning
Zustand's persist middleware is excellent — until you change the type shape. We added fields to `AuditFinding` (action, category, priorityScore, priorityLabel) and old persisted data broke silently.

A store version with migration would prevent this:
```typescript
persist(
  (set) => ({ ... }),
  {
    name: 'audit-findings-store',
    version: 2,
    migrate: (persistedState, version) => {
      if (version === 1) return applyV1toV2Migration(persistedState);
      return persistedState as FindingsStore;
    },
  }
);
```

### 3. More Conservative Initial Scope
The initial `AuditFinding` type included `OVERPROVISIONED_PLAN` and `DUPLICATE_TOOLING` types that weren't emitted by any rule. These were aspirational types that created dead code. Better to start minimal and add types only when the corresponding rule exists.

### 4. Plan Form UX
The plan selector uses generic tier names (Free, Pro, Team, Business, Enterprise) — but not all tools have all tiers. A better UX would show tool-specific plan names (ChatGPT Free, ChatGPT Pro, ChatGPT Team, ChatGPT Enterprise) filtered by the selected tool. This would also make the catalog lookup more intuitive.

---

## Technical Debt

### 1. No Test Infrastructure
**Severity:** High
**Impact:** Regressions are detected manually
**Fix:** Add Vitest, write tests for all rules and generators

### 2. Static Pricing Data
**Severity:** Medium
**Impact:** Pricing becomes stale; savings estimates drift
**Fix:** Pricing API integration or a data pipeline

### 3. Unused Constants
**Severity:** Low
**Impact:** `windsurf`, `mongodb-atlas`, `openai-api`, `anthropic-api`, `notion-ai`, `perplexity`, `midjourney` are in `SUPPORTED_TOOLS` but have no catalog entries. They're silently ignored by the engine.
**Fix:** Either remove them or add catalog entries.

### 4. No Rule Priority
**Severity:** Low
**Impact:** All rules run in arbitrary order
**Fix:** Add rule metadata for execution order, dependencies, and enable/disable flags

---

## Lessons Learned

### On SaaS Pricing
There is no standard pricing model. ChatGPT charges per seat ($20-60/mo). Cursor charges flat per user ($20/mo). AWS charges usage-based. Kubernetes is free but requires $5K/mo in ops labor. Docker is cheap ($5-21/seat). This variety makes automated analysis hard — every tool needs custom pricing logic.

### On Team Scale
"Enterprise" in the SaaS world means very different things:
- Atlassian Jira Enterprise: $16/seat, full admin controls
- OpenAI ChatGPT Enterprise: $60/seat, unlimited usage, data privacy
- Figma Enterprise: $45/seat, design systems, branching

A "startup" on ChatGPT Enterprise ($60/seat) is overprovisioned. An "enterprise" on Docker Free is probably fine. Scale normalization requires per-tool context.

### On Duplicate Tooling
The most common duplication pattern is AI assistants. Teams subscribe to ChatGPT AND Claude AND Gemini "to compare them" — and never cancel the losers. Our overlap detection catches this, but the recommendation is delicate: we don't want to pick favorites. We suggest keeping the one with best use case alignment.

### On User Trust
We learned that users don't trust savings estimates that seem too high. Our initial estimates were aggressive (100% of spend for tool mismatch). We dialed them back:
- Overprovisioning: 40% of spend (you might need some features)
- Duplicate tools: 50% of overlap spend (you need at least one)
- Consolidation: 80% of removed tool spend (aggressive but defensible)

Conservative estimates build credibility.

---

## Future Ambitions

### ML-Augmented Engine
The deterministic engine is a foundation, not a ceiling. With thousands of anonymized audits, we could train:
- A classifier that predicts savings confidence based on similarity to past audits
- An anomaly detector that flags unusual spend patterns
- A peer benchmarking engine ("teams like yours save 34% by switching to Linear")

But ML would augment, not replace, the deterministic rules. Explanation and auditability are non-negotiable.

### Pricing API Integration
Static pricing data is the biggest maintenance burden. A pricing API (or a community-maintained pricing database) would:
- Keep savings estimates current
- Enable "free → paid" conversion analysis
- Support annual vs monthly comparison
- Enable per-seat vs flat-rate optimization

### Multi-Workspace Analytics
The most valuable feature for procurement teams: aggregated analysis across departments, locations, or cost centers. "Engineering is burning $12K/mo on AI tools. Design is burning $4K/mo. Here's the optimization potential for each."
