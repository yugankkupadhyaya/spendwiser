'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function SpendWiseLandingPage() {
  const [currentSpend, setCurrentSpend] = useState<number>(8500);

  const estimatedSavings = Math.round(currentSpend * 0.34);
  const wastedSeatsCount = Math.max(2, Math.round(currentSpend / 1200));

  const [actionOneResolved, setActionOneResolved] = useState(false);
  const [actionTwoResolved, setActionTwoResolved] = useState(false);
  const [actionThreeResolved, setActionThreeResolved] = useState(false);

  return (
    <div className="bg-[#07090E] text-[#E2E8F0] min-h-screen antialiased selection:bg-indigo-600/30 selection:text-white">
      {/* TOP BAR */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-transparent to-violet-950/40 text-center py-2.5 border-b border-slate-900 text-xs tracking-wide font-medium text-slate-300">
        📊 Startups typically reduce raw monthly AI spend by{' '}
        <span className="text-emerald-400 font-bold font-mono">20% – 40%</span>
      </div>

      {/* NAVBAR */}
      <nav className="border-b border-slate-900 bg-[#07090E]/90 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden">
              <div className="absolute inset-[1px] rounded-xl bg-[#07090E]" />

              <span className="relative z-10 text-white font-black text-sm tracking-tight">SW</span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-[0.22em] uppercase text-white">
                SpendWise
              </span>

              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">
                AI Spend Audit
              </span>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Link href="/audit" className="hover:text-white transition-colors">
              Audit Preview
            </Link>

            <Link href="/audit" className="hover:text-white transition-colors">
              How It Works
            </Link>

            <Link href="/audit" className="hover:text-white transition-colors">
              Savings Simulator
            </Link>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/audit"
          className="bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-sm font-bold tracking-wide transition-all uppercase text-xs"
        >
          Run Free Audit
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative pt-20 pb-24 border-b border-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111522_1px,transparent_1px),linear-gradient(to_bottom,#111522_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50"></div>

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
            <Link
              href="/audit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 transition-all rounded-sm shadow-lg shadow-indigo-600/10 text-center"
            >
              Run Free Audit
            </Link>

            <Link
              href="/audit"
              className="w-full sm:w-auto border border-slate-800 bg-[#0C101A] hover:border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-xs px-8 py-4 transition-all rounded-sm text-center"
            >
              See Example Report ↓
            </Link>
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
                Read-Only OAuth Sync
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI SECTION */}
      <section className="py-24 bg-[#090C14] border-t border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">
              Interactive ROI Predictor
            </div>

            <h2 className="text-3xl font-normal tracking-tight text-white">
              Simulate your internal waste clearance.
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Estimate how much your company could save by optimizing AI tooling and removing unused
              subscriptions.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#0E1322] border border-slate-900 p-6 lg:p-8 space-y-8 rounded-sm shadow-2xl">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">
                <span>Estimated Monthly AI Spend</span>

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
                  Inactive Seats Found
                </span>

                <span className="text-2xl font-bold font-mono text-indigo-400 tracking-tight">
                  {wastedSeatsCount} Seats
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center border-t border-slate-900">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            Ready to optimize your AI stack?
          </h2>

          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Audit your AI subscriptions in minutes and uncover unnecessary spending instantly.
          </p>

          <Link
            href="/audit"
            className="inline-flex items-center justify-center bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-wider text-xs px-10 py-4 rounded-sm transition-all"
          >
            Run Free Audit
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-950 bg-[#06080D] py-12 px-6 lg:px-16 text-slate-600 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center">
              <div className="absolute inset-[1px] rounded-lg bg-[#06080D]" />

              <span className="relative z-10 text-white font-black text-xs">SW</span>
            </div>

            <span className="font-bold uppercase text-slate-400 tracking-wider">
              SPENDWISE INC. © 2026
            </span>
          </div>

          <div className="flex space-x-8 text-slate-500">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>

            <Link href="/status" className="hover:text-slate-400 transition-colors">
              Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
