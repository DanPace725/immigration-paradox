"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Scale,
  ShieldAlert,
  RefreshCw
} from "lucide-react";
import { vignettes } from "@/data/vignettes";
import { crimeQuestions } from "@/data/crimeQuestions";

interface StatusStats {
  configured: boolean;
  sessionStats?: {
    total_sessions: string;
    avg_score: string;
    avg_deport_yes: string;
    total_deport_yes: string;
  };
  vignetteStats?: Array<{
    vignette_id: number;
    total_responses: string;
    q1_correct: string;
    q2_correct: string;
    deport_yes: string;
    deport_no: string;
    deport_unsure: string;
  }>;
}

interface CrimeStats {
  configured: boolean;
  sessionStats?: {
    total_sessions: string;
    avg_perception_gap: string;
    avg_accuracy: string;
  };
  questionStats?: Array<{
    question_id: number;
    total_responses: string;
    correct_count: string;
    correct_percentage: string;
  }>;
}

export default function InsightsPage() {
  const [statusStats, setStatusStats] = useState<StatusStats | null>(null);
  const [crimeStats, setCrimeStats] = useState<CrimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statusRes, crimeRes] = await Promise.all([
        fetch("/api/responses"),
        fetch("/api/crime-responses"),
      ]);

      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatusStats(data);
      }
      
      if (crimeRes.ok) {
        const data = await crimeRes.json();
        setCrimeStats(data);
      }
    } catch (err) {
      setError("Failed to load statistics. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statusTotalSessions = parseInt(statusStats?.sessionStats?.total_sessions || "0");
  const crimeTotalSessions = parseInt(crimeStats?.sessionStats?.total_sessions || "0");
  const totalResponses = statusTotalSessions + crimeTotalSessions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 pt-20 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-black text-white tracking-tight">
              Community Insights
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See how others have responded to the quizzes. All data is anonymous.
          </p>
          
          <button
            onClick={fetchStats}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-center">
            <AlertCircle className="inline-block w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">
              {loading ? "..." : totalResponses.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">Total Quiz Completions</div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <Scale className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">
              {loading ? "..." : statusTotalSessions.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">Status Quiz Completions</div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">
              {loading ? "..." : crimeTotalSessions.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">Crime Quiz Completions</div>
          </div>
        </div>

        {/* No Data Message */}
        {!loading && totalResponses === 0 && (
          <div className="text-center py-16 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Data Yet</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Be one of the first to take the quizzes! Your responses will help build 
              this community insight dashboard.
            </p>
          </div>
        )}

        {/* Status Quiz Stats */}
        {statusStats?.configured && statusTotalSessions > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Status vs. Compliance Quiz</h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-violet-900/30 to-violet-800/20 border border-violet-700/50 rounded-xl p-5">
                <div className="text-sm text-violet-300 mb-1">Average Score</div>
                <div className="text-3xl font-bold text-white">
                  {parseFloat(statusStats.sessionStats?.avg_score || "0").toFixed(1)}
                  <span className="text-lg text-slate-400"> / {vignettes.length * 2}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  ({((parseFloat(statusStats.sessionStats?.avg_score || "0") / (vignettes.length * 2)) * 100).toFixed(0)}% accuracy)
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-xl p-5">
                <div className="text-sm text-amber-300 mb-1">Avg. "Should Deport" per Quiz</div>
                <div className="text-3xl font-bold text-white">
                  {parseFloat(statusStats.sessionStats?.avg_deport_yes || "0").toFixed(1)}
                  <span className="text-lg text-slate-400"> / {vignettes.length}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  vignettes where people said "Yes"
                </div>
              </div>
            </div>

            {/* Per-Vignette Breakdown */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="font-semibold text-white">Response Breakdown by Scenario</h3>
              </div>
              <div className="divide-y divide-slate-700/50">
                {statusStats.vignetteStats?.map((stat) => {
                  const vignette = vignettes.find(v => v.id === stat.vignette_id);
                  const total = parseInt(stat.total_responses);
                  const q1Pct = total > 0 ? (parseInt(stat.q1_correct) / total) * 100 : 0;
                  const q2Pct = total > 0 ? (parseInt(stat.q2_correct) / total) * 100 : 0;
                  const deportYes = parseInt(stat.deport_yes);
                  const deportNo = parseInt(stat.deport_no);
                  const deportUnsure = parseInt(stat.deport_unsure);
                  
                  return (
                    <div key={stat.vignette_id} className="p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="font-medium text-white">
                            {vignette?.person}: {vignette?.title}
                          </div>
                          <div className="text-sm text-slate-400">
                            {total.toLocaleString()} responses
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Legal Status Question</div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all" 
                              style={{ width: `${q1Pct}%` }}
                            />
                          </div>
                          <div className="text-slate-300 mt-1">{q1Pct.toFixed(0)}% correct</div>
                        </div>
                        
                        <div>
                          <div className="text-slate-400 mb-1">Compliance Question</div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 transition-all" 
                              style={{ width: `${q2Pct}%` }}
                            />
                          </div>
                          <div className="text-slate-300 mt-1">{q2Pct.toFixed(0)}% correct</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-slate-400 text-sm mb-1">Deportation Opinion</div>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded">
                            Yes: {deportYes}
                          </span>
                          <span className="px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded">
                            No: {deportNo}
                          </span>
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded">
                            Unsure: {deportUnsure}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Crime Quiz Stats */}
        {crimeStats?.configured && crimeTotalSessions > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Crime Statistics Quiz</h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-xl p-5">
                <div className="text-sm text-amber-300 mb-1">Average Accuracy</div>
                <div className="text-3xl font-bold text-white">
                  {parseFloat(crimeStats.sessionStats?.avg_accuracy || "0").toFixed(0)}%
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  of questions answered correctly
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-rose-900/30 to-rose-800/20 border border-rose-700/50 rounded-xl p-5">
                <div className="text-sm text-rose-300 mb-1">Average Perception Gap</div>
                <div className="text-3xl font-bold text-white">
                  {parseFloat(crimeStats.sessionStats?.avg_perception_gap || "0").toFixed(0)}%
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  of answers differed from data
                </div>
              </div>
            </div>

            {/* Per-Question Breakdown */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700/50">
                <h3 className="font-semibold text-white">Accuracy by Question</h3>
                <p className="text-sm text-slate-400">
                  Questions sorted by difficulty (hardest first)
                </p>
              </div>
              <div className="divide-y divide-slate-700/50">
                {crimeStats.questionStats
                  ?.slice()
                  .sort((a, b) => parseFloat(a.correct_percentage) - parseFloat(b.correct_percentage))
                  .map((stat) => {
                    const question = crimeQuestions.find(q => q.id === stat.question_id);
                    const correctPct = parseFloat(stat.correct_percentage);
                    const total = parseInt(stat.total_responses);
                    
                    // Color based on difficulty
                    const barColor = correctPct < 30 
                      ? "bg-red-500" 
                      : correctPct < 50 
                        ? "bg-amber-500" 
                        : correctPct < 70 
                          ? "bg-yellow-500" 
                          : "bg-emerald-500";
                    
                    return (
                      <div key={stat.question_id} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 mb-1">
                              {question?.category}
                            </div>
                            <div className="font-medium text-white text-sm">
                              {question?.question}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-2xl font-bold text-white">
                              {correctPct.toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-400">
                              {total} responses
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} transition-all`}
                            style={{ width: `${correctPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Methodology Note */}
        <div className="mt-10 p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            About This Data
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            All responses are collected anonymously. No personal information is stored. 
            Statistics update in real-time as more people complete the quizzes. 
            This data helps illustrate common misconceptions about immigration 
            and provides insight into how people&apos;s intuitions compare to research findings.
          </p>
        </div>
      </div>
    </div>
  );
}
