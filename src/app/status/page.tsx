"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Scale,
  Gavel,
  FileCheck,
  Users,
  ExternalLink,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Home,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { vignettes, calculateScaleImpact, formatNumber } from "@/data/vignettes";
import { pushbackResponses, closingNote } from "@/data/pushback";
import type { UserAnswers, AnswerHistoryItem } from "@/lib/types";
import { ShareResults } from "@/components/ShareResults";
import { PrintableResults } from "@/components/PrintableResults";

// Generate a simple UUID for session tracking
function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function StatusQuiz() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({
    q1: null,
    q2: null,
    deportationOpinion: null,
  });
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistoryItem[]>([]);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const [expandedPushback, setExpandedPushback] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [showPrintModal, setShowPrintModal] = useState(false);

  const currentVignette = vignettes[currentIndex];

  // Submit responses to the API
  const submitResponses = useCallback(async (
    history: AnswerHistoryItem[],
    finalScore: number,
    sessId: string
  ) => {
    if (!sessId || history.length === 0) return;
    
    setSubmissionStatus("submitting");
    
    const scaleImpact = calculateScaleImpact(history);
    
    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessId,
          score: finalScore,
          totalQuestions: vignettes.length,
          answerHistory: history,
          scaleImpact,
        }),
      });

      if (response.ok) {
        setSubmissionStatus("success");
      } else {
        console.error("Failed to submit responses");
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
      setSubmissionStatus("error");
    }
  }, []);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setAnswerHistory([]);
    setUserAnswers({ q1: null, q2: null, deportationOpinion: null });
    setShowFeedback(false);
    setSessionId(generateSessionId());
    setSubmissionStatus("idle");
  };

  const selectAnswer = (
    questionKey: "q1" | "q2",
    answer: "Yes" | "No"
  ) => {
    if (showFeedback) return;
    setUserAnswers((prev) => ({ ...prev, [questionKey]: answer }));
  };

  const handleSubmit = () => {
    setShowFeedback(true);

    let currentPoints = 0;
    if (userAnswers.q1 === currentVignette.q1.answer) currentPoints += 0.5;
    if (userAnswers.q2 === currentVignette.q2.answer) currentPoints += 0.5;

    setScore(score + currentPoints);
  };

  const handleDeportationAnswer = (answer: "Yes" | "No" | "Unsure") => {
    setUserAnswers((prev) => ({ ...prev, deportationOpinion: answer }));
  };

  const handleNext = () => {
    const points =
      (userAnswers.q1 === currentVignette.q1.answer ? 0.5 : 0) +
      (userAnswers.q2 === currentVignette.q2.answer ? 0.5 : 0);

    const newHistoryItem: AnswerHistoryItem = {
      ...currentVignette,
      userQ1: userAnswers.q1,
      userQ2: userAnswers.q2,
      deportationOpinion: userAnswers.deportationOpinion,
      points,
    };

    const newHistory = [...answerHistory, newHistoryItem];
    setAnswerHistory(newHistory);

    setShowFeedback(false);
    setUserAnswers({ q1: null, q2: null, deportationOpinion: null });

    if (currentIndex < vignettes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalScore = score + points;
      setQuizFinished(true);
      submitResponses(newHistory, finalScore, sessionId);
    }
  };

  const getProgress = () => {
    return ((currentIndex + 1) / vignettes.length) * 100;
  };

  const getConflictBadge = (type: string) => {
    switch (type) {
      case "Tragedy":
        return (
          <span className="bg-rose-900/30 text-rose-300 border border-rose-700/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            Systemic Failure
          </span>
        );
      case "Paradox":
        return (
          <span className="bg-violet-900/30 text-violet-300 border border-violet-700/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            Legal Paradox
          </span>
        );
      case "Nuanced":
        return (
          <span className="bg-amber-900/30 text-amber-300 border border-amber-700/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            Nuanced
          </span>
        );
      default:
        return (
          <span className="bg-slate-700/50 text-slate-300 border border-slate-600/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            Consistent
          </span>
        );
    }
  };

  // --- INTRO SCREEN ---
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 pt-20 font-sans">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-900/20 via-slate-800/50 to-violet-900/20 p-8 text-center border-b border-slate-700/50">
              <Scale className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Status vs. Compliance
              </h1>
              <p className="text-slate-400 text-lg font-light">
                The Immigration Paradox
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-6 mb-8">
                <div className="bg-cyan-950/30 border border-cyan-800/30 p-5 rounded-xl">
                  <p className="text-slate-300 leading-relaxed">
                    In U.S. immigration,{" "}
                    <strong className="text-cyan-400">&quot;Being Legal&quot;</strong> and{" "}
                    <strong className="text-cyan-400">&quot;Following the Rules&quot;</strong>{" "}
                    are not always the same thing.
                  </p>
                </div>

                <p className="text-slate-400">
                  For each case, you will answer two questions about legal status
                  and rule compliance—then share your own view.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                      <Gavel size={18} className="text-cyan-400" />
                    </div>
                    <span>Is this person currently here legally?</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                      <FileCheck size={18} className="text-violet-400" />
                    </div>
                    <span>Did they consistently comply with visa rules?</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                      <Users size={18} className="text-amber-400" />
                    </div>
                    <span>What policy would you apply—and to how many?</span>
                  </li>
                </ul>

                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-sm text-slate-400">
                  <AlertTriangle size={16} className="inline mr-2 text-amber-500" />
                  This tool presents factual scenarios. No moral judgments are
                  assigned. You are free to answer any way you choose.
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 text-lg"
              >
                Begin Assessment
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (quizFinished) {
    const scaleImpact = calculateScaleImpact(answerHistory);
    const deportYesCount = answerHistory.filter(
      (a) => a.deportationOpinion === "Yes"
    ).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 pt-20 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Results Summary */}
          <div>
            {/* Summary Header */}
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-cyan-900/20 via-slate-800/50 to-violet-900/20 p-8 text-center border-b border-slate-700/50">
                <p className="text-cyan-400 text-sm font-medium mb-2">Immigration Paradox Assessment</p>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Assessment Complete
                </h2>
                <div className="text-6xl font-black text-cyan-400 mb-2">
                  {score} / {vignettes.length}
                </div>
                <p className="text-slate-400">
                  Correct answers on legal status and compliance questions
                </p>
              </div>

              {/* Scale Impact Section */}
              {deportYesCount > 0 && (
                <div className="p-8 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="text-amber-400" size={24} />
                    <h3 className="text-xl font-bold text-white">
                      Scale of Your Position
                    </h3>
                  </div>
                  <p className="text-slate-400 mb-4">
                    You indicated deportation should apply in{" "}
                    <strong className="text-white">{deportYesCount}</strong> of{" "}
                    {vignettes.length} scenarios.
                  </p>
                  <div className="bg-amber-950/30 border border-amber-800/30 p-6 rounded-xl">
                    <p className="text-amber-200 text-lg">
                      Applied consistently, this position would affect an estimated:
                    </p>
                    <p className="text-4xl font-bold text-amber-400 mt-2">
                      {formatNumber(scaleImpact.low)} – {formatNumber(scaleImpact.high)}
                    </p>
                    <p className="text-amber-300/70 text-sm mt-2">
                      people in similar circumstances
                    </p>
                  </div>
                </div>
              )}

              {deportYesCount === 0 && (
                <div className="p-8 border-b border-slate-700/50">
                  <div className="bg-emerald-950/30 border border-emerald-800/30 p-6 rounded-xl">
                    <p className="text-emerald-300">
                      You did not indicate deportation for any of the presented
                      scenarios.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-8">
            <ShareResults onPrintClick={() => setShowPrintModal(true)} />
          </div>

          {/* See How Others Responded */}
          <div className="mb-8 text-center">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <BarChart3 size={18} />
              <span>See how others responded</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Print Modal */}
          {showPrintModal && (
            <PrintableResults
              type="status"
              score={score}
              totalQuestions={vignettes.length}
              answerHistory={answerHistory}
              scaleImpact={scaleImpact}
              deportYesCount={deportYesCount}
              onClose={() => setShowPrintModal(false)}
            />
          )}

          {/* Individual Results */}
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-slate-400" />
            Your Responses by Case
          </h3>
          <div className="space-y-4 mb-8">
            {answerHistory.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <h4 className="font-bold text-lg text-white">
                      {item.person}: {item.title}
                    </h4>
                    {getConflictBadge(item.conflictType)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div
                      className={`p-3 rounded-lg border ${
                        item.userQ1 === item.q1.answer
                          ? "bg-emerald-950/30 border-emerald-700/50"
                          : "bg-rose-950/30 border-rose-700/50"
                      }`}
                    >
                      <span className="block text-xs uppercase text-slate-500 mb-1">
                        Legal Status
                      </span>
                      <span
                        className={`font-semibold ${
                          item.userQ1 === item.q1.answer
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }`}
                      >
                        {item.userQ1 === item.q1.answer ? "✓" : "✗"} You said:{" "}
                        {item.userQ1} (Correct: {item.q1.answer})
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${
                        item.userQ2 === item.q2.answer
                          ? "bg-emerald-950/30 border-emerald-700/50"
                          : "bg-rose-950/30 border-rose-700/50"
                      }`}
                    >
                      <span className="block text-xs uppercase text-slate-500 mb-1">
                        Compliance
                      </span>
                      <span
                        className={`font-semibold ${
                          item.userQ2 === item.q2.answer
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }`}
                      >
                        {item.userQ2 === item.q2.answer ? "✓" : "✗"} You said:{" "}
                        {item.userQ2} (Correct: {item.q2.answer})
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-lg mb-4">
                    <span className="block text-xs uppercase text-slate-500 mb-1">
                      Your Opinion: Should {item.person} be deported?
                    </span>
                    <span
                      className={`font-bold ${
                        item.deportationOpinion === "Yes"
                          ? "text-rose-400"
                          : item.deportationOpinion === "No"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {item.deportationOpinion || "No answer"}
                    </span>
                    {item.deportationOpinion === "Yes" && (
                      <span className="text-slate-500 text-sm ml-2">
                        → Affects {item.scaleEstimate.toLowerCase()}{" "}
                        {item.scaleDescription}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm italic">
                    {item.conflictText}
                  </p>

                  <button
                    onClick={() =>
                      setExpandedSources(expandedSources === idx ? null : idx)
                    }
                    className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                  >
                    {expandedSources === idx ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                    Sources & Data
                  </button>
                  {expandedSources === idx && (
                    <div className="mt-3 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 space-y-2">
                      <p className="text-slate-400 text-sm mb-2">
                        <strong className="text-slate-300">Scale:</strong>{" "}
                        {item.scaleEstimate} {item.scaleDescription}
                      </p>
                      {item.sources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          <ExternalLink size={12} className="inline mr-1" />
                          {source.title}
                          {source.description && (
                            <span className="text-slate-500 ml-2">
                              – {source.description}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Further Reading / Pushback Section */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle size={20} className="text-violet-400" />
              Anticipated Responses to Criticism
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              Common critiques and factual responses. Click to expand.
            </p>
            <div className="space-y-2">
              {pushbackResponses.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedPushback(expandedPushback === idx ? null : idx)
                    }
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-slate-200 font-medium">
                      &quot;{item.statement}&quot;
                    </span>
                    {expandedPushback === idx ? (
                      <ChevronUp size={18} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-500" />
                    )}
                  </button>
                  {expandedPushback === idx && (
                    <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
                      {item.response}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-400 text-sm italic">
              {closingNote}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStart}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Retake Assessment
            </button>
            <Link
              href="/crime"
              className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Try Crime Statistics Quiz
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Home Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-300 text-sm inline-flex items-center gap-1"
            >
              <Home size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SCREEN ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 pt-20 font-sans">
      {/* Progress Bar */}
      <div className="max-w-3xl w-full mb-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-500 w-20">
          {currentIndex + 1} of {vignettes.length}
        </span>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-3xl w-full bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden min-h-[650px] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-700/50 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Case Study
            </span>
            <h2 className="text-xl font-bold text-white">
              {currentVignette.person}: {currentVignette.title}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-900/30">
            {currentVignette.person[0]}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          <p className="text-lg text-slate-300 leading-relaxed mb-8 pb-6 border-b border-slate-700/30">
            {currentVignette.scenario}
          </p>

          {!showFeedback ? (
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Question 1 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <Gavel className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <h3 className="font-bold text-white">
                    {currentVignette.q1.text}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {(["Yes", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectAnswer("q1", opt)}
                      className={`py-3 rounded-lg border-2 font-bold transition-all ${
                        userAnswers.q1 === opt
                          ? "bg-cyan-600 border-cyan-500 text-white"
                          : "border-slate-600 text-slate-400 hover:border-cyan-500 hover:text-cyan-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <FileCheck className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                  <h3 className="font-bold text-white">
                    {currentVignette.q2.text}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {(["Yes", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectAnswer("q2", opt)}
                      className={`py-3 rounded-lg border-2 font-bold transition-all ${
                        userAnswers.q2 === opt
                          ? "bg-violet-600 border-violet-500 text-white"
                          : "border-slate-600 text-slate-400 hover:border-violet-500 hover:text-violet-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              {/* Feedback Results */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl border-l-4 ${
                    userAnswers.q1 === currentVignette.q1.answer
                      ? "bg-emerald-950/30 border-emerald-500"
                      : "bg-rose-950/30 border-rose-500"
                  }`}
                >
                  <span className="text-xs uppercase font-bold text-slate-500">
                    Legal Status
                  </span>
                  <div className="flex items-start gap-2 mt-1">
                    {userAnswers.q1 === currentVignette.q1.answer ? (
                      <CheckCircle
                        size={18}
                        className="text-emerald-400 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="text-rose-400 flex-shrink-0 mt-0.5"
                      />
                    )}
                    <span className="font-semibold text-slate-200 text-sm leading-tight">
                      {currentVignette.q1.feedback}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border-l-4 ${
                    userAnswers.q2 === currentVignette.q2.answer
                      ? "bg-emerald-950/30 border-emerald-500"
                      : "bg-rose-950/30 border-rose-500"
                  }`}
                >
                  <span className="text-xs uppercase font-bold text-slate-500">
                    Compliance
                  </span>
                  <div className="flex items-start gap-2 mt-1">
                    {userAnswers.q2 === currentVignette.q2.answer ? (
                      <CheckCircle
                        size={18}
                        className="text-emerald-400 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="text-rose-400 flex-shrink-0 mt-0.5"
                      />
                    )}
                    <span className="font-semibold text-slate-200 text-sm leading-tight">
                      {currentVignette.q2.feedback}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation Panel */}
              <div className="bg-slate-900/80 border border-slate-700/50 p-6 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold uppercase tracking-wider text-sm">
                    Analysis
                  </span>
                  <span className="ml-auto">
                    {getConflictBadge(currentVignette.conflictType)}
                  </span>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {currentVignette.explanation}
                </p>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-cyan-400 font-bold block text-xs uppercase mb-1">
                    The Conflict
                  </span>
                  <span className="text-slate-400">
                    {currentVignette.conflictText}
                  </span>
                </div>
              </div>

              {/* Sources */}
              <button
                onClick={() =>
                  setExpandedSources(expandedSources === -1 ? null : -1)
                }
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 mb-4"
              >
                {expandedSources === -1 ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                View Sources & Statistics
              </button>
              {expandedSources === -1 && (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 space-y-2 mb-6">
                  <p className="text-slate-400 text-sm mb-2">
                    <strong className="text-slate-300">
                      Estimated Scale:
                    </strong>{" "}
                    {currentVignette.scaleEstimate}{" "}
                    {currentVignette.scaleDescription}
                  </p>
                  {currentVignette.sources.map((source, sIdx) => (
                    <a
                      key={sIdx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      <ExternalLink size={12} className="inline mr-1" />
                      {source.title}
                      {source.description && (
                        <span className="text-slate-500 ml-2">
                          – {source.description}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Deportation Question */}
              <div className="bg-amber-950/20 border border-amber-800/30 p-6 rounded-xl">
                <div className="flex items-start gap-2 mb-4">
                  <Users className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">
                      In your view, should {currentVignette.person} be deported?
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      This is your opinion—there is no correct answer.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["Yes", "No", "Unsure"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleDeportationAnswer(opt)}
                      className={`py-3 rounded-lg border-2 font-bold transition-all ${
                        userAnswers.deportationOpinion === opt
                          ? opt === "Yes"
                            ? "bg-rose-600 border-rose-500 text-white"
                            : opt === "No"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-amber-600 border-amber-500 text-white"
                          : "border-slate-600 text-slate-400 hover:border-amber-500 hover:text-amber-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {userAnswers.deportationOpinion === "Yes" && (
                  <p className="text-amber-400/80 text-sm mt-3">
                    Applied consistently, this would affect{" "}
                    <strong>{currentVignette.scaleEstimate.toLowerCase()}</strong>{" "}
                    {currentVignette.scaleDescription}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto">
            {!showFeedback ? (
              <button
                onClick={handleSubmit}
                disabled={!userAnswers.q1 || !userAnswers.q2}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                Check Answers
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!userAnswers.deportationOpinion}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed hover:from-violet-500 hover:to-violet-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {currentIndex < vignettes.length - 1
                  ? "Next Scenario"
                  : "See Final Results"}
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
