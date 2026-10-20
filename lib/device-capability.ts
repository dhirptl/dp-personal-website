/**
 * Client-only gates for the heavy hero effects (Spline robot, liquid-metal
 * shader). Call from effects, never during render, so the server HTML and the
 * first client render always match.
 */

/** Same breakpoint as the phone layout in globals.css / page.module.css. */
export const PHONE_QUERY = "(max-width: 760px)";

type NavigatorWithHints = Navigator & { connection?: { saveData?: boolean } };

/**
 * True on desktop/tablet-class devices that can afford a WebGL scene: not a
 * phone-width viewport, no data saver, no reduced-motion preference and more
 * than 4 logical cores (hardwareConcurrency is missing in some browsers, so an
 * unknown core count is treated as capable).
 */
export function canRunHeavyEffects(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(PHONE_QUERY).matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return false;
  return true;
}

/**
 * Run `cb` once the window "load" event has fired and the main thread is idle
 * (setTimeout fallback where requestIdleCallback is missing, e.g. Safari).
 * Returns a cancel function for effect cleanup.
 */
export function whenPageIdle(cb: () => void, timeout = 3000): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const run = () => {
    if (!cancelled) cb();
  };
  const schedule = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(run, { timeout });
    } else {
      timer = setTimeout(run, 200);
    }
  };

  // already loaded on client-side navigation
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timer !== undefined) clearTimeout(timer);
  };
}
