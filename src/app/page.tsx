"use client";

import Link from "next/link";
import { Scale, ShieldAlert, ChevronRight, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-3xl w-full">
        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Immigration
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              Reality Check
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Interactive tools exploring common assumptions about U.S. immigration.
            Test your knowledge. Form your opinions. See the implications.
          </p>
        </div>

        {/* Quiz Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Quiz Card */}
          <Link href="/status" className="group">
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 h-full">
              <div className="bg-gradient-to-r from-cyan-900/30 to-cyan-800/10 p-6 border-b border-slate-700/50">
                <Scale className="w-12 h-12 text-cyan-400 mb-3" />
                <h2 className="text-2xl font-bold text-white mb-1">
                  Status vs. Compliance
                </h2>
                <p className="text-cyan-400/80 text-sm font-medium">
                  The Immigration Paradox
                </p>
              </div>
              <div className="p-6">
                <p className="text-slate-400 mb-4">
                  Is &quot;being here legally&quot; the same as &quot;following the rules&quot;? 
                  Explore real scenarios where legal status and compliance diverge.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-cyan-500" />
                    6 case studies based on real pathways
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-cyan-500" />
                    Policy implications with scale estimates
                  </li>
                </ul>
                <div className="flex items-center text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                  Start Assessment
                  <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Crime Quiz Card */}
          <Link href="/crime" className="group">
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden hover:border-rose-500/50 transition-all duration-300 h-full">
              <div className="bg-gradient-to-r from-rose-900/30 to-rose-800/10 p-6 border-b border-slate-700/50">
                <ShieldAlert className="w-12 h-12 text-rose-400 mb-3" />
                <h2 className="text-2xl font-bold text-white mb-1">
                  Crime Statistics
                </h2>
                <p className="text-rose-400/80 text-sm font-medium">
                  Perception vs. Reality
                </p>
              </div>
              <div className="p-6">
                <p className="text-slate-400 mb-4">
                  What do the data actually show about immigrant crime rates? 
                  Test your assumptions against peer-reviewed research.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-rose-500" />
                    Research-backed statistics
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-rose-500" />
                    Compare intuitions to data
                  </li>
                </ul>
                <div className="flex items-center text-rose-400 font-semibold group-hover:text-rose-300 transition-colors">
                  Start Assessment
                  <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            These tools present factual information from government sources and 
            peer-reviewed research. No moral judgments are assigned. 
            You are free to form your own conclusions.
          </p>
        </div>
      </div>
    </div>
  );
}
