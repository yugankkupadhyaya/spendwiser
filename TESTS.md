# SpendWise — Testing Strategy

## Testing Philosophy

SpendWise is a deterministic rules engine. Every rule is a pure function: same input → same output. This makes the system exceptionally testable — no mocking, no async setup, no network dependencies.

Our testing strategy focuses on:

1. **Rule correctness** — Does each rule produce the right findings for known scenarios?
2. **Edge cases** — Empty arrays, missing catalog entries, zero values, boundary conditions
3. **Integration** — Does the pipeline compose correctly?
4. **Regression** — Do type changes in findings or catalogs break old behavior?
5. **UI behavior** — Does the dashboard render correctly for different finding sets (empty, 1 finding, many findings)?

---

## Test Infrastructure

**Framework:** Vitest (preferred for Vite/Next.js projects, fast, ESM-native)
**Location:** `__tests__/` adjacent to source files

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

**Scripts** (to add to package.json):
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Unit Tests: Rules

### detectUnusedSeats

```typescript
describe('detectUnusedSeats', () => {
  it('flags unused seats when seats exceed team size', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 300, seatsCount: 12 }],
    };
    const findings = detectUnusedSeats(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].type).toBe('UNUSED_SEATS');
    expect(findings[0].severity).toBe('high'); // 7 unused >= 5
    expect(findings[0].estimatedSavings).toBe(175); // 300/12 * 7
    expect(findings[0].relatedToolIds).toEqual(['chatgpt']);
  });

  it('returns empty when seats match team size', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 125, seatsCount: 5 }],
    };
    expect(detectUnusedSeats(data)).toHaveLength(0);
  });

  it('returns empty when seats are under team size', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 125, seatsCount: 5 }],
    };
    expect(detectUnusedSeats(data)).toHaveLength(0);
  });

  it('sets medium severity when unused seats < 5', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 240, seatsCount: 12 }],
    };
    expect(detectUnusedSeats(data)[0].severity).toBe('medium');
  });

  it('handles multiple tools independently', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'chatgpt', planName: 'team', monthlySpend: 300, seatsCount: 10 },
        { toolId: 'jira', planName: 'enterprise', monthlySpend: 80, seatsCount: 5 },
      ],
    };
    expect(detectUnusedSeats(data)).toHaveLength(1); // jira: 5 seats = 5 team, no waste
  });

  it('handles zero seats gracefully', () => {
    const data: AuditFormValues = {
      teamSize: 0,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 100, seatsCount: 5 }],
    };
    // 5 unused, but teamSize=0 is technically invalid (zod min 1)
    // Engine should still handle gracefully
    const findings = detectUnusedSeats(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].estimatedSavings).toBe(100); // 100/5 * 5 = all of it
  });
});
```

### detectToolMismatch

```typescript
describe('detectToolMismatch', () => {
  it('flags tool not suitable for primary use case', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'figma', planName: 'pro', monthlySpend: 120, seatsCount: 5 }],
    };
    const findings = detectToolMismatch(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].type).toBe('TOOL_MISMATCH');
  });

  it('does not flag tool suitable for primary use case', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 250, seatsCount: 10 }], // chatgpt supports coding
    };
    expect(detectToolMismatch(data)).toHaveLength(0);
  });

  it('skips tools not in catalog', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'windsurf', planName: 'pro', monthlySpend: 15, seatsCount: 5 }],
    };
    expect(detectToolMismatch(data)).toHaveLength(0); // windsurf has no catalog entry
  });

  it('handles empty tools array', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'research',
      tools: [],
    };
    expect(detectToolMismatch(data)).toHaveLength(0);
  });
});
```

### detectPlanMismatch

```typescript
describe('detectPlanMismatch', () => {
  it('flags overprovisioned enterprise plan for startup team', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'enterprise', monthlySpend: 300, seatsCount: 5 }],
    };
    const findings = detectPlanMismatch(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].type).toBe('OVERPROVISIONED_PLAN');
    expect(findings[0].action).toBe('downgrade');
    expect(findings[0].severity).toBe('high'); // rank diff: 4 - 1 = 3
    expect(findings[0].estimatedSavings).toBe(120); // 300 * 0.4
  });

  it('flags mild overprovisioning for team plan on solo team', () => {
    const data: AuditFormValues = {
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 25, seatsCount: 1 }],
    };
    const findings = detectPlanMismatch(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('low'); // rank diff: 2 - 0 = 2 → low
  });

  it('flags underpowered plan for enterprise team', () => {
    const data: AuditFormValues = {
      teamSize: 100,
      primaryUseCase: 'enterprise',
      tools: [{ toolId: 'jira', planName: 'free', monthlySpend: 0, seatsCount: 100 }],
    };
    const findings = detectPlanMismatch(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].type).toBe('PLAN_MISMATCH');
    expect(findings[0].action).toBe('optimize');
    expect(findings[0].estimatedSavings).toBe(0);
  });

  it('returns empty for appropriate plan+team match', () => {
    const data: AuditFormValues = {
      teamSize: 25,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 625, seatsCount: 25 }],
    };
    // 25 = small-team, chatgpt-team recommended for small-team
    expect(detectPlanMismatch(data)).toHaveLength(0);
  });

  it('skips unknown plan entries', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'nonexistent-plan', monthlySpend: 100, seatsCount: 5 }],
    };
    expect(detectPlanMismatch(data)).toHaveLength(0);
  });
});
```

### detectToolOverlap

```typescript
describe('detectToolOverlap', () => {
  it('detects overlapping AI assistants', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'chatgpt', planName: 'team', monthlySpend: 250, seatsCount: 10 },
        { toolId: 'claude', planName: 'pro', monthlySpend: 200, seatsCount: 10 },
      ],
    };
    const findings = detectToolOverlap(data);
    expect(findings).toHaveLength(1);
    expect(findings[0].type).toBe('DUPLICATE_TOOLING');
    expect(findings[0].severity).toBe('medium'); // 2 tools
    expect(findings[0].action).toBe('consolidate');
    expect(findings[0].estimatedSavings).toBe(225); // (250 + 200) * 0.5
  });

  it('sets high severity for 3+ overlapping tools', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'chatgpt', planName: 'team', monthlySpend: 250, seatsCount: 10 },
        { toolId: 'claude', planName: 'pro', monthlySpend: 200, seatsCount: 10 },
        { toolId: 'gemini', planName: 'pro', monthlySpend: 200, seatsCount: 10 },
      ],
    };
    expect(detectToolOverlap(data)[0].severity).toBe('high');
  });

  it('does not flag single tools in a group', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 250, seatsCount: 10 }],
    };
    expect(detectToolOverlap(data)).toHaveLength(0);
  });

  it('handles tools without overlapGroup gracefully', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'aws', planName: 'pro', monthlySpend: 100, seatsCount: 1 },
        { toolId: 'vercel', planName: 'pro', monthlySpend: 20, seatsCount: 1 },
      ],
    };
    // AWS (cloud-provider) and Vercel (deployment-platform) — different groups
    expect(detectToolOverlap(data)).toHaveLength(0);
  });
});
```

---

## Unit Tests: Recommendation Generators

### generatePlanRecommendation

```typescript
describe('generatePlanRecommendation', () => {
  it('suggests downgrade for enterprise ChatGPT on startup', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'enterprise', monthlySpend: 300, seatsCount: 5 }],
    };
    const findings = generatePlanRecommendation(data, []);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toContain('ChatGPT Team');
    expect(findings[0].alternatives).toBeDefined();
    expect(findings[0].alternatives![0].estimatedSavings).toBeGreaterThan(0);
  });

  it('returns empty when plan is already appropriate', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'chatgpt', planName: 'team', monthlySpend: 125, seatsCount: 5 }],
    };
    expect(generatePlanRecommendation(data, [])).toHaveLength(0);
  });
});
```

### generateAlternativeSuggestions

```typescript
describe('generateAlternativeSuggestions', () => {
  it('suggests alternatives for tools with mappings', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [{ toolId: 'jira', planName: 'enterprise', monthlySpend: 80, seatsCount: 5 }],
    };
    const findings = generateAlternativeSuggestions(data, []);
    expect(findings).toHaveLength(1);
    expect(findings[0].alternatives!.some(a => a.toolId === 'linear')).toBe(true);
    expect(findings[0].alternatives!.some(a => a.toolId === 'notion')).toBe(true);
  });

  it('excludes alternatives already in use', () => {
    const data: AuditFormValues = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'jira', planName: 'enterprise', monthlySpend: 80, seatsCount: 5 },
        { toolId: 'linear', planName: 'team', monthlySpend: 40, seatsCount: 5 },
      ],
    };
    const findings = generateAlternativeSuggestions(data, []);
    // Linear is already in use, should not appear as alternative for jira
    expect(findings).toHaveLength(1);
    expect(findings[0].alternatives!.some(a => a.toolId === 'linear')).toBe(false);
  });
});
```

### prioritizeFindings

```typescript
describe('prioritizeFindings', () => {
  it('scores high severity findings as critical', () => {
    const findings: AuditFinding[] = [{
      type: 'OVERPROVISIONED_PLAN', severity: 'high', action: 'downgrade', category: 'cost',
      title: 'Test', description: '', recommendation: '', estimatedSavings: 1000,
      priorityScore: 0, priorityLabel: 'long-term',
    }];
    const prioritized = prioritizeFindings(findings);
    expect(prioritized[0].priorityLabel).toBe('critical');
    expect(prioritized[0].priorityScore).toBeGreaterThanOrEqual(60);
  });

  it('scores consolidation findings higher due to complexity bonus', () => {
    const consolidateFinding: AuditFinding = {
      type: 'DUPLICATE_TOOLING', severity: 'high', action: 'consolidate', category: 'efficiency',
      title: 'Test', description: '', recommendation: '', estimatedSavings: 500,
      priorityScore: 0, priorityLabel: 'long-term',
    };
    const downgradeFinding: AuditFinding = {
      ...consolidateFinding, action: 'downgrade', type: 'OVERPROVISIONED_PLAN',
    };
    const prioritized = prioritizeFindings([consolidateFinding, downgradeFinding]);
    // Consolidate has +20 complexity bonus over downgrade's +5
    expect(prioritized[0].priorityScore).toBeGreaterThan(prioritized[1].priorityScore);
  });
});
```

---

## Integration Tests

### runAuditEngine

```typescript
describe('runAuditEngine (integration)', () => {
  it('produces findings for a complex startup stack', () => {
    const data: AuditFormValues = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'chatgpt', planName: 'enterprise', monthlySpend: 300, seatsCount: 10 },
        { toolId: 'claude', planName: 'pro', monthlySpend: 200, seatsCount: 10 },
        { toolId: 'jira', planName: 'enterprise', monthlySpend: 160, seatsCount: 10 },
        { toolId: 'kubernetes', planName: 'enterprise', monthlySpend: 5000, seatsCount: 1 },
        { toolId: 'figma', planName: 'enterprise', monthlySpend: 450, seatsCount: 10 },
      ],
    };
    const result = runAuditEngine(data);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.summary.totalEstimatedYearlySavings).toBeGreaterThan(0);
    expect(result.summary.criticalCount + result.summary.quickWinCount).toBeGreaterThan(0);
  });

  it('returns empty findings for a perfectly optimized stack', () => {
    const data: AuditFormValues = {
      teamSize: 25,
      primaryUseCase: 'coding',
      tools: [
        { toolId: 'chatgpt', planName: 'team', monthlySpend: 625, seatsCount: 25 },
        { toolId: 'cursor', planName: 'pro', monthlySpend: 20, seatsCount: 1 },
      ],
    };
    const result = runAuditEngine(data);
    expect(result.findings).toHaveLength(0);
    expect(result.summary.summary).toContain('efficiently configured');
  });
});
```

---

## UI Tests (Vitest + Testing Library)

### Dashboard Rendering

```typescript
describe('AuditResultsPage', () => {
  it('shows empty state when no findings exist', () => {
    useFindingsStore.setState({ auditFindings: [] });
    const { getByText } = render(<AuditResultsPage />);
    expect(getByText(/fully optimized/i)).toBeInTheDocument();
  });

  it('shows KPI cards when findings exist', () => {
    useFindingsStore.setState({
      auditFindings: [mockFinding({ estimatedSavings: 100, severity: 'high' })],
    });
    const { getByText } = render(<AuditResultsPage />);
    expect(getByText(/\$1,200/)).toBeInTheDocument(); // $100/mo * 12 = $1200/yr
  });

  it('filters findings by severity', async () => {
    useFindingsStore.setState({
      auditFindings: [
        mockFinding({ severity: 'high', title: 'Urgent' }),
        mockFinding({ severity: 'low', title: 'Minor' }),
      ],
    });
    const { getByText, queryByText } = render(<AuditResultsPage />);
    await userEvent.click(getByText('high'));
    expect(getByText('Urgent')).toBeInTheDocument();
    expect(queryByText('Minor')).not.toBeInTheDocument();
  });
});
```

---

## Test Coverage Targets

| Module | Target | Priority |
|---|---|---|
| Rules (4) | 100% line coverage | High |
| Recommendation generators (3) | 100% line coverage | High |
| Prioritization | 100% line coverage | High |
| Optimization summary | 90% line coverage | Medium |
| Orchestrator (integration) | Key scenarios | High |
| UI — Dashboard | Core states (empty, findings, filtered) | Medium |
| UI — Form | Validation, submission, add/remove tools | Medium |
| Catalogs | Structural integrity (all tools have plans) | Low |

---

## Test Data Fixtures

```typescript
// __tests__/fixtures/audit-fixtures.ts
export const startupOverprovisioned: AuditFormValues = {
  teamSize: 5,
  primaryUseCase: 'coding',
  tools: [
    { toolId: 'chatgpt', planName: 'enterprise', monthlySpend: 300, seatsCount: 10 },
    { toolId: 'jira', planName: 'enterprise', monthlySpend: 80, seatsCount: 5 },
  ],
};

export const enterpriseOptimized: AuditFormValues = {
  teamSize: 100,
  primaryUseCase: 'enterprise',
  tools: [
    { toolId: 'chatgpt', planName: 'enterprise', monthlySpend: 6000, seatsCount: 100 },
    { toolId: 'jira', planName: 'enterprise', monthlySpend: 1600, seatsCount: 100 },
    { toolId: 'slack', planName: 'business', monthlySpend: 1500, seatsCount: 100 },
  ],
};

export const soloDeveloper: AuditFormValues = {
  teamSize: 1,
  primaryUseCase: 'coding',
  tools: [
    { toolId: 'cursor', planName: 'pro', monthlySpend: 20, seatsCount: 1 },
    { toolId: 'vercel', planName: 'free', monthlySpend: 0, seatsCount: 1 },
  ],
};
```

---

## CI Pipeline (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test -- --coverage
      - run: pnpm build
```
