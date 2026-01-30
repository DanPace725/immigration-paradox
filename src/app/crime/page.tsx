"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldAlert,
  ExternalLink,
  AlertTriangle,
  BarChart3,
  Home,
  ArrowRight,
  Scale,
  Lightbulb,
  TrendingDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { crimeQuestions, calculatePerceptionGap } from "@/data/crimeQuestions";
import { ShareResults } from "@/components/ShareResults";

// Generate a simple UUID for session tracking
function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface UserAnswer {
  questionId: number;
  userAnswer: string;
  wasCorrect: boolean;
}

export default function CrimeQuiz() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<UserAnswer[]>([]);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const resultsRef = useRef<HTMLDivElement>(null);
  const currentQuestion = crimeQuestions[currentIndex];

  // Submit responses to the API
  const submitResponses = useCallback(async (
    history: UserAnswer[],
    sessId: string
  ) => {
    if (!sessId || history.length === 0) return;
    
    const results = calculatePerceptionGap(history);
    
    try {
      const response = await fetch("/api/crime-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessId,
          answerHistory: history,
          correctCount: results.correctIntuitions,
          totalQuestions: results.totalQuestions,
          perceptionGapPercent: results.gapPercentage,
        }),
      });

      if (!response.ok) {
        console.error("Failed to submit crime quiz responses");
      }
    } catch (error) {
      console.error("Error submitting crime quiz responses:", error);
    }
  }, []);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setQuizFinished(false);
    setAnswerHistory([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setSessionId(generateSessionId()); // New session for retakes
  };

  const handleAnswerSelect = (value: string) => {
    if (showFeedback) return;
    setSelectedAnswer(value);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowFeedback(true);
  };

  const handleNext = () => {
    const wasCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer!,
      wasCorrect,
    };

    const newHistory = [...answerHistory, newAnswer];
    setAnswerHistory(newHistory);

    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentIndex < crimeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
      submitResponses(newHistory, sessionId);
    }
  };

  const getProgress = () => {
    return ((currentIndex + 1) / crimeQuestions.length) * 100;
  };

  const getSurpriseIcon = (level: string) => {
    switch (level) {
      case "high":
        return <Lightbulb className="text-amber-400" size={20} />;
      case "medium":
        return <BarChart3 className="text-cyan-400" size={20} />;
      default:
        return <TrendingDown className="text-slate-400" size={20} />;
    }
  };

  // --- INTRO SCREEN ---
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 pt-20 font-sans">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-rose-900/20 via-slate-800/50 to-rose-900/20 p-8 text-center border-b border-slate-700/50">
              <ShieldAlert className="w-16 h-16 text-rose-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Crime Statistics
              </h1>
              <p className="text-slate-400 text-lg font-light">
                Perception vs. Reality
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-6 mb-8">
                <div className="bg-rose-950/30 border border-rose-800/30 p-5 rounded-xl">
                  <p className="text-slate-300 leading-relaxed">
                    Public perception of immigrant crime rates often diverges
                    significantly from what the data actually shows. This
                    assessment tests your intuitions against{" "}
                    <strong className="text-rose-400">peer-reviewed research</strong> and{" "}
                    <strong className="text-rose-400">official statistics</strong>.
                  </p>
                </div>

                <p className="text-slate-400">
                  For each question, select what you believe to be true. Then
                  see how the research compares.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                      <BarChart3 size={18} className="text-rose-400" />
                    </div>
                    <span>8 questions based on published research</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                      <Lightbulb size={18} className="text-amber-400" />
                    </div>
                    <span>Discover where perception differs from data</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                      <ExternalLink size={18} className="text-cyan-400" />
                    </div>
                    <span>Access primary sources for every statistic</span>
                  </li>
                </ul>

                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-sm text-slate-400">
                  <AlertTriangle size={16} className="inline mr-2 text-amber-500" />
                  All data comes from government agencies, academic institutions,
                  and nonpartisan research organizations. Sources provided for
                  every question.
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 text-lg"
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
    const results = calculatePerceptionGap(answerHistory);
    const correctCount = answerHistory.filter((a) => a.wasCorrect).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 pt-20 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Shareable Results Section */}
          <div ref={resultsRef}>
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-rose-900/20 via-slate-800/50 to-rose-900/20 p-8 text-center border-b border-slate-700/50">
                <p className="text-rose-400 text-sm font-medium mb-2">
                  Crime Statistics Assessment
                </p>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Assessment Complete
                </h2>
                <div className="text-6xl font-black text-rose-400 mb-2">
                  {correctCount} / {crimeQuestions.length}
                </div>
                <p className="text-slate-400">
                  Your intuitions matched the research data
                </p>
              </div>

              <div className="p-8">
                {results.gapPercentage > 50 ? (
                  <div className="bg-amber-950/30 border border-amber-800/30 p-6 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Significant Perception Gap
                        </h3>
                        <p className="text-amber-200">
                          Your intuitions differed from the research data on{" "}
                          <strong>{results.gapPercentage}%</strong> of questions.
                          This is common—media coverage and political rhetoric
                          often create impressions that diverge from aggregate
                          statistics.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : results.gapPercentage > 25 ? (
                  <div className="bg-cyan-950/30 border border-cyan-800/30 p-6 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Moderate Perception Gap
                        </h3>
                        <p className="text-cyan-200">
                          Your intuitions differed from the data on{" "}
                          <strong>{results.gapPercentage}%</strong> of questions.
                          You had a relatively good sense of the trends, though
                          some findings may have been surprising.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/30 border border-emerald-800/30 p-6 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Well-Calibrated Understanding
                        </h3>
                        <p className="text-emerald-200">
                          Your intuitions closely matched the research data.
                          You appear to have a well-informed understanding of
                          immigrant crime statistics.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl text-slate-400 text-sm">
                  <strong className="text-slate-300">Key Takeaway:</strong> The
                  consistent finding across 150 years of data is that immigrants
                  have lower crime rates than native-born citizens. This gap has
                  actually widened since 1960. The "immigrant crime wave"
                  narrative is not supported by aggregate crime statistics from
                  any major data source.
                </div>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-8">
            <ShareResults
              targetRef={resultsRef}
              filename="crime-statistics-results"
            />
          </div>

          {/* Individual Results */}
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-slate-400" />
            Question-by-Question Results
          </h3>
          <div className="space-y-4 mb-8">
            {answerHistory.map((answer, idx) => {
              const question = crimeQuestions.find(
                (q) => q.id === answer.questionId
              )!;
              const userOption = question.options.find(
                (o) => o.value === answer.userAnswer
              );

              return (
                <div
                  key={idx}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-900/30 text-rose-400 px-2 py-0.5 rounded text-xs font-mono">
                          {question.category}
                        </span>
                        {getSurpriseIcon(question.surprise)}
                      </div>
                      {answer.wasCorrect ? (
                        <span className="bg-emerald-900/30 text-emerald-300 border border-emerald-700/50 px-3 py-1 rounded-full text-xs font-semibold">
                          ✓ Matched Data
                        </span>
                      ) : (
                        <span className="bg-amber-900/30 text-amber-300 border border-amber-700/50 px-3 py-1 rounded-full text-xs font-semibold">
                          Gap Found
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-white mb-3">
                      {question.question}
                    </h4>

                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      <div
                        className={`p-3 rounded-lg border ${
                          answer.wasCorrect
                            ? "bg-emerald-950/30 border-emerald-700/50"
                            : "bg-rose-950/30 border-rose-700/50"
                        }`}
                      >
                        <span className="block text-xs uppercase text-slate-500 mb-1">
                          You Predicted
                        </span>
                        <span
                          className={`font-semibold ${
                            answer.wasCorrect
                              ? "text-emerald-300"
                              : "text-rose-300"
                          }`}
                        >
                          {userOption?.label}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg border bg-cyan-950/30 border-cyan-700/50">
                        <span className="block text-xs uppercase text-slate-500 mb-1">
                          Actual Data
                        </span>
                        <span className="font-semibold text-cyan-300">
                          {question.actualData}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4">
                      {question.explanation}
                    </p>

                    {/* Expandable sources */}
                    <button
                      onClick={() =>
                        setExpandedSources(expandedSources === idx ? null : idx)
                      }
                      className="text-rose-400 hover:text-rose-300 text-sm flex items-center gap-1"
                    >
                      {expandedSources === idx ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                      View Sources
                    </button>
                    {expandedSources === idx && (
                      <div className="mt-3 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 space-y-2">
                        {question.sources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            <ExternalLink size={12} className="inline mr-1" />
                            {source.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
              href="/status"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Try Status Quiz
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
          {currentIndex + 1} of {crimeQuestions.length}
        </span>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-3xl w-full bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-rose-900/30 text-rose-400 px-2 py-0.5 rounded text-xs font-mono">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {currentQuestion.question}
          </h2>
          {currentQuestion.context && (
            <p className="text-slate-400 text-sm mt-2">
              {currentQuestion.context}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          {!showFeedback ? (
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === option.value
                      ? "bg-rose-600/20 border-rose-500 text-white"
                      : "border-slate-600 text-slate-300 hover:border-rose-500/50 hover:text-white"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              {/* Show result */}
              <div
                className={`p-6 rounded-xl border-l-4 mb-6 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "bg-emerald-950/30 border-emerald-500"
                    : "bg-amber-950/30 border-amber-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={24} />
                  ) : (
                    <Lightbulb className="text-amber-400 flex-shrink-0 mt-0.5" size={24} />
                  )}
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      {selectedAnswer === currentQuestion.correctAnswer
                        ? "Your intuition matched the data!"
                        : "Perception Gap Found"}
                    </h3>
                    <p className="text-2xl font-bold text-cyan-400 mb-2">
                      Actual: {currentQuestion.actualData}
                    </p>
                    <p className="text-slate-300 text-sm">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show all options with correct marked */}
              <div className="space-y-2 mb-6">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option.value;
                  const isCorrect = option.isCorrect;

                  return (
                    <div
                      key={option.value}
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? "bg-emerald-950/30 border-emerald-700/50"
                          : isSelected
                          ? "bg-rose-950/30 border-rose-700/50"
                          : "border-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCorrect && (
                          <CheckCircle size={16} className="text-emerald-400" />
                        )}
                        {isSelected && !isCorrect && (
                          <XCircle size={16} className="text-rose-400" />
                        )}
                        <span
                          className={`${
                            isCorrect
                              ? "text-emerald-300"
                              : isSelected
                              ? "text-rose-300"
                              : "text-slate-400"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sources */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">
                  Sources
                </h4>
                <div className="space-y-1">
                  {currentQuestion.sources.map((source, sIdx) => (
                    <a
                      key={sIdx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      <ExternalLink size={12} className="inline mr-1" />
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto">
            {!showFeedback ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed hover:from-rose-500 hover:to-rose-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {currentIndex < crimeQuestions.length - 1
                  ? "Next Question"
                  : "See Results"}
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
