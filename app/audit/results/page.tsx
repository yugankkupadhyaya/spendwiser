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
} from 'lucide-react';

import { AuditFinding } from '../../../types/audit-engine.types';

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

export default function AuditResultsPage() {
  const router = useRouter();
  const findings = useFindingsStore((state) => state.auditFindings);

  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!findings) {
    return null;
  }

  const totalMonthlySavings = findings.reduce((acc, curr) => acc + curr.estimatedSavings, 0);

  const totalYearlySavings = totalMonthlySavings * 12;

  const highSeverityCount = findings.filter((f) => f.severity === 'high').length;

  const infrastructureHealthScore = Math.max(30, 100 - findings.length * 15);

  const filteredFindings = findings.filter((f) => filter === 'all' || f.severity === filter);

  const topFindings = [...findings]
    .sort((a, b) => b.estimatedSavings - a.estimatedSavings)
    .slice(0, 3);

  return (
    <div className="bg-[#030303] text-[#F3F4F6] min-h-screen antialiased selection:bg-indigo-500/30 selection:text-white font-sans pb-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[350px] bg-gradient-to-b from-purple-500/5 via-indigo-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-mono font-bold text-[10px]">S</span>
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
            SpendWise // Audit Results
          </span>
        </div>
      </nav>
      <button
        onClick={() => router.push('/audit')}
        className="
          relative z-10
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

      <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10 space-y-12">
        <AnimatePresence mode="wait">
          {findings.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
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
                🌿 Status: Healthy Infrastructure
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-dashboard"
              className="space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* KPI GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Annual Savings */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#08080A] border border-white/5 p-6 rounded-2xl space-y-2 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-12 h-12 text-indigo-400" />
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

                {/* Total Findings */}
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

                {/* High Severity */}
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
                    {highSeverityCount}
                  </div>

                  <p className="text-[11px] text-rose-500/80 leading-tight font-medium">
                    Immediate attention recommended.
                  </p>
                </motion.div>

                {/* Health Score */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#08080A] border border-white/5 p-6 rounded-2xl space-y-2 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-12 h-12 text-blue-400" />
                  </div>

                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-semibold block">
                    Optimization Score
                  </span>

                  <div className="text-3xl font-mono font-bold tracking-tight text-white">
                    {infrastructureHealthScore}%
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Operational efficiency baseline.
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
                      {filteredFindings.map((item: AuditFinding) => (
                        <motion.div
                          key={item.title}
                          layout
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.98,
                          }}
                          transition={{
                            duration: 0.25,
                          }}
                          className="bg-[#08080A]/60 border border-white/5 hover:border-white/10 p-5 rounded-2xl relative space-y-4 transition-colors group shadow-lg backdrop-blur-md"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                            <div className="flex items-center space-x-3">
                              <SeverityBadge level={item.severity} />

                              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5 rounded">
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
                  {/* Savings Breakdown */}
                  <div className="bg-[#08080A] border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                      <PieChart className="w-4 h-4 text-purple-400" />

                      <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        Savings Breakdown
                      </span>
                    </div>

                    <div className="space-y-4">
                      {topFindings.map((finding) => (
                        <div key={finding.title} className="space-y-1.5">
                          <div className="flex justify-between text-neutral-400 text-[11px]">
                            <span>{finding.title}</span>

                            <span className="text-white font-bold">
                              ${finding.estimatedSavings}
                              /mo
                            </span>
                          </div>

                          <div className="h-1.5 bg-[#111115] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (finding.estimatedSavings / totalMonthlySavings) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-[#08080A] border border-white/5 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />

                      <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        Priority Recommendations
                      </span>
                    </div>

                    <div className="space-y-3">
                      {topFindings.map((finding) => (
                        <div
                          key={finding.title}
                          className="p-3 bg-[#111115]/50 border border-white/5 hover:border-white/10 rounded-xl transition-all flex items-start gap-3 group"
                        >
                          <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1.5" />

                          <div className="space-y-0.5">
                            <h5 className="text-xs font-medium text-white group-hover:text-indigo-400 transition-colors">
                              {finding.title}
                            </h5>

                            <p className="text-[11px] text-neutral-500">
                              Save ${finding.estimatedSavings}
                              /mo
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center font-mono text-[10px] text-neutral-600 uppercase tracking-widest flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    AI Infrastructure Audit Pipeline
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
