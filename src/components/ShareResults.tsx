"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Check, Loader2 } from "lucide-react";

interface ShareResultsProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export function ShareResults({ targetRef, filename = "results" }: ShareResultsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const dataUrl = await toPng(targetRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#0f172a", // slate-900
      });
      
      const link = document.createElement("a");
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download size={18} />
            Download Results
          </>
        )}
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
