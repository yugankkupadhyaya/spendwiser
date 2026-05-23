'use client';

import React from 'react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Layers,
  DollarSign,
  Users,
  PieChart,
} from 'lucide-react';

// ==========================================
// TYPES & DICTIONARIES
// ==========================================

type ToolCardValues = {
  toolId: string;
  planName: string;
  monthlySpend: string;
  seatsCount: string;
};

type AuditFormValues = {
  teamSize: string;
  primaryUseCase: string;
  tools: ToolCardValues[];
};

const SUPPORTED_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'copilot', name: 'GitHub Copilot' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'openai-api', name: 'OpenAI API' },
  { id: 'anthropic-api', name: 'Anthropic API' },
  { id: 'windsurf', name: 'Windsurf' },
];

const USE_CASES = [
  { id: 'coding', name: 'Coding & Engineering' },
  { id: 'writing', name: 'Writing & Marketing' },
  { id: 'research', name: 'Research & Strategy' },
  { id: 'data-analysis', name: 'Data Analysis & BI' },
  { id: 'mixed', name: 'Mixed Operations' },
];

// ==========================================
// ANIMATIONS
// ==========================================

const fadeInUpVariant: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardAnimationVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

export default function Page() {
  const { register, control, handleSubmit, watch } = useForm<AuditFormValues>({
    defaultValues: {
      teamSize: '12',
      primaryUseCase: 'coding',
      tools: [
        {
          toolId: 'chatgpt',
          planName: 'ChatGPT Team',
          monthlySpend: '150',
          seatsCount: '5',
        },
        {
          toolId: 'cursor',
          planName: 'Cursor Business',
          monthlySpend: '240',
          seatsCount: '6',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools',
  });

  const watchedTools = watch('tools') || [];
  const watchedTeamSize = watch('teamSize') || '0';

  const estimatedMonthlySpend = watchedTools.reduce((acc, tool) => {
    return acc + Number(tool.monthlySpend || 0);
  }, 0);

  const estimatedYearlySpend = estimatedMonthlySpend * 12;

  const onSubmitForm = (data: AuditFormValues) => {
    console.log('SpendWise Audit Submission:', data);
  };

  return (
    <div className="bg-[#030303] text-[#F3F4F6] min-h-screen selection:bg-indigo-500/30 selection:text-white antialiased font-sans relative overflow-hidden pb-24">
      {/* BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] pointer-events-none z-0" />

      <div
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] pointer-events-none z-0 animate-pulse"
        style={{ animationDuration: '8s' }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden">
              <div className="absolute inset-[1px] rounded-xl bg-[#030303]" />

              <span className="relative z-10 text-white font-black text-sm tracking-tight">SW</span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-[0.22em] uppercase text-white">
                SpendWise
              </span>

              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                AI Spend Audit
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-6 text-xs text-neutral-400 font-mono">
          <span className="hidden md:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Read-Only Secure Analysis
          </span>

          <Link href="/" className="hover:text-white transition-colors">
            ← Back Home
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
        {/* HERO */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          className="space-y-4 max-w-3xl pb-12 border-b border-white/5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[11px] font-medium tracking-wide text-indigo-300 rounded-full backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
            Continuous AI Spend Monitoring
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
            Audit your AI stack <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-300 to-white">
              in minutes.
            </span>
          </h1>

          <p className="text-base text-neutral-400 max-w-xl leading-relaxed">
            Identify wasted AI spend, redundant subscriptions, and oversized plans across your team
            in minutes.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12"
        >
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-14">
            {/* TEAM INFO */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUpVariant}
              className="bg-[#0A0A0C]/80 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">Team Information</h3>

                  <p className="text-xs text-neutral-500">
                    Define the size and operational focus of your organization.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300 block">
                    Total Team Size
                  </label>

                  <input
                    type="number"
                    {...register('teamSize')}
                    className="w-full bg-[#111115] border border-white/5 focus:border-indigo-500/50 text-sm p-3 rounded-xl transition-all outline-none text-white font-mono shadow-inner"
                    placeholder="e.g. 25"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300 block">
                    Primary Operational Focus
                  </label>

                  <select
                    {...register('primaryUseCase')}
                    className="w-full bg-[#111115] border border-white/5 focus:border-indigo-500/50 text-sm p-3 rounded-xl transition-all outline-none text-white shadow-inner appearance-none cursor-pointer"
                  >
                    {USE_CASES.map((uc) => (
                      <option key={uc.id} value={uc.id} className="bg-[#0A0A0C] text-white">
                        {uc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* TOOL STACK */}
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Tool Stack</h3>

                    <p className="text-xs text-neutral-500">
                      Add the AI tools and subscriptions currently used across your organization.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                variants={staggerContainerVariant}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      variants={cardAnimationVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layoutId={field.id}
                      whileHover={{
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                      className="bg-[#0A0A0C]/60 border border-white/5 hover:border-white/10 p-6 rounded-2xl relative space-y-4 shadow-lg backdrop-blur-md transition-colors"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
                          Tool Configuration — #{index + 1}
                        </span>

                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-neutral-500 hover:text-rose-400 font-mono text-[11px] flex items-center space-x-1.5 transition-colors group"
                          >
                            <Trash2 className="w-3.5 h-3.5 opacity-75 group-hover:scale-105 transition-transform" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-neutral-400 block">
                            AI Tool
                          </label>

                          <select
                            {...register(`tools.${index}.toolId` as const)}
                            className="w-full bg-[#111115] border border-white/5 text-xs text-white p-2.5 rounded-xl outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                          >
                            {SUPPORTED_TOOLS.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-neutral-400 block">
                            Plan Tier
                          </label>

                          <input
                            type="text"
                            {...register(`tools.${index}.planName` as const)}
                            placeholder="e.g. ChatGPT Team"
                            className="w-full bg-[#111115] border border-white/5 text-xs text-white p-2.5 rounded-xl outline-none focus:border-indigo-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-neutral-400 block">
                            Monthly Spend
                          </label>

                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-600">
                              $
                            </span>

                            <input
                              type="number"
                              {...register(`tools.${index}.monthlySpend` as const)}
                              placeholder="0.00"
                              className="w-full bg-[#111115] border border-white/5 text-xs text-white pl-6 pr-2.5 py-2.5 rounded-xl outline-none focus:border-indigo-500/50 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-neutral-400 block">
                            Seats Count
                          </label>

                          <input
                            type="number"
                            {...register(`tools.${index}.seatsCount` as const)}
                            placeholder="1"
                            className="w-full bg-[#111115] border border-white/5 text-xs text-white p-2.5 rounded-xl outline-none focus:border-indigo-500/50 font-mono"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.button
                type="button"
                whileHover={{
                  scale: 1.005,
                  borderColor: 'rgba(255,255,255,0.15)',
                }}
                whileTap={{ scale: 0.995 }}
                onClick={() =>
                  append({
                    toolId: 'chatgpt',
                    planName: 'ChatGPT Team',
                    monthlySpend: '',
                    seatsCount: '',
                  })
                }
                className="w-full border border-dashed border-white/5 bg-[#0A0A0C]/30 hover:bg-[#0A0A0C]/60 text-neutral-400 hover:text-white transition-colors text-xs font-mono py-4 flex items-center justify-center space-x-2 rounded-2xl"
              >
                <Plus className="w-4 h-4" />
                <span>Add Additional Tool</span>
              </motion.button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-[#0A0A0C] border border-white/5 p-6 space-y-6 rounded-2xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-indigo-400" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                    Live Spend Summary
                  </span>
                </div>

                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </div>

              <div className="space-y-3 font-mono">
                <div className="bg-[#111115]/60 border border-white/5 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-neutral-400">Tracked Tools</span>

                  <span className="text-sm font-bold text-white">{watchedTools.length}</span>
                </div>

                <div className="bg-[#111115]/60 border border-white/5 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-neutral-400">Team Size</span>

                  <span className="text-sm font-bold text-neutral-300">
                    {watchedTeamSize} Seats
                  </span>
                </div>

                <div className="bg-[#111115]/60 border border-white/5 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-neutral-400">Monthly Spend</span>

                  <span className="text-sm font-bold text-emerald-400">
                    ${estimatedMonthlySpend.toLocaleString()}
                  </span>
                </div>

                <div className="bg-gradient-to-b from-[#13131A] to-[#111115] border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold block">
                    Estimated Yearly Spend
                  </span>

                  <div className="text-2xl font-bold tracking-tight text-white flex items-center">
                    <DollarSign className="w-5 h-5 text-neutral-500 shrink-0" />

                    <span>{estimatedYearlySpend.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl flex items-start space-x-2.5 text-[11px] text-neutral-400 leading-normal">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />

                <span>
                  Values update live as you configure your AI stack. Final audit recommendations are
                  generated after submission.
                </span>
              </div>

              <motion.button
                type="submit"
                whileHover={{
                  y: -1,
                  scale: 1.01,
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.2)',
                }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium tracking-wide text-xs py-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
              >
                <span>Generate Audit Report</span>

                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </motion.button>

              <p className="text-[11px] text-neutral-500 text-center">
                No credit card required • Read-only analysis • Takes ~3 minutes
              </p>
            </motion.div>
          </div>
        </form>
      </main>
    </div>
  );
}
