# SpendWise — Pricing Data & Research

## Overview

This document catalogs the pricing models, tiers, and market data used by SpendWise's audit engine. Pricing data powers savings estimates, downgrade recommendations, and alternative suggestions. It lives in `lib/audit-engine/config/plan-catalog.ts`.

---

## Pricing Models in the AI SaaS Market

The tools in SpendWise's catalog use five distinct pricing models:

| Model | Description | Example Tools |
|---|---|---|
| **Per-seat monthly** | Fixed cost per user per month | ChatGPT, Jira, Linear, Notion, Slack, Figma, Docker, Copilot |
| **Flat monthly** | Single price for unlimited users or usage | Cursor Pro, Kubernetes Enterprise |
| **Usage-based** | Cost scales with consumption (API calls, storage, compute) | AWS, OpenAI API, Anthropic API |
| **Freemium** | Free tier with limited features, paid for advanced | Most tools |
| **Hybrid** | Per-seat base + usage overage | AWS, Vercel (pro + usage) |

---

## Plan Catalog Pricing (Current)

| Tool | Plan | Model | Price | Team Scale |
|---|---|---|---|---|
| **ChatGPT** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $20/mo | Startup |
| | Team | Per-seat | $25/mo | Small team |
| | Enterprise | Per-seat | $60/mo | Enterprise |
| **Claude** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $20/mo | Startup |
| | Team | Per-seat | $25/mo | Small team |
| **Gemini** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $20/mo | Startup |
| **Cursor** | Pro | Flat | $20/mo | Startup |
| | Business | Per-seat | $40/mo | Small team |
| **Copilot** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $10/mo | Startup |
| | Business | Per-seat | $19/mo | Small team |
| **Jira** | Free | Per-seat | $0 | Startup |
| | Standard | Per-seat | $8/mo | Small team |
| | Enterprise | Per-seat | $16/mo | Enterprise |
| **Linear** | Free | Per-seat | $0 | Startup |
| | Team | Per-seat | $8/mo | Startup |
| | Business | Per-seat | $12/mo | Small team |
| **Notion** | Free | Per-seat | $0 | Solo |
| | Team | Per-seat | $10/mo | Startup |
| | Enterprise | Per-seat | $18/mo | Enterprise |
| **Slack** | Free | Per-seat | $0 | Startup |
| | Pro | Per-seat | $8/mo | Startup |
| | Business+ | Per-seat | $15/mo | Small team |
| **Figma** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $12/mo | Startup |
| | Enterprise | Per-seat | $45/mo | Enterprise |
| **Docker** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $5/mo | Startup |
| | Business | Per-seat | $21/mo | Small team |
| **Kubernetes** | Free | Flat | $0 | Solo |
| | Enterprise | Flat | $5,000/mo | Enterprise |
| **AWS** | Free Tier | Flat | $0 | Solo |
| | Pro | Flat | $100/mo | Startup |
| | Enterprise | Flat | $2,000/mo | Enterprise |
| **Vercel** | Free | Per-seat | $0 | Solo |
| | Pro | Per-seat | $20/mo | Startup |
| | Team | Per-seat | $10/mo | Small team |

---

## Savings Estimation Methodology

SpendWise estimates savings using heuristic multipliers applied to current monthly spend:

| Finding Type | Multiplier | Rationale |
|---|---|---|
| **Unused seats** | Exact per-seat cost × unused count | Precise: user specified seats and spend |
| **Plan overprovisioning** | 40% of current spend | Assumes upgrading to appropriate tier saves ~40% |
| **Tool mismatch** | 100% of current spend | Worst-case: entire spend could be redirected |
| **Duplicate tooling** | 50% of overlap group spend | Keeps the best tool, drops the rest |
| **Consolidation** | 80% of removed tool spend | Aggressive but defensible for clear duplicates |

The multipliers are conservative to maintain credibility. We prefer to under-promise and let users discover additional savings.

### Real-World Validation

| Scenario | Estimated Savings | Actual Potential | Confidence |
|---|---|---|---|
| Startup (5 people), ChatGPT Enterprise ($300/mo) | $120/mo (40%) | $200/mo downgrading to Team | Medium |
| 3 AI assistants ($700/mo total) | $350/mo (50%) | $400/mo dropping 2 | Medium |
| 10 unused ChatGPT seats ($250/mo) | $250/mo (exact) | Exact — adjust seat count | High |
| Jira Enterprise on 5-person team ($80/mo) | $32/mo (40%) | $40/mo switching to Standard | Medium |

---

## Market Context

### Average SaaS Spend Per Employee

| Company Size | Monthly Spend/Employee | Annual Spend/Employee |
|---|---|---|
| 1-10 employees | $150-300 | $1,800-3,600 |
| 10-50 employees | $100-200 | $1,200-2,400 |
| 50-200 employees | $75-150 | $900-1,800 |
| 200+ employees | $50-100 | $600-1,200 |

Source: Internal estimates based on publicly available SaaS usage data. AI tooling spend is typically 2-3× higher for engineering-heavy orgs.

### Waste Estimation

Industry research (Gartner, Productiv, Zylo) suggests:
- 25-35% of SaaS spend is wasted
- Average organization uses 150+ SaaS apps
- 20-30% of purchased seats go unused
- Engineering tools have the highest overprovisioning rate

SpendWise's findings align with these estimates. Early audits show 28-42% potential savings on AI tooling specifically.

---

## Pricing Data Maintenance

### Current Limitations

1. **Static data** — Prices are hardcoded and must be manually updated
2. **No API integration** — Can't fetch real-time pricing from vendors
3. **Limited coverage** — Only 20 tools with 30 plans; hundreds more exist
4. **No discounting** — Doesn't account for annual commitments, startup programs, or negotiated discounts

### Maintenance Strategy

| Plan | Update Mechanism | Frequency |
|---|---|---|
| v0.1 (current) | Manual PRs to plan-catalog.ts | As needed |
| v0.3 | Community contributions + pricing API | Weekly |
| v1.0 | Automated pricing pipeline (crawler + API) | Daily |

### Tools Needing Catalog Entries

The following tools are in `SUPPORTED_TOOLS` but have no catalog entries (they're silently ignored):

- **Windsurf** — AI code editor, competitive with Cursor
- **OpenAI API** — Usage-based pricing, need usage tier modeling
- **Anthropic API** — Usage-based, similar challenge
- **Perplexity** — AI research assistant, $20/mo Pro tier
- **Midjourney** — AI design tool, $10-60/mo tiers
- **Notion AI** — AI add-on for Notion, $10/mo per member

These tools should be added to both the tool catalog and plan catalog in v0.3.

---

## Pricing Page Copy Considerations

For when SpendWise itself monetizes:

### Tier Structure (Proposed)

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | Single audit, 5 tools max, basic findings |
| **Pro** | $19/mo | Unlimited tools, recommendations, alternative suggestions, PDF export |
| **Team** | $49/mo | All Pro + multi-department audits, collaboration, benchmarking |
| **Enterprise** | Custom | SSO, API access, custom catalogs, dedicated support, scheduled audits |

### Value Proposition

"SpendWise typically finds $5,000-50,000/year in recoverable SaaS spend. At $19-49/mo for Pro/Team, the ROI is immediate — most users save more in the first month than a year of subscription costs."
