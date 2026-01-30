"use client";

import { FileText } from "lucide-react";

interface ShareResultsProps {
  onPrintClick: () => void;
}

export function ShareResults({ onPrintClick }: ShareResultsProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onPrintClick}
        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <FileText size={18} />
        Save as PDF
      </button>
    </div>
  );
}
