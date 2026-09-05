"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ScreenshotSlotProps {
  src: string;
  alt: string;
  stepNumber: string;
  clickTarget: string;
  whatToCapture: string;
}

export function ScreenshotSlot({
  src,
  alt,
  stepNumber,
  clickTarget,
  whatToCapture,
}: ScreenshotSlotProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="my-4 border border-white/10 bg-white/[0.02] rounded-none overflow-hidden">
      {/* Click target helper bar */}
      <div className="px-3 py-2 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-white/90">
          <span className="text-[#CBA6F7] font-semibold">{stepNumber}</span>
          <span className="text-white/40">|</span>
          <span className="text-white/80">Click: <strong className="text-white font-normal underline decoration-white/30 underline-offset-4">{clickTarget}</strong></span>
        </div>
        <span className="text-[11px] text-white/40">{src.replace("/images/webpage-to-figma/", "")}</span>
      </div>

      {/* Image or Placeholder */}
      <div className="relative min-h-[180px] sm:min-h-[220px] bg-black/40 flex items-center justify-center p-4">
        {!hasError ? (
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="w-full h-auto object-contain rounded-none"
            onError={() => setHasError(true)}
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 max-w-md">
            <div className="w-10 h-10 border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 mb-1 rounded-none">
              <Camera className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono text-white/80">
              Drop screenshot in: <code className="text-[#CBA6F7]">public{src}</code>
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              {whatToCapture}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
