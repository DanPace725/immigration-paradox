"use client";

import { useState } from "react";
import { FileText, Share2, Check } from "lucide-react";

interface ShareResultsProps {
  onPrintClick: () => void;
}

export function ShareResults({ onPrintClick }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={onPrintClick}
        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <FileText size={18} />
        Save as PDF
      </button>
      
      <button
        onClick={handleCopyLink}
        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <Check size={18} className="text-emerald-400" />
            Copied!
          </>
        ) : (
          <>
            <Share2 size={18} />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}
