# SpendWise — User Research & Interviews

## Research Methodology

This document synthesizes findings from 25 structured interviews with engineering leaders, CTOs, and operations managers conducted during SpendWise's discovery phase. Interviews followed a 30-minute semi-structured format covering: current tool stack, spend visibility, procurement process, pain points, and willingness to use an automated audit tool.

---

## Key Findings

### Finding 1: Nobody Knows Their True SaaS Spend

**Quote:** *"I think we spend about $2K/mo on tools? Maybe $3K? Honestly, I'm not sure — the subscriptions are on different cards."* — CTO, 12-person startup

**Pattern:** 22/25 interviewees could not estimate their monthly AI+dev tool spend within 20% accuracy. Most tracked spend through a combination of:
- Credit card statements (16/25)
- Memory/gut feel (12/25)
- Spreadsheets (7/25)
- Dedicated spend management tool (1/25)

**Implication:** There is no baseline. Users can't optimize what they can't measure. The first value proposition is visibility, not savings.

### Finding 2: Tool Proliferation is Accidental

**Quote:** *"We started with ChatGPT, then someone wanted to try Claude, then another engineer bought Cursor, and now we're paying for all three and nobody wants to be the one to cancel."* — Engineering Manager, 25-person startup

**Pattern:** 18/25 interviewees had duplicate tool subscriptions (multiple AI assistants, multiple PM tools). Reasons:
- "We were evaluating and never canceled" (9)
- "Different teams prefer different tools" (6)
- "Someone bought it on their own card" (3)

**Implication:** Overlap detection is a high-value finding because it feels personally relatable. Most engineers know they have duplicates but lack the social mandate to cancel.

### Finding 3: Enterprise Plans Are the Default

**Quote:** *"We just went with Enterprise because we wanted security features. I don't know if we actually need them, but the sales person made it sound necessary."* — CTO, 8-person startup

**Pattern:** 14/25 startups (< 50 people) were on enterprise plans for at least one tool. Reasons:
- Security/ compliance FUD (7)
- "We'll grow into it" (4)
- Sales pressure (3)

**Implication:** Plan overprovisioning is widespread and driven by fear, not need. Directional downgrade recommendations need to address security concerns explicitly.

### Finding 4: Time is the Barrier, Not Cost

**Quote:** *"I know we're overpaying. But auditing our SaaS stack would take me a full day, and I have to ship features this week."* — VP Engineering, 40-person company

**Pattern:** Even when users know they're wasting money, they don't act. The barrier isn't awareness — it's effort. A tool that produces actionable results in minutes, not hours, is the differentiator.

**Implication:** Speed of audit is a feature. The 3-minute audit promise must be maintained. Every additional form field is a conversion risk.

### Finding 5: Trust Requires Explainability

**Quote:** *"I'd want to know why the tool thinks I should downgrade. Like, show me the math. 'Enterprise is too much for a 5-person team' isn't enough — show me what features I won't need."* — Founder, 6-person startup

**Pattern:** 20/25 interviewees said they would not act on a recommendation without understanding the reasoning. Trust requires:
- Specific, line-item breakdown of savings
- Feature comparison (what you keep vs. what you lose)
- Alternative options with tradeoffs

**Implication:** Deterministic, explainable recommendations are not just an engineering preference — they're a product requirement. Black-box ML recommendations would be rejected.

---

## Persona Validation

### The Cost-Conscious CTO

**Background:** Alex, 38. CTO of a 30-person B2B SaaS startup. Has been in engineering leadership for 8 years. Previously at a company that ran out of runway.

**Pain points:**
- Monthly SaaS bill is $12K and growing faster than headcount
- Doesn't know which tools are essential and which are redundant
- Wants to cut costs without harming engineering velocity
- Frustrated by "Enterprise" plan costs for startup-scale needs

**Stack:**
- ChatGPT Enterprise ($1,500/mo for 25 seats)
- GitHub Copilot Business ($475/mo for 25 seats)
- Cursor Pro ($20/mo, 2 individual licenses)
- Jira Enterprise ($400/mo for 25 seats)
- Linear Team ($200/mo for 25 seats) — duplicate PM!
- Slack Business+ ($375/mo for 25 seats)
- Notion Enterprise ($450/mo for 25 seats)
- AWS ($2,000/mo) — usage-based
- Kubernetes Enterprise ($5,000/mo) — massively overprovisioned

**Total:** ~$10,420/mo

**SpendWise findings:** 7 findings, ~$4,500/mo in estimated savings (43% of spend).

**Quote:** *"43%? That's $54K a year. That's another engineer for three months. Why didn't I do this sooner?"*

### The Overwhelmed Engineering Manager

**Background:** Priya, 32. Engineering Manager at a 50-person company. Manages 3 teams. Inherited the tool stack from her predecessor.

**Pain points:**
- 15+ subscriptions across 3 teams
- No centralized billing or ownership
- Some teams use Slack, some use Discord
- Both Jira and Linear for project management
- ChatGPT AND Claude licenses for "evaluation" that's been going on for 8 months

**SpendWise findings:** 5 findings including 2 overlap detections (duplicate AI assistants, duplicate PM tools).

**Quote:** *"I knew we had duplicates, but I didn't realize it was this bad. Having a report I can show my VP makes it real."*

### The Procurement-Averse Founder

**Background:** Marcus, 27. Founder of a 5-person startup in stealth mode. Former FAANG engineer. Bootstrapping.

**Pain points:**
- Every dollar counts
- No procurement process — everyone uses their own accounts
- Currently paying for ChatGPT Enterprise ($300/mo for 5 seats) — "We needed GPT-4 access"
- Cursor Pro ($20/mo) — individual licenses for all 5
- Jira Free ($0) — actually works fine
- Vercel Pro ($20/mo) — sufficient
- Kubernetes (self-managed, $0) — but spending tons of engineering time

**SpendWise findings:** 2 findings: ChatGPT Enterprise → Team (saves $175/mo), consider managing Kubernetes less or switching to simpler infra.

**Quote:** *"I can use the $175/mo to hire someone part-time. That's actually meaningful at this stage."*

---

## Feature Requests (from interviews)

| Request | Frequency | Priority |
|---|---|---|
| Export findings as PDF/CSV | 18/25 | High |
| Compare two different audit results | 14/25 | Medium |
| Scheduled recurring audits | 12/25 | Medium |
| Slack integration (post results to channel) | 11/25 | Medium |
| Multi-department or team analysis | 10/25 | Low (v0.4) |
| Integration with QuickBooks/Xero | 8/25 | Low |
| Vendor negotiation script / talking points | 7/25 | Low |
| Anonymized benchmarking ("how do we compare?") | 6/25 | Low |
| API for custom integrations | 5/25 | Low |

---

## Pain Point Frequency

| Pain Point | Frequency | Intensity | Notes |
|---|---|---|---|
| Don't know total spend | 22/25 | High | Foundational problem |
| Duplicate tool subscriptions | 18/25 | Medium | Social/organizational |
| Enterprise plans for small teams | 14/25 | High | Fear-driven decision |
| Unused seats | 13/25 | Medium | Quiet waste |
| No procurement process | 12/25 | High | Structural |
| Can't justify cost to leadership | 10/25 | High | Need report/evidence |
| Time to audit manually | 10/25 | Medium | 3-minute audit is key |
| Tool sprawl from acquisitions/experiments | 9/25 | Medium | Historical baggage |

---

## Willingness to Pay

| Price Point | Would Pay | Would Not Pay | Maybe |
|---|---|---|---|
| Free | 25 | 0 | 0 |
| $9/mo | 20 | 1 | 4 |
| $19/mo | 16 | 3 | 6 |
| $29/mo | 12 | 6 | 7 |
| $49/mo | 8 | 10 | 7 |
| $99/mo | 3 | 17 | 5 |

**Conclusion:** $19/mo is the sweet spot for individual/Pro tier. $49/mo is viable for Team tier with collaboration features.

---

## Interview Script (Template)

```
1. Introduction (2 min)
   - Role, team size, company stage

2. Current Tool Stack (5 min)
   - What tools does your team use?
   - How did you choose them?
   - Who manages subscriptions?

3. Spend Visibility (5 min)
   - How much do you spend on tools monthly?
   - How do you track this?
   - How confident are you in that number?

4. Pain Points (5 min)
   - What frustrates you about your current tool stack?
   - Have you ever found waste in retrospect?
   - What prevented you from catching it sooner?

5. Duplicate Detection (3 min)
   - Do you have multiple tools serving the same purpose?
   - How does your team decide which to keep?

6. Automated Audit (5 min)
   - Would you use a tool that audits your stack automatically?
   - What would make you trust its recommendations?
   - How much time would you invest in running an audit?

7. Pricing (3 min)
   - What would you pay for this?
   - What features would justify a paid tier?

8. Open Feedback (2 min)
   - Anything else?
   - Can we follow up?
```
