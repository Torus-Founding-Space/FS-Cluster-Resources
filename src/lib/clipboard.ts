/**
 * Copy text to the clipboard, degrading gracefully.
 *
 * `navigator.clipboard` is unavailable on insecure origins and can reject when
 * the document isn't focused or permission is denied, so every call site needs
 * a fallback and a rejection handler. Otherwise a failed copy surfaces as an
 * unhandled promise rejection and a button stuck on "Copied!".
 *
 * Returns whether the text actually made it to the clipboard.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the textarea fallback
    }
  }

  if (typeof document === "undefined") return false;

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
