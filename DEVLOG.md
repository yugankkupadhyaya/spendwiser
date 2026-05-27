# SpendWise — Development Log

## v0.1.0 — Initial Prototype

### Motivation

The AI tooling landscape has exploded. Engineering teams routinely subscribe to 5-15 SaaS tools — ChatGPT, Claude, Cursor, Copilot, Jira, Linear, Slack, Vercel, AWS, and more. Each has its own pricing model (per-seat, flat, usage-based), tier structure (free → enterprise), and ideal team scale.

We observed a pattern: most teams are overprovisioned. A 5-person startup running ChatGPT Enterprise ($60/seat) and Jira Enterprise ($16/seat) is burning ~$4,500/year on features they don't need. Multiple AI assistants are subscribed simultaneously. Unused seats accumulate silently.

SpendWise was built to solve this — a deterministic audit engine that analyzes SaaS configuration data and produces prioritized, actionable optimization recommendations. No API keys, no credential scanning, no backend. Just a form and a rules engine.

---

### Phase 1: Core Engine (Days 1-3)

**Goal:** Build a working audit engine that detects unused seats, tool mismatches, and plan mismatches.

**Architecture decisions:**
- Pure functions over classes for rules
- Flat array pipeline: rules execute independently and results merge
- Domain catalogs as static TypeScript records
- Zustand for state (minimal boilerplate, built-in persist)

**Rule implementations:**

1. `detectUnusedSeats` — Simplest rule. Compare `seatsCount` to `teamSize`. If seats > team, flag it. Severity scales with magnitude of waste.

2. `detectToolMismatch` — Compare each tool's `suitableUseCases` (from TOOL_CATALOG) against the team's `primaryUseCase`. If the tool isn't designed for the workflow, flag it.

3. `detectPlanMismatch` — Initially used simple equality: `plan.recommendedTeamSize !== teamScale`. This was a bug: it didn't distinguish overprovisioning from underpowering.

**Bug discovered:** The plan catalog lookup was broken. `PLAN_CATALOG[tool.planName.toLowerCase()]` tried to match plan IDs like `'chatgpt-team'` against form values like `'team'`. Fixed by using composite key `{toolId}-{planName}`.

**UI decisions:**
- Dark theme (dark mode is standard for dev tools)
- Framer Motion for micro-interactions
- Lucide icons (small bundle, good coverage)
- Sonner for toast notifications

---

### Phase 2: Results Dashboard (Days 3-5)

**Goal:** Present audit findings in a clear, actionable dashboard.

**Key decisions:**
- Four KPI cards: Annual Savings, Findings Count, High Priority, Optimization Score
- Severity-based filtering (all/high/medium/low)
- Sidebar with savings breakdown bars + priority recommendations
- Empty state for clean audits (green checkmark, "fully optimized")

**Derived state pattern:**
```typescript
const totalYearlySavings = findings.reduce(...) * 12;  // not stored, computed
const infrastructureHealthScore = Math.max(30, 100 - findings.length * 15);
```

All KPIs are derived from the findings array. No separate KPI store. This means the dashboard is always consistent — no stale KPI data.

**Animation decisions:**
- staggerChildren for tool cards (80ms delay)
- fadeInUp for sections
- scale + opacity for list exit animations

---

### Phase 3: Recommendation Intelligence (Days 5-8)

**Goal:** Evolve from static recommendation strings to a true recommendation engine with alternatives, overlap detection, and prioritization.

**New modules:**
- `recommendations/generatePlanRecommendation.ts` — 11 downgrade paths
- `recommendations/generateAlternativeSuggestions.ts` — 11 cross-tool alternative mappings
- `recommendations/generateConsolidationSuggestions.ts` — Preference-ordered keep/remove suggestions
- `recommendations/prioritizeFindings.ts` — Scoring engine with labels
- `generate-optimization-summary.ts` — Dynamic prose summary

**Plan catalog expansion:** From 8 entries to 30+ entries covering ChatGPT, Claude, Gemini, Cursor, Copilot, Jira, Linear, Notion, Slack, Figma, Docker, Kubernetes, AWS, Vercel.

**Key insight from building alternatives:** The most valuable recommendation isn't "downgrade your plan" — it's "use a different tool entirely." A startup on Jira Enterprise ($16/seat) will save more by switching to Linear ($8/seat) than by downgrading to Jira Standard ($8/seat), and they'll get a better developer experience.

**Prioritization formula:**
```
priorityScore = severityScore (30/20/10)
              + savingsScore (5-30 based on amount)
              + complexityBonus (20 for consolidation, 10 for replace, 5 for downgrade)
```

Simple but effective. Consolidation recommendations score highest because they address both cost AND complexity.

---

### Phase 4: Overlap Detection (Days 8-9)

**Goal:** Detect duplicate tooling (multiple AI assistants, multiple PM tools).

**Implementation:**
- Added `overlapGroup` field to `ToolCatalogEntry`
- New rule `detectToolOverlap` groups tools by overlap group, flags groups with ≥2 members
- Consolidation suggestions generator provides keep/remove recommendations with preference ordering

**Design tension:** How aggressive should overlap detection be? Some teams legitimately use both ChatGPT and Claude for different strengths. Our compromise: flag overlaps as medium severity by default, high severity only when 3+ tools overlap.

---

## Engineering Decisions — Retrospective

### Why Pure Functions?

**Decision:** All rules are `(data: AuditFormValues) => AuditFinding[]`.

**Pros:**
- Trivially testable: `expect(detectUnusedSeats(testData)).toEqual(expectedFindings)`
- Composable: rules can be combined in any order
- No mocking needed: just pass a data object

**Cons:**
- No shared state between rules (unused seats can't influence plan mismatch detection)
- Data must be passed explicitly to every rule

**Verdict:** Correct decision for this stage. If rule interdependency becomes necessary, we can introduce a shared context object.

### Why Zustand?

**Decision:** Zustand with persist middleware for state management.

**Tradeoffs:**
- ~1KB gzip vs ~11KB for Redux Toolkit
- No provider wrapper needed — stores are singletons
- Built-in persist with localStorage — zero config
- No middleware chain for logging/analytics

**Alternative considered:** React Context + useReducer. Rejected because:
- Provider nesting becomes unwieldy with multiple stores
- No built-in persistence
- Re-render optimization requires manual memoization

**Verdict:** Zustand is the right choice for a client-only app with 2 stores and simple state shapes.

### Why Deterministic Heuristics Over ML?

**Decision:** All rules use ordinal comparisons, catalog lookups, and arithmetic — no ML.

**Rationale:**
1. **Explainability:** Every finding must be traceable to a specific data point. "Your plan tier rank (4) exceeds your team scale rank (1) by 3" is explainable. "Our neural network detected an anomaly" is not.
2. **No training data:** We don't have thousands of labeled audits.
3. **Determinism:** Same input → same output, always. ML models can drift.
4. **Bundle size:** A rules engine is a few KB. Even a small ONNX model would be 5-10MB.
5. **User trust:** Enterprise buyers need to understand and verify recommendations.

**Ambition:** If we accumulate thousands of anonymized audits, we could layer ML on top of the deterministic engine for:
- Anomaly detection (unusual spend patterns)
- Savings prediction confidence scoring
- Peer benchmarking ("teams like yours save X% by switching to Y")

### Why Client-Only Architecture?

**Decision:** No backend. No API. No database. Everything runs in the browser.

**Rationale:**
1. **Zero infrastructure:** No servers, no databases, no deployment costs.
2. **Privacy:** Form data never leaves the browser. No compliance overhead.
3. **Speed:** Instant load (static generation). No network latency for analysis.
4. **Distribution:** Static export to Vercel/Netlify. Single page works offline.

**Limitations:**
- No cross-session analytics
- No team collaboration
- No scheduled or batch auditing
- No pricing API integration (must update catalog manually)

**Verdict:** Right for v0.1. Moving to a backend API is the natural next step for v1.0.

---

## Bug Log

### BUG-001: Plan catalog lookup broken
- **Symptoms:** `detectPlanMismatch` never produced findings
- **Root cause:** Lookup used `tool.planName.toLowerCase()` as key, but catalog keys are `{toolId}-{tier}`
- **Fix:** Changed to `PLAN_CATALOG[`${toolId}-${planName.toLowerCase()}`]`
- **Lesson:** Composite key patterns must match between form and catalog

### BUG-002: Non-directional plan comparison
- **Symptoms:** Plan mismatch flagged enterprise teams using free plans (not actually a problem)
- **Root cause:** Simple inequality check `recommendedScale !== teamScale`
- **Fix:** Directional comparison with tier rank deltas; separate overprovisioned from underpowered
- **Lesson:** Ordinal comparisons must be directional

### BUG-003: Stale persisted findings
- **Symptoms:** After type changes, old persisted findings are missing new fields
- **Root cause:** Zustand persist stores raw JSON; type changes break shape
- **Mitigation:** UI handles missing fields with `??` defaults
- **Fix:** Add store versioning for future migrations

---

## Roadmap

### v0.2 (Current)
- [x] Unused seat detection
- [x] Tool mismatch detection
- [x] Plan mismatch detection (directional)
- [x] Tool overlap detection
- [x] Downgrade path recommendations
- [x] Alternative tool suggestions
- [x] Consolidation suggestions
- [x] Prioritization scoring
- [x] Optimization summary
- [ ] Test suite (Vitest)
- [ ] CI pipeline (GitHub Actions)

### v0.3 — Expanded Intelligence
- [ ] Pricing API integration (real-time tool pricing)
- [ ] 100+ tool catalog entries
- [ ] Usage-based billing detection
- [ ] Free-to-paid conversion analysis
- [ ] Per-seat vs flat-rate cost comparison
- [ ] Annual vs monthly commitment analysis

### v0.4 — Multi-Workspace
- [ ] Backend API (Node.js or Edge)
- [ ] Team accounts with invite flow
- [ ] Aggregated multi-department audits
- [ ] Historical trend tracking
- [ ] Export reports (PDF, CSV, Slack)

### v1.0 — Production
- [ ] Scheduled recurring audits
- [ ] Email alerts for spend anomalies
- [ ] Benchmarking against anonymized peers
- [ ] API for integration with procurement tools
- [ ] Audit trail and action tracking
- [ ] Role-based access control
