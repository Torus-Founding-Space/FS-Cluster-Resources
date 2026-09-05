"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

const RESET_DELAY_MS = 2000;

/**
 * Copy-with-feedback for the docs' many "Copy" buttons.
 *
 * Tracks which snippet was copied last and clears that state after a moment.
 * The timer is cleared on unmount so we never set state on a gone component.
 */
export function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(async (text: string, id: string = "default") => {
    const ok = await copyText(text);
    if (!ok) return false;

    if (timerRef.current) clearTimeout(timerRef.current);
    setCopiedId(id);
    timerRef.current = setTimeout(() => setCopiedId(null), RESET_DELAY_MS);
    return true;
  }, []);

  return { copiedId, copy, isCopied: (id: string = "default") => copiedId === id };
}
