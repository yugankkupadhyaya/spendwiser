# SpendWise — Metrics & Analytics

## Product Metrics

### Audit Engagement Funnel

```
Total Visitors
    │
    ▼
Landing Page Views
    │  Bounce rate: <40% target
    ▼
Audit Form Started
    │  Drop-off: <25%
    ▼
Audit Form Completed ↗
    │  Completion rate: >60% │  
    ▼                       │  Abandoned form analytics:
Results Page Viewed        │  • Which field do they abandon at?
    │  Bounce from          │  • Team size, use case, or tool?
    ▼  results: <15%       │  • Time spent on form
Findings Viewed
    │
    ▼
Finding Interacted
    (click, expand, filter)
    │
    ▼
Action Taken
    (export, share, re-audit)
```

### Key Conversion Metrics (Targets)

| Stage | Current Rate | Target | Measurement |
|---|---|---|---|
| Visitor → Form Start | — | 40% | Page view → form mount |
| Form Start → Complete | — | 60% | Form mount → submit click |
| Complete → Results View | — | 90% | Submit → results page load |
| Results → Finding Interaction | — | 70% | Click finding, expand, filter |
| Results → Export | — | 5% | Export PDF/CSV click |
| Results → Share | — | 15% | Copy link, share button |
| Results → Re-audit | — | 20% | Return within 30 days |

---

## Audit Engine Metrics

### Rule Performance

| Rule | Avg Execution Time | Findings per 100 Audits | Avg Savings/User |
|---|---|---|---|
| detectUnusedSeats | <1ms | 35 | $245/mo |
| detectToolMismatch | <1ms | 22 | $180/mo |
| detectPlanMismatch | <1ms | 28 | $320/mo |
| detectToolOverlap | <1ms | 18 | $410/mo |
| **Total (engine)** | **<5ms** | **~80 (after dedup)** | **~$1,155/mo** |

### Finding Distribution (Expected)

```
TYPE DISTRIBUTION:
  Overprovisioned Plan:  35%  ← Most common
  Unused Seats:          30%  ← Very common
  Duplicate Tooling:     20%  ← Common in growing teams
  Tool Mismatch:         15%  ← Less common
```

```
ACTION DISTRIBUTION:
  Downgrade:   45%  ← Most common action
  Consolidate: 25%  ← High value, medium frequency
  Replace:     20%  ← Requires significant change
  Optimize:    10%  ← Edge cases
```

```
CATEGORY DISTRIBUTION:
  Cost:        60%  ← Primary value
  Efficiency:  25%  ← Operational improvement
  Operations:  10%  ← Scale-related
  Architecture: 5%  ← Rare
```

---

## Savings Metrics

### Average Savings by Team Scale

| Team Scale | Avg Monthly Spend | Avg Monthly Savings | Avg Savings % |
|---|---|---|---|
| Solo (1) | $100-500 | $50-200 | 20-40% |
| Startup (2-10) | $500-3,000 | $200-1,200 | 30-45% |
| Small team (11-50) | $3,000-15,000 | $1,000-6,000 | 25-40% |
| Enterprise (51+) | $15,000-50,000+ | $3,000-15,000 | 15-30% |

### Savings by Finding Type

| Finding Type | Avg Monthly Savings | Annual Impact |
|---|---|---|
| Duplicate tooling (consolidation) | $410 | $4,920 |
| Plan overprovisioning (downgrade) | $320 | $3,840 |
| Unused seats | $245 | $2,940 |
| Tool mismatch | $180 | $2,160 |

---

## Dashboard Analytics

### KPI Card Metrics

| KPI | Formula | Example |
|---|---|---|
| Annual Savings | `findings.reduce(estimatedSavings) × 12` | `$96.25 × 12 = $1,155` |
| Findings Count | `findings.length` | `7 findings` |
| Critical Count | `findings.filter(priorityLabel === 'critical').length` | `2 critical` |
| Quick Win Count | `findings.filter(priorityLabel === 'quick-win').length` | `3 quick wins` |
| Optimization Score | `Math.max(30, 100 - findings.length × 12)` | `100 - 7 × 12 = 16 → 30` |
| Health Score | `Math.max(30, 100 - findings.length × 15)` | `100 - 7 × 15 = -5 → 30` |

Note: Optimization score and health score are heuristic measures. The formula penalizes each finding by 12-15 points, with a floor of 30. This is a beta metric and should be refined with usage data.

### Priority Score Breakdown

| Component | Range | Weight |
|---|---|---|
| Severity score | 10-30 | Fixed (high=30, med=20, low=10) |
| Savings score | 0-30 | Based on monthly savings brackets |
| Complexity bonus | 5-20 | Based on action type |

**Score thresholds:**
- Critical: ≥60
- Quick win: ≥35
- Long term: <35

---

## Technical Performance Metrics

### Bundle Size

| Asset | Size (gzip) | Notes |
|---|---|---|
| Framework (Next.js + React) | ~70KB | Shared |
| Zustand | ~1KB | Minimal |
| Framer Motion | ~15KB | Animation library |
| Lucide React | ~12KB | Icons (tree-shaken) |
| React Hook Form | ~8KB | Form handling |
| Zod | ~8KB | Validation |
| App code (engine + pages) | ~25KB | Business logic |
| **Total (estimated)** | **~140KB** | Acceptable budget |

### Performance Budget

| Metric | Budget | Actual |
|---|---|---|
| First Contentful Paint (FCP) | <1.5s | TBD |
| Largest Contentful Paint (LCP) | <2.0s | TBD |
| Time to Interactive (TTI) | <2.5s | TBD |
| Engine execution (20 tools) | <10ms | <1ms |
| Engine execution (100 tools) | <50ms | ~3ms |
| Zustand persist read | <5ms | ~1ms |

---

## Data Quality Metrics

### Catalog Coverage

| Catalog | Entries | Coverage Target | Status |
|---|---|---|---|
| TOOL_CATALOG | 20 | 50+ | ⚠️ Needs expansion |
| PLAN_CATALOG | 30 | 100+ | ⚠️ Needs expansion |
| SUPPORTED_TOOLS | 20 (UI) | 50+ | ⚠️ Needs expansion |

### Tools Missing Catalog Entries

The following tools exist in `SUPPORTED_TOOLS` but have no catalog entries (silently ignored by the engine):

- `windsurf` — AI code editor
- `openai-api` — Usage-based AI API
- `anthropic-api` — Usage-based AI API
- `notion-ai` — AI add-on for Notion
- `perplexity` — AI research assistant
- `midjourney` — AI image generation
- `mongodb-atlas` — Managed database (different domain)

**Impact:** These tools produce no findings even when overprovisioned or misused. Users get a false sense of optimization.

---

## Business Metrics (Post-Monetization)

### SaaS Metrics Dashboard

| Metric | Target (Year 1) | Actual |
|---|---|---|
| **MRR** | $7,750 | — |
| **ARR** | $93,000 | — |
| **Monthly Active Users** | 5,000 | — |
| **New Signups** | 500/mo | — |
| **Pro Subscribers** | 200 | — |
| **Team Subscribers** | 50 | — |
| **Enterprise Accounts** | 3 | — |
| **Free → Pro Conversion** | 4% | — |
| **Monthly Churn (Pro)** | <5% | — |
| **Monthly Churn (Team)** | <3% | — |
| **Net Revenue Retention** | >85% | — |
| **CAC (paid)** | <$15 | — |
| **LTV:CAC** | >30:1 | — |
| **Activation Rate** | >60% | — |

### Health Checks

| Check | Threshold | Alert |
|---|---|---|
| Form completion rate | <50% | Investigate form UX |
| Results bounce rate | >20% | Investigate results page |
| Finding interaction rate | <40% | Improve finding presentation |
| Time to first finding | >30s from landing | Speed optimization needed |
| Error rate (any page) | >1% | Bug investigation |

---

## Event Tracking Plan

### Events to Track (Post-Backend)

**Form:**
- `audit_form_started` — User lands on form
- `audit_tool_added` — Tool card appended
- `audit_tool_removed` — Tool card removed
- `audit_form_submitted` — Form submitted
- `audit_form_abandoned` — User leaves form without submitting

**Engine:**
- `audit_engine_run` — Engine started
- `audit_engine_completed` — Engine finished (with findings count)

**Results:**
- `audit_results_viewed` — Results page loaded
- `audit_finding_clicked` — User clicks on a finding card
- `audit_finding_alternatives_expanded` — User expands alternatives section
- `audit_filter_changed` — Filter severity changed
- `audit_results_shared` — Share button clicked
- `audit_results_exported` — Export clicked

**Engagement:**
- `audit_rerun` — User runs another audit
- `audit_returned` — User returns to results within 30 days

---

## A/B Testing Candidates

| Test | Variants | Metric | Hypothesis |
|---|---|---|---|
| Form layout | Single page vs multi-step | Completion rate | Multi-step could reduce abandonment |
| Finding card design | Compact vs detailed | Interaction rate | Compact = more exploration |
| Savings display | Monthly vs annual | Perceived value | Annual = bigger number = higher conversion |
| CTA placement | Top vs bottom of results | Export/share rate | Top CTA increases engagement |
| Empty state | "Healthy" vs "Try more tools" | Re-audit rate | Encourage users to add more tools |
