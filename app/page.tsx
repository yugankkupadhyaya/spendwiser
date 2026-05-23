'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  ArrowRight,
  Check,
  AlertTriangle,
  TrendingUp,
  Users,
  Layers3,
  FileText,
  HelpCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function Page() {
  // --- Calculator State ---
  const [currentSpend, setCurrentSpend] = useState<number>(8500);

  // Formulas grounded in real-world startup audit metrics (~32% average waste discovered)
  const estimatedSavings = Math.round(currentSpend * 0.34);
  const wastedSeatsCount = Math.max(2, Math.round(currentSpend / 1200));

  // --- Interactive Demo Audit States ---
  const [actionOneResolved, setActionOneResolved] = useState<boolean>(false);
  const [actionTwoResolved, setActionTwoResolved] = useState<boolean>(false);
  const [actionThreeResolved, setActionThreeResolved] = useState<boolean>(false);

  return (
    <div className="bg-[#07090E] text-[#E2E8F0] antialiased font-sans min-h-screen selection:bg-indigo-600/30 selection:text-white">
      {/* ================= TOP TRUST STRIP ================= */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-transparent to-violet-950/40 text-center py-2.5 border-b border-slate-900 text-xs tracking-wide font-medium text-slate-300">
        📊 Startups typically reduce raw monthly AI spend by{' '}
        <span className="text-emerald-400 font-bold font-mono">20% – 40%</span> within the first 48
        hours.
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="border-b border-slate-900 bg-[#07090E]/90 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          <a href="#" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-black tracking-tighter text-sm rounded-sm">
              L
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-white font-mono">
              LANDER
            </span>
          </a>
          <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#audit-preview" className="hover:text-white transition-colors">
              Audit Preview
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#calculator" className="hover:text-white transition-colors">
              Savings Simulator
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-xs font-semibold uppercase tracking-wider">
          <a
            href="#audit-preview"
            className="bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-sm font-bold tracking-wide transition-all uppercase"
          >
            Run Free Audit
          </a>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-24 border-b border-slate-900 overflow-hidden">
        {/* Structural Tech Minimalist Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111522_1px,transparent_1px),linear-gradient(to_bottom,#111522_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-bold tracking-widest uppercase text-indigo-400 rounded-sm">
            ⚡️ Over $2.1M+ in wasted AI subscription spend identified this quarter
          </div>

          <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-white max-w-3xl mx-auto leading-[1.1]">
            Stop overpaying for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-white font-semibold">
              AI tools.
            </span>
          </h1>

          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Instantly audit ChatGPT, Claude, Cursor, Gemini, and API spend across your team.
            Discover unused licenses, downgrade bloated plans, and stop model bill leakage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
            <a
              href="#audit-preview"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 transition-all rounded-sm shadow-lg shadow-indigo-600/10 text-center"
            >
              Run Free Audit
            </a>
            <a
              href="#audit-preview"
              className="w-full sm:w-auto border border-slate-800 bg-[#0C101A] hover:border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-xs px-8 py-4 transition-all rounded-sm text-center"
            >
              See Example Report ↓
            </a>
          </div>

          <div className="pt-12 border-t border-slate-900 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-xl font-bold font-mono text-white">5 Minutes</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Setup Time
              </div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-emerald-400">34.2%</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Average Cut Cost
              </div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-white">100% Safe</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Read-Only Oauth Sync
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REAL AUDIT PREVIEW SECTION ================= */}
      <section id="audit-preview" className="py-24 bg-[#090C14] border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">
              Live Dashboard Preview
            </div>
            <h2 className="text-3xl font-normal tracking-tight text-white">
              See exactly where your cash is leaking.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Lander securely indexes your software subscriptions and key configurations in minutes.
              No infrastructure modifications required. Try resolving the example anomalies in our
              live simulator wrapper.
            </p>
            <div className="space-y-3 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Identifies inactive developer seats automatically
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Flags expensive models used for simple tasks
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#07090E] border border-slate-900 rounded-sm shadow-2xl overflow-hidden font-mono">
            {/* Dashboard Header Window */}
            <div className="bg-[#0E1322] px-5 py-3.5 border-b border-slate-900 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="text-white font-bold text-[11px] uppercase tracking-wider">
                  Lander Spend Audit Summary
                </span>
              </div>
              <span className="text-rose-400 text-[11px] bg-rose-950/40 border border-rose-900/60 px-2 py-0.5 rounded-sm">
                ⚠️ 3 Budget Leaks Found
              </span>
            </div>

            {/* Audit Findings Stack */}
            <div className="p-6 space-y-4 text-xs">
              {/* Finding 1 */}
              <div
                className={`p-4 border rounded-sm transition-all ${actionOneResolved ? 'bg-slate-900/20 border-slate-900 opacity-50' : 'bg-rose-950/10 border-rose-900/40'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-900/30 text-rose-300 border border-rose-900/50 rounded-sm">
                      Cursor Pro
                    </span>
                    <h4 className="text-white font-bold text-sm pt-1">
                      9 Unused Engineering Seats
                    </h4>
                    <p className="text-slate-400 font-sans text-xs">
                      These users haven&apos;t committed code or authenticated with Cursor keys in
                      the past 30 days.
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-rose-400 font-bold text-sm">-$180/mo</div>
                    <button
                      onClick={() => setActionOneResolved(true)}
                      disabled={actionOneResolved}
                      className={`mt-2 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-sm transition-all ${actionOneResolved ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-200'}`}
                    >
                      {actionOneResolved ? 'Removed' : 'Remove Seats'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding 2 */}
              <div
                className={`p-4 border rounded-sm transition-all ${actionTwoResolved ? 'bg-slate-900/20 border-slate-900 opacity-50' : 'bg-amber-950/10 border-amber-900/40'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-900/30 text-amber-300 border border-amber-900/50 rounded-sm">
                      ChatGPT Team Plan
                    </span>
                    <h4 className="text-white font-bold text-sm pt-1">
                      Duplicate Licensing Detected
                    </h4>
                    <p className="text-slate-400 font-sans text-xs">
                      4 employees are billed on the team corporate dashboard while maintaining
                      separate personal Plus seats.
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-amber-400 font-bold text-sm">-$120/mo</div>
                    <button
                      onClick={() => setActionTwoResolved(true)}
                      disabled={actionTwoResolved}
                      className={`mt-2 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-sm transition-all ${actionTwoResolved ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-200'}`}
                    >
                      {actionTwoResolved ? 'Downgraded' : 'Consolidate'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding 3 */}
              <div
                className={`p-4 border rounded-sm transition-all ${actionThreeResolved ? 'bg-slate-900/20 border-slate-900 opacity-50' : 'bg-indigo-950/10 border-indigo-900/40'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-indigo-900/30 text-indigo-300 border border-indigo-900/50 rounded-sm">
                      OpenAI API Layer
                    </span>
                    <h4 className="text-white font-bold text-sm pt-1">
                      High-Cost Structural Precision Waste
                    </h4>
                    <p className="text-slate-400 font-sans text-xs">
                      Standard text classification loops are running on high-cost premium models.
                      Lander spots cheaper structural equivalents instantly.
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-indigo-400 font-bold text-sm">Save 64%</div>
                    <button
                      onClick={() => setActionThreeResolved(true)}
                      disabled={actionThreeResolved}
                      className={`mt-2 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-sm transition-all ${actionThreeResolved ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-200'}`}
                    >
                      {actionThreeResolved ? 'Optimized' : 'Find Cheaper Alternatives'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 space-y-16">
        <div className="max-w-2xl space-y-4">
          <div className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">
            Everything You Need To Cut Costs
          </div>
          <h2 className="text-2xl sm:text-4xl tracking-tight font-normal text-white">
            Actionable features designed for operational clarity.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="border border-slate-900 bg-[#0B0F19] p-8 space-y-4 hover:border-slate-800 transition-all rounded-sm">
            <div className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">
              FEATURE 01
            </div>
            <h4 className="text-lg font-medium text-white">Detect wasted AI spend</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Lander scans your business credit profiles and software endpoints to expose empty
              engineering seats, repetitive subscriptions, and orphaned accounts.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-slate-900 bg-[#0B0F19] p-8 space-y-4 hover:border-slate-800 transition-all rounded-sm">
            <div className="text-xs font-bold font-mono text-violet-400 uppercase tracking-wider">
              FEATURE 02
            </div>
            <h4 className="text-lg font-medium text-white">Compare plans instantly</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Examine structural usage trends across the team to evaluate whether users require
              premium enterprise licensing or run cleanly on basic tires.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-slate-900 bg-[#0B0F19] p-8 space-y-4 hover:border-slate-800 transition-all rounded-sm">
            <div className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
              FEATURE 03
            </div>
            <h4 className="text-lg font-medium text-white">Benchmark your stack</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Contextualize your organizational asset volume footprint directly against peer metrics
              to identify operational pricing anomalies early.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="border border-slate-900 bg-[#0B0F19] p-8 space-y-4 hover:border-slate-800 transition-all rounded-sm">
            <div className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
              FEATURE 04
            </div>
            <h4 className="text-lg font-medium text-white">Share audit reports</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Export precise overview ledgers tracking clear cost clearance recommendations to sync
              optimization workflows with management effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ROI CALCULATOR ================= */}
      <section id="calculator" className="py-24 bg-[#090C14] border-t border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">
              Interactive ROI Predictor
            </div>
            <h2 className="text-3xl font-normal tracking-tight text-white">
              Simulate your internal waste clearance.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Slide the meter interface to align with your estimated monthly software bills. Watch
              Lander evaluate immediate allocation recovery windows instantly.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#0E1322] border border-slate-900 p-6 lg:p-8 space-y-8 rounded-sm shadow-2xl">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">
                <span>Estimated Current Monthly AI Tool Spend</span>
                <span className="text-white font-mono font-bold">
                  ${currentSpend.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={currentSpend}
                onChange={(e) => setCurrentSpend(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-950">
              <div className="bg-[#090C14] border border-slate-900 p-4 rounded-sm">
                <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase block">
                  Estimated Monthly Savings
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                  ${estimatedSavings.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#090C14] border border-slate-900 p-4 rounded-sm">
                <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase block">
                  Flagged Inactive Seats (Est)
                </span>
                <span className="text-2xl font-bold font-mono text-indigo-400 tracking-tight">
                  {wastedSeatsCount} Seats
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM HERO CTA ================= */}
      <section className="py-24 border-t border-slate-900 bg-gradient-to-b from-[#07090E] to-[#0A0D17] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            Ready to find wasted AI spend? <br />
            Takes 5 minutes to run.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Link up your read-only workspace environments. Clean out redundant configurations,
            eliminate unused licenses, and optimize your runway safely starting tonight with Lander.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-sm mx-auto pt-2">
            <a
              href="#audit-preview"
              className="w-full bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-wider text-xs py-4 transition-all rounded-sm text-center"
            >
              Run Free Audit
            </a>
          </div>

          <div className="pt-4 flex justify-center items-center space-x-6 text-slate-500 text-[11px] font-mono uppercase tracking-widest">
            <span>✓ Read-Only Compliance</span>
            <span>✓ No Credit Card Needed</span>
            <span>✓ Secure OAuth Sync</span>
          </div>
        </div>
      </section>

      {/* ================= MINIMALIST FOOTER ================= */}
      <footer className="border-t border-slate-950 bg-[#06080D] py-12 px-6 lg:px-16 text-slate-600 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-slate-800 text-slate-300 flex items-center justify-center font-black text-[10px] rounded-sm">
              L
            </div>
            <span className="font-bold uppercase text-slate-400 tracking-wider">
              LANDER INC. © 2026
            </span>
          </div>
          <div className="flex space-x-8 text-slate-500">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
