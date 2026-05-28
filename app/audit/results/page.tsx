'use client';

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  PieChart,
  Activity,
  Zap,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
  TrendingDown,
  Shuffle,
  GitBranch,
  Compass,
  Lightbulb,
  Target,
  ArrowDown,

  X,
  ChevronDown,
} from 'lucide-react';

import { AuditFinding, AlternativeSuggestion, PriorityLabel, RecommendationAction } from '../../../types/audit-engine.types';

import { useFindingsStore } from '../../../store/findings.store';
import { useRouter } from 'next/navigation';

function SeverityBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const styles = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span
      className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 border rounded-full ${styles[level]}`}
    >
      {level} priority
    </span>
  );
}

function ActionBadge({ action }: { action: RecommendationAction }) {
  const config: Record<RecommendationAction, { color: string; icon: React.ReactNode }> = {
    downgrade: {
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      icon: <ArrowDown className="w-3 h-3" />,
    },
    replace: {
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
      icon: <Shuffle className="w-3 h-3" />,
    },
    consolidate: {
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
      icon: <GitBranch className="w-3 h-3" />,
    },
    remove: {
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
      icon: <X className="w-3 h-3" />,
    },
    simplify: {
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      icon: <Compass className="w-3 h-3" />,
    },
    optimize: {
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      icon: <TrendingDown className="w-3 h-3" />,
    },
  };

  const c = config[action] ?? config.optimize;

  return (
    <span
      className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 border rounded-full inline-flex items-center gap-1 ${c.color}`}
    >
      {c.icon}
      {action}
    </span>
  );
}

function PriorityBadge({ label }: { label: PriorityLabel }) {
  const styles = {
    critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    'quick-win': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'long-term': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };

  return (
    <span
      className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 border rounded-full ${styles[label]}`}
    >
      {label === 'critical' ? '\u26A0\uFE0F ' : label === 'quick-win' ? '\u26A1 ' : '\uD83D\uDD2D '}
      {label}
    </span>
  );
}

function AlternativesList({ alternatives }: { alternatives?: AlternativeSuggestion[] }) {
  const [open, setOpen] = useState(false);

  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0D0D12]/50 border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider font-bold text-indigo-300">
          <Lightbulb className="w-3.5 h-3.5" />
          {alternatives.length} Alternative{alternatives.length > 1 ? 's' : ''} Available
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            <div className="p-3 space-y-2">
              {alternatives.map((alt) => (
                <div
                  key={alt.toolId + alt.planName}
                  className="flex items-center justify-between p-2.5 bg-[#111115]/60 border border-white/5 rounded-lg"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-white">{alt.name}</span>
                    <p className="text-[10px] text-neutral-500 leading-tight max-w-xs">
                      {alt.rationale}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-[10px] font-mono text-neutral-500 block">
                      ~${alt.estimatedMonthlyCost}/mo
                    </span>
                    {alt.estimatedSavings > 0 && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        -${alt.estimatedSavings}/mo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    UNUSED_SEATS: <Target className="w-3 h-3" />,
    OVERPROVISIONED_PLAN: <ArrowDown className="w-3 h-3" />,
    TOOL_MISMATCH: <Shuffle className="w-3 h-3" />,
    DUPLICATE_TOOLING: <GitBranch className="w-3 h-3" />,
    PLAN_MISMATCH: <Activity className="w-3 h-3" />,
  };

  return <>{icons[type] ?? <Zap className="w-3 h-3" />}</>;
}

export default function AuditResultsPage() {
  const router = useRouter();
  const findings = useFindingsStore((state) => state.auditFindings);
  const summary = useFindingsStore((state) => state.auditSummary);

  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!findings) {
    return null;
  }

  const totalMonthlySavings = findings.reduce((acc, curr) => acc + (curr.estimatedSavings ?? 0), 0);
  const totalYearlySavings = totalMonthlySavings * 12;

  const criticalCount = summary?.criticalCount ?? findings.filter((f) => (f.priorityLabel ?? 'long-term') === 'critical').length;
  const quickWinCount = summary?.quickWinCount ?? findings.filter((f) => (f.priorityLabel ?? 'long-term') === 'quick-win').length;

  const filteredFindings = findings.filter((f) =>
    filter === 'all' || f.severity === filter
  );

  const topFindings = [...findings]
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
    .slice(0, 4);

  return (
    <div className="bg-[#030303] text-[#F3F4F6] min-h-screen antialiased selection:bg-indigo-500/30 selection:text-white font-sans pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[350px] bg-gradient-to-b from-purple-500/5 via-indigo-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      <nav className="border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-mono font-bold text-[10px]">S</span>
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
            SpendWise // Optimization Report
          </span>
        </div>
      </nav>

      <button
        onClick={() => router.push('/audit')}
        className="
          relative z-10 ml-6 lg:ml-16 mt-6
          inline-flex items-center gap-2.5 
          h-9 px-4 
          bg-[#0A0A0C]/60 hover:bg-[#111115]/80
          border border-white/5 hover:border-white/10
          text-neutral-400 hover:text-neutral-200
          font-mono text-xs font-medium tracking-wider uppercase 
          rounded-xl backdrop-blur-md
          transition-all duration-200 
          shadow-lg shadow-black/20 
          group cursor-pointer
        "
      >
        <ArrowLeft className="w-3.5 h-3.5 text-neutral-500 group-hover:text-indigo-400 group-hover:-translate-x-0.5 transition-all duration-200" />
        <span>Back to Audit Page</span>
      </button>

      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-10 space-y-12">
        <AnimatePresence mode="wait">
          {findings.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-20 border border-white/5 bg-[#08080A]/60 rounded-3xl backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent blur-xl pointer-events-none" />

              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-2xl mx-auto shadow-xl shadow-emerald-500/5">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Your AI infrastructure is fully optimized.
                </h2>

                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  No major inefficiencies or unnecessary operational costs were detected in your
                  current stack.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400 rounded-full">
                Status: Healthy Infrastructure
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-dashboard"
              className="space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Optimization Summary Banner */}
              {findings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 p-5 rounded-2xl backdrop-blur-md space-y-2"
                >
                  <div className="flex items-center gap-2 text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                      Optimization Summary
                    </span>
                  </div>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {summary?.summary ?? (findings.length > 0
                      ? `Your stack has ${findings.length} optimization opportunity(ies). ${criticalCount > 0 ? `${criticalCount} critical issue(s) require immediate attention. ` : ''}${quickWinCount > 0 ? `${quickWinCount} quick win(s) can be addressed with minimal effort. ` : ''}Estimated annual savings of $${totalYearlySavings.toLocaleString()}.`
                      : 'Your stack is efficiently configured.')}
                  </p>
                </motion.div>
              )}

              {/* KPI GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#08080A] border border-white/5 p-6 rounded-2xl space-y-2 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-12 h-12 text-emerald-400" />
                  </div>

                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-semibold block">
                    Est. Annual Savings
                  </span>

                  <div className="text-3xl font-mono font-bold tracking-tight text-emerald-400">
                    ${totalYearlySavings.toLocaleString()}
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Potential recoverable spend.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#08080A] border border-white/5 p-6 rounded-2xl space-y-2 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers className="w-12 h-12 text-purple-400" />
                  </div>

                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-semibold block">
                    Findings
                  </span>

                  <div className="text-3xl font-mono font-bold tracking-tight text-white">
                    {findings.length}
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Optimization opportunities found.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#08080A] border border-white/5 p-6 rounded-2xl space-y-2 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle className="w-12 h-12 text-rose-400" />
                  </div>

                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-semibold block">
                    High Priority
                  </span>

                  <div className="text-3xl font-mono font-bold tracking-tight text-rose-400">
                    {criticalCount}
                  </div>

                  <p className="text-[11px] text-rose-500/80 leading-tight font-medium">
                    Immediate attention recommended.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#08080A] border border-white/5 p-6 rounded-2xl space-y-2 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-12 h-12 text-amber-400" />
                  </div>

                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-semibold block">
                    Quick Wins
                  </span>

                  <div className="text-3xl font-mono font-bold tracking-tight text-amber-400">
                    {quickWinCount}
                  </div>

                  <p className="text-[11px] text-amber-500/80 leading-tight font-medium">
                    Easy optimization opportunities.
                  </p>
                </motion.div>
              </div>

              {/* MAIN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* LEFT */}
                <div className="lg:col-span-8 space-y-6">
                  {/* FILTERS */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
                    <div>
                      <h3 className="text-base font-semibold text-white">Audit Findings</h3>

                      <p className="text-xs text-neutral-400">
                        Analyze inefficiencies by severity level.
                      </p>
                    </div>

                    <div className="flex bg-[#0A0A0C] border border-white/5 p-1 rounded-lg font-mono text-[11px]">
                      {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setFilter(lvl)}
                          className={`px-3 py-1 rounded-md uppercase tracking-wider font-bold cursor-pointer transition-all ${
                            filter === lvl
                              ? 'bg-white/5 text-white shadow-sm'
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FINDINGS */}
                  <motion.div layout className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredFindings.map((item: AuditFinding, idx: number) => (
                        <motion.div
                          key={`${item.type}-${idx}-${item.title}`}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.25 }}
                          className="bg-[#08080A]/60 border border-white/5 hover:border-white/10 p-5 rounded-2xl relative space-y-4 transition-colors group shadow-lg backdrop-blur-md"
                        >
                          {/* TOP ROW: badges + savings */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                            <div className="flex items-center flex-wrap gap-2">
                              <SeverityBadge level={item.severity} />
                              <ActionBadge action={item.action ?? 'optimize'} />
                              <PriorityBadge label={item.priorityLabel ?? 'long-term'} />
                              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5 rounded inline-flex items-center gap-1">
                                <TypeIcon type={item.type} />
                                {item.type.replaceAll('_', ' ')}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                                Estimated Savings
                              </span>

                              <span className="text-xs font-mono font-bold text-emerald-400">
                                ${item.estimatedSavings}
                                /mo
                              </span>
                            </div>
                          </div>

                          {/* BODY */}
                          <div className="space-y-2">
                            <h4 className="text-base font-medium text-white group-hover:text-indigo-300 transition-colors">
                              {item.title}
                            </h4>

                            <p className="text-xs text-neutral-400 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Recommendation */}
                          <div className="bg-[#111115]/50 border border-white/5 p-3.5 rounded-xl space-y-1.5">
                            <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold flex items-center gap-1">
                              <Zap className="w-3 h-3 text-indigo-400" />
                              Recommendation
                            </div>

                            <p className="text-xs text-neutral-300 leading-normal">
                              {item.recommendation}
                            </p>
                          </div>

                          {/* Alternatives */}
                          <AlternativesList alternatives={item.alternatives} />

                          <div className="pt-2 flex justify-end">
                            <button className="text-[11px] font-mono uppercase tracking-wider font-bold text-white bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer">
                              <span>Review Insight</span>

                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                  {/* Priority Breakdown */}
                  <div className="bg-[#08080A] border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                      <PieChart className="w-4 h-4 text-purple-400" />

                      <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        Priority Breakdown
                      </span>
                    </div>

                    <div className="space-y-4">
                      {topFindings.map((finding) => (
                        <div key={`breakdown-${finding.title}`} className="space-y-1.5">
                          <div className="flex justify-between text-neutral-400 text-[11px]">
                            <span className="truncate max-w-[180px]">{finding.title}</span>

                            <span className="text-white font-bold">
                              ${finding.estimatedSavings}
                              /mo
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#111115] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(100, (finding.priorityScore ?? 0))}%`,
                                  background:
                                    (finding.priorityLabel ?? 'long-term') === 'critical'
                                      ? 'linear-gradient(90deg, #f43f5e, #e11d48)'
                                      : (finding.priorityLabel ?? 'long-term') === 'quick-win'
                                        ? 'linear-gradient(90deg, #10b981, #059669)'
                                        : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-neutral-500 w-6 text-right">
                              {finding.priorityScore ?? 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Summary */}
                  <div className="bg-[#08080A] border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                      <Target className="w-4 h-4 text-indigo-400" />

                      <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        Action Summary
                      </span>
                    </div>

                    <div className="space-y-3">
                      {([
                        { action: 'downgrade' as const, label: 'Downgrade', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { action: 'replace' as const, label: 'Replace', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { action: 'consolidate' as const, label: 'Consolidate', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { action: 'remove' as const, label: 'Remove', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                        { action: 'simplify' as const, label: 'Simplify', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { action: 'optimize' as const, label: 'Optimize', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                      ] as const).map(({ action, label, color, bg }) => {
                        const count = findings.filter((f) => (f.action ?? 'optimize') === action).length;
                        if (count === 0) {
                          return null;
                        }

                        return (
                          <div
                            key={action}
                            className="flex items-center justify-between p-2.5 bg-[#111115]/50 border border-white/5 rounded-xl"
                          >
                            <span className={`text-xs font-medium ${color} flex items-center gap-1.5`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${bg}`} />
                              {label}
                            </span>
                            <span className="text-xs font-mono font-bold text-white">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-center font-mono text-[10px] text-neutral-600 uppercase tracking-widest flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    Recommendation Intelligence Engine
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
