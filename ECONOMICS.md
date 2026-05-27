# SpendWise — SaaS Economics

## Unit Economics

### Cost Structure (Current — v0.1)

| Cost Item | Monthly | Annual | Notes |
|---|---|---|---|
| **Hosting** (Vercel) | $0 | $0 | Static site, free tier |
| **Domain** (spendwise.app) | $0 | $12 | Annual registration |
| **Developer time** (1 FTE) | $15,000 | $180,000 | Opportunity cost |
| **Total (current)** | $15,000* | $180,012 | *Fully loaded cost with developer |

### Projected Cost Structure (v0.3 — Paid)

| Cost Item | Monthly | Annual | Notes |
|---|---|---|---|
| **Vercel Pro** | $20 | $240 | Analytics, team features |
| **Database** (Neon/PlanetScale) | $0 | $0 | Free tier for initial users |
| **Email** (Resend) | $0 | $0 | 100 emails/day free |
| **Auth** (Clerk) | $0 | $0 | 5,000 MAU free tier |
| **Google Ads** | $2,000 | $24,000 | Paid acquisition |
| **Developer** (1 FTE) | $15,000 | $180,000 | |
| **Total** | $17,020 | $204,240 | |

### Projected Cost Structure (v1.0 — Scale)

| Cost Item | Monthly | Annual |
|---|---|---|
| **Vercel Enterprise** | $500 | $6,000 |
| **Database** (PlanetScale) | $400 | $4,800 |
| **Email** (Resend) | $100 | $1,200 |
| **Auth** (Clerk) | $200 | $2,400 |
| **CDN/Storage** | $100 | $1,200 |
| **Marketing** | $10,000 | $120,000 |
| **Team** (2-3 FTEs) | $40,000 | $480,000 |
| **Total** | $51,300 | $615,600 |

---

## Revenue Model

### Pricing Tiers

| Tier | Price | Target Users | Est. Conversion |
|---|---|---|---|
| **Free** | $0 | All (acquisition funnel) | 100% of traffic |
| **Pro** | $19/mo ($190/yr) | Individual power users | 4% of free users |
| **Team** | $49/mo ($490/yr) | Small teams (2-10) | 1% of free users |
| **Enterprise** | Custom (~$500/mo) | Large orgs | <0.5% of free users |

### Revenue Projection (Conservative)

```
Year 1:
  Monthly audits: 5,000
  Free users: 4,750 (95%)
  Pro subscribers: 200 (4% × 5,000 × 12 months ÷ 12 = lagging)
  Team subscribers: 50
  Enterprise accounts: 3

  Monthly revenue: (200 × $19) + (50 × $49) + (3 × $500)
                   = $3,800 + $2,450 + $1,500
                   = $7,750/mo
  Annual revenue: ~$93,000

Year 2:
  Monthly audits: 50,000
  Free users: 47,500
  Pro subscribers: 2,000
  Team subscribers: 500
  Enterprise accounts: 20

  Monthly revenue: (2,000 × $19) + (500 × $49) + (20 × $500)
                   = $38,000 + $24,500 + $10,000
                   = $72,500/mo
  Annual revenue: ~$870,000
```

### Unit Economics

| Metric | Pro | Team | Enterprise |
|---|---|---|---|
| **Price (monthly)** | $19 | $49 | $500 |
| **Price (annual)** | $190 | $490 | $6,000 |
| **Gross margin** | 85% | 85% | 90% |
| **CAC (paid)** | $15 | $25 | $150 |
| **CAC (organic)** | $2 | $5 | $50 |
| **Months to recover CAC** | 0.8 | 0.5 | 0.3 |
| **Average LTV** | $570 (30mo) | $1,470 (30mo) | $15,000 (30mo) |
| **LTV:CAC (paid)** | 38:1 | 59:1 | 100:1 |
| **LTV:CAC (organic)** | 285:1 | 294:1 | 300:1 |

---

## Burn Rate & Runway

### Current (v0.1 — Pre-Revenue)

| Item | Amount |
|---|---|
| Monthly burn (cash) | $0 (no paid infra) |
| Monthly burn (fully loaded) | $15,000 (developer time) |
| Runway | Unlimited (no outside funding) |
| Revenue | $0 |
| Path to revenue | v0.3 (~3 months) |

### With Paid Acquisition (v0.3+)

| Scenario | Monthly | ARR |
|---|---|---|
| **Conservative** | $7,750 | $93,000 |
| **Moderate** | $15,000 | $180,000 |
| **Aggressive** | $30,000 | $360,000 |

Breakeven with a single developer: ~$15,000/mo in revenue (~800 Pro subscribers or equivalent mix).

---

## SaaS Metrics Targets

### Growth Metrics

| Metric | Target (Year 1) | Target (Year 2) |
|---|---|---|
| **Monthly Active Users** | 5,000 | 50,000 |
| **New signups/month** | 500 | 5,000 |
| **Organic traffic** | 80% | 70% |
| **Paid traffic** | 20% | 30% |
| **Activation rate** (% who complete audit) | 60% | 70% |
| **Finding rate** (% with at least 1 finding) | 80% | 80% |

### Engagement Metrics

| Metric | Target |
|---|---|
| **Sessions per user/month** | 3 |
| **Time on results page** | 120s+ |
| **Share rate** (% who share results) | 15% |
| **Return rate** (% who audit again within 30 days) | 20% |
| **Export rate** (% who export PDF/CSV) | 5% |

### Revenue Metrics

| Metric | Target (Year 1) | Target (Year 2) |
|---|---|---|
| **MRR** | $7,750 | $72,500 |
| **ARR** | $93,000 | $870,000 |
| **Free → Pro conversion** | 4% | 6% |
| **Monthly churn (Pro)** | 5% | 3% |
| **Monthly churn (Team)** | 3% | 2% |
| **Net Revenue Retention** | 85% | 95% |
| **Average Revenue Per User (ARPU)** | $1.55 (blended) | $1.45 (blended) |

---

## Pricing Research

### Willingness to Pay

Based on competitor pricing and our user research:

| Segment | Price Sensitivity | Optimal Price Point |
|---|---|---|
| **Individual developer** | High | $9-19/mo |
| **Engineering team (5-20)** | Medium | $29-49/mo |
| **Startup (< 50 people)** | Medium | $49-99/mo |
| **Mid-market (50-500)** | Low | $200-500/mo |
| **Enterprise (500+)** | Very Low | $1,000+/mo |

### Competitive Pricing Benchmark

| Competitor | Entry Price | Mid-Tier | Enterprise |
|---|---|---|---|
| **Productiv** | N/A | N/A | $50K+/yr |
| **Zylo** | N/A | N/A | $40K+/yr |
| **Torii** | N/A | $10K/yr | Custom |
| **G2 Track** | Free | $99/mo | Custom |
| **SpendWise** | Free | $19/mo | Custom |

SpendWise is 10-100× cheaper than incumbents, targeting the unserved SMB market.

---

## Funding Strategy

### Bootstrapping (Current Path)

**Advantages:**
- Full ownership and control
- No pressure to grow at any cost
- Can focus on product quality
- Sustainable, profitable from day 1 of paid tier

**Disadvantages:**
- Slower growth
- Limited marketing budget
- Harder to hire

### Venture-Backed (Alternative Path)

If growth metrics show strong PMF (20%+ monthly growth, 50+ NPS):

**Ask:** $1.5M seed
**Use of funds:**
- 2 engineering hires ($300K)
- Marketing/sales ($200K)
- Infrastructure ($50K)
- 24-month runway

**Investor pitch metrics:**
- $93K ARR with $0 marketing spend
- 38:1 organic LTV:CAC
- 80%+ activation rate
- 0% churn (free product, pre-monetization)

---

## Risk Factors

### Downside Risks

| Risk | Probability | Mitigation |
|---|---|---|
| **Low conversion to paid** | Medium | Freemium with clear value gap; team features justify upgrade |
| **Catalog maintenance burden** | High | Open-source the catalog; community contributions; pricing API |
| **Competitor copies feature** | Medium | Moat is domain expertise + community; compete on execution |
| **Users don't take action** | Medium | Better integrations (Slack, email); action tracking; nudges |
| **Privacy concerns (client-only)** | Low | All data stays in browser — use as marketing differentiator |

### Upside Opportunities

| Opportunity | Potential | Trigger |
|---|---|---|
| **Enterprise deals** | $10K-50K/contract | Procurement integrations, SSO, custom catalogs |
| **Partnership channel** | 5K-50K users/month | VC/accelerator partnerships |
| **API/product integration** | New revenue stream | Embed audit widget in other tools |
| **Data monetization (aggregated)** | New revenue stream | Anonymized benchmarking reports |
