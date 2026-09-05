/**
 * Shared helpers for the canvas-backed loaders.
 *
 * Every loader runs its own requestAnimationFrame loop and there can be a
 * dozen of them on screen at once, so anything done per frame is multiplied
 * by the number of visible loaders.
 */

const DEFAULT_THEME_COLOR = "#CBA6F7";
const THEME_COLOR_MAX_AGE_MS = 500;

const themeColorCache = new WeakMap<Element, { color: string; readAt: number }>();

/**
 * Resolves the loader's drawing colour from its inherited CSS `color`.
 *
 * `getComputedStyle` forces a style recalculation, which is far too expensive
 * to run once per loader per frame, so the result is cached briefly. Half a
 * second is short enough that a theme change still looks instantaneous.
 */
export function readThemeColor(
  element: Element | null | undefined,
  fallback: string = DEFAULT_THEME_COLOR
): string {
  if (!element || typeof window === "undefined") return fallback;

  const now = performance.now();
  const cached = themeColorCache.get(element);
  if (cached && now - cached.readAt < THEME_COLOR_MAX_AGE_MS) return cached.color;

  const { color } = window.getComputedStyle(element);
  const resolved = color && color !== "rgba(0, 0, 0, 0)" ? color : fallback;
  themeColorCache.set(element, { color: resolved, readAt: now });
  return resolved;
}

/**
 * Media query for the user's reduced-motion preference.
 *
 * Loaders draw a single static frame instead of animating when this matches.
 * Falls back to a never-matching stub so the loaders still work if the effect
 * somehow runs without a real `window`.
 */
export function reducedMotionQuery(): MediaQueryList {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as MediaQueryList;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}
