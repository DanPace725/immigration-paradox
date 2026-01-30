"use client";

import { useRef } from "react";
import { Printer, X } from "lucide-react";

interface StatusResult {
  person: string;
  title: string;
  userQ1: string | null;
  userQ2: string | null;
  q1: { answer: string };
  q2: { answer: string };
  deportationOpinion: string | null;
  conflictType: string;
  conflictText: string;
  scaleEstimate: string;
  scaleDescription: string;
  sources: { title: string; url: string }[];
}

interface CrimeResult {
  questionId: number;
  userAnswer: string;
  wasCorrect: boolean;
}

interface CrimeQuestion {
  id: number;
  category: string;
  question: string;
  actualData: string;
  sources: { title: string; url: string }[];
}

interface PrintableStatusResultsProps {
  type: "status";
  score: number;
  totalQuestions: number;
  answerHistory: StatusResult[];
  scaleImpact: { low: number; high: number };
  deportYesCount: number;
  onClose: () => void;
}

interface PrintableCrimeResultsProps {
  type: "crime";
  correctCount: number;
  totalQuestions: number;
  perceptionGap: number;
  answerHistory: CrimeResult[];
  questions: CrimeQuestion[];
  onClose: () => void;
}

type PrintableResultsProps = PrintableStatusResultsProps | PrintableCrimeResultsProps;

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " million";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + ",000+";
  }
  return num.toLocaleString();
}

export function PrintableResults(props: PrintableResultsProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (props.type === "status") {
    const { score, totalQuestions, answerHistory, scaleImpact, deportYesCount, onClose } = props;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 overflow-auto print-preview-modal">
        {/* Control bar - hidden when printing */}
        <div className="no-print sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="text-white font-semibold">Print Preview</div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
              <Printer size={18} />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <X size={18} />
              Close
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div ref={printRef} className="print-content bg-white text-black p-8 max-w-3xl mx-auto my-8 print:my-0 print:max-w-none">
          {/* Header */}
          <div className="border-b-2 border-slate-300 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Immigration Reality Check</h1>
            <p className="text-lg text-slate-600">Status vs. Compliance Assessment Results</p>
            <p className="text-sm text-slate-500 mt-2">{currentDate}</p>
          </div>

          {/* Score Summary */}
          <div className="bg-slate-100 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Knowledge Score</p>
                <p className="text-4xl font-bold text-slate-900">{score} / {totalQuestions}</p>
                <p className="text-sm text-slate-600">Correct answers on legal status and compliance</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Policy Position</p>
                <p className="text-4xl font-bold text-slate-900">{deportYesCount} / {totalQuestions}</p>
                <p className="text-sm text-slate-600">Cases where deportation was supported</p>
              </div>
            </div>

            {deportYesCount > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-300">
                <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Estimated Scale Impact</p>
                <p className="text-2xl font-bold text-amber-700">
                  {formatNumber(scaleImpact.low)} – {formatNumber(scaleImpact.high)} people
                </p>
                <p className="text-sm text-slate-600">
                  Applied consistently, your position would affect this many people in similar circumstances
                </p>
              </div>
            )}
          </div>

          {/* Case-by-Case Results */}
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Case-by-Case Results
          </h2>

          <div className="space-y-6">
            {answerHistory.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 page-break-inside-avoid">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900">
                    {idx + 1}. {item.person}: {item.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.conflictType === "Tragedy" ? "bg-red-100 text-red-700" :
                    item.conflictType === "Paradox" ? "bg-purple-100 text-purple-700" :
                    item.conflictType === "Nuanced" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {item.conflictType === "Tragedy" ? "Systemic Failure" :
                     item.conflictType === "Paradox" ? "Legal Paradox" :
                     item.conflictType === "Nuanced" ? "Nuanced" : "Consistent"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                  <div className={`p-2 rounded ${item.userQ1 === item.q1.answer ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-xs text-slate-500 mb-1">Legal Status</p>
                    <p className={item.userQ1 === item.q1.answer ? "text-green-700" : "text-red-700"}>
                      {item.userQ1 === item.q1.answer ? "✓" : "✗"} You: {item.userQ1} (Answer: {item.q1.answer})
                    </p>
                  </div>
                  <div className={`p-2 rounded ${item.userQ2 === item.q2.answer ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-xs text-slate-500 mb-1">Compliance</p>
                    <p className={item.userQ2 === item.q2.answer ? "text-green-700" : "text-red-700"}>
                      {item.userQ2 === item.q2.answer ? "✓" : "✗"} You: {item.userQ2} (Answer: {item.q2.answer})
                    </p>
                  </div>
                  <div className={`p-2 rounded ${
                    item.deportationOpinion === "Yes" ? "bg-red-50" :
                    item.deportationOpinion === "No" ? "bg-green-50" : "bg-amber-50"
                  }`}>
                    <p className="text-xs text-slate-500 mb-1">Deportation Opinion</p>
                    <p className={
                      item.deportationOpinion === "Yes" ? "text-red-700" :
                      item.deportationOpinion === "No" ? "text-green-700" : "text-amber-700"
                    }>
                      {item.deportationOpinion}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 italic">{item.conflictText}</p>

                {item.deportationOpinion === "Yes" && (
                  <p className="text-xs text-amber-700 mt-2">
                    → Scale: {item.scaleEstimate} {item.scaleDescription}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Sources */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Sources</h2>
            <div className="text-xs text-slate-600 space-y-1">
              {Array.from(new Set(answerHistory.flatMap(item => 
                item.sources.map(s => `${s.title}: ${s.url}`)
              ))).map((source, idx) => (
                <p key={idx}>{source}</p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            <p>Generated by Immigration Reality Check</p>
            <p>This tool presents factual scenarios. No moral judgments are assigned.</p>
          </div>
        </div>
      </div>
    );
  }

  // Crime quiz results
  const { correctCount, totalQuestions, perceptionGap, answerHistory, questions, onClose } = props;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-auto print-preview-modal">
      {/* Control bar - hidden when printing */}
      <div className="no-print sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="text-white font-semibold">Print Preview</div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
          >
            <Printer size={18} />
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <X size={18} />
            Close
          </button>
        </div>
      </div>

      {/* Printable content */}
      <div ref={printRef} className="print-content bg-white text-black p-8 max-w-3xl mx-auto my-8 print:my-0 print:max-w-none">
        {/* Header */}
        <div className="border-b-2 border-slate-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Immigration Reality Check</h1>
          <p className="text-lg text-slate-600">Crime Statistics Assessment Results</p>
          <p className="text-sm text-slate-500 mt-2">{currentDate}</p>
        </div>

        {/* Score Summary */}
        <div className="bg-slate-100 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Accuracy Score</p>
              <p className="text-4xl font-bold text-slate-900">{correctCount} / {totalQuestions}</p>
              <p className="text-sm text-slate-600">Questions where intuition matched data</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Perception Gap</p>
              <p className="text-4xl font-bold text-amber-700">{perceptionGap}%</p>
              <p className="text-sm text-slate-600">Questions where intuition differed from data</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-300">
            <p className="text-sm text-slate-700">
              {perceptionGap > 50 
                ? "Your intuitions differed significantly from research data. This is common—media coverage and political rhetoric often create impressions that diverge from aggregate statistics."
                : perceptionGap > 25
                ? "Your intuitions showed a moderate gap from the data. You had a relatively good sense of the trends."
                : "Your intuitions closely matched the research data. You appear to have a well-informed understanding of immigrant crime statistics."}
            </p>
          </div>
        </div>

        {/* Question-by-Question Results */}
        <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
          Question-by-Question Results
        </h2>

        <div className="space-y-4">
          {answerHistory.map((answer, idx) => {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) return null;

            return (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 page-break-inside-avoid">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {question.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    answer.wasCorrect ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {answer.wasCorrect ? "✓ Matched Data" : "Gap Found"}
                  </span>
                </div>

                <p className="font-medium text-slate-900 mb-3">{question.question}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className={`p-2 rounded ${answer.wasCorrect ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-xs text-slate-500 mb-1">Your Prediction</p>
                    <p className={answer.wasCorrect ? "text-green-700" : "text-red-700"}>
                      {answer.userAnswer}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-cyan-50">
                    <p className="text-xs text-slate-500 mb-1">Actual Data</p>
                    <p className="text-cyan-700 font-medium">{question.actualData}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sources */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Sources</h2>
          <div className="text-xs text-slate-600 space-y-1">
            {Array.from(new Set(questions.flatMap(q => 
              q.sources.map(s => `${s.title}: ${s.url}`)
            ))).map((source, idx) => (
              <p key={idx}>{source}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>Generated by Immigration Reality Check</p>
          <p>All data from government agencies and peer-reviewed research.</p>
        </div>
      </div>
    </div>
  );
}
