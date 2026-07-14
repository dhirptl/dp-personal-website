# 001 — Pause MacBook scroll rAF when off-screen

- **Status**: DONE
- **Commit**: e9fc440
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`components/MacbookProjects.tsx`), ~40 lines

## Problem

`MacbookProjects` drives lid motion with a permanent `requestAnimationFrame` loop that never pauses — including when the section is off-screen and when `prefers-reduced-motion` has already snapped progress to a constant.

```tsx
// components/MacbookProjects.tsx:56-80 — current
useEffect(() => {
  let raf = 0;
  const tick = () => {
    const el = pinRef.current;
    if (el) {
      if (reducedMotion) {
        scrollYProgress.set(
          (MACBOOK_PHASE.settleEnd + MACBOOK_PHASE.exitStart) / 2,
        );
      } else {
        const total = el.offsetHeight || 1;
        const p = Math.min(
          1,
          Math.max(0, -el.getBoundingClientRect().top / total),
        );
        scrollYProgress.set(p);
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [scrollYProgress, reducedMotion]);
```

Every frame: layout read (`getBoundingClientRect` / `offsetHeight`) + Motion value write. On a marketing page this burns CPU/battery for the entire visit after the projects section has scrolled away (and forever under reduced motion for no benefit).

## Target

1. Under `reducedMotion === true`: set progress **once** and do **not** start a rAF loop.
2. Under normal motion: sample progress with rAF **only while the pin element intersects the viewport** (IntersectionObserver). When off-screen, cancel the loop; when it re-enters, restart and do one immediate sample so the lid isn't stale.
3. Keep the existing progress math unchanged:

```ts
const total = el.offsetHeight || 1;
const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
scrollYProgress.set(p);
```

## Repo conventions to follow

- Reduced-motion already lives in this file via `matchMedia("(prefers-reduced-motion: reduce)")` — extend that branch; do not add a second reduced-motion path in `macbook-scroll.tsx`.
- No new dependencies. Prefer IntersectionObserver (already available in the browser targets this site uses).
- Exemplar for one-shot reduced-motion handling in the same component: `components/MacbookProjects.tsx:48-54` (media query listener).

## Steps

1. In `components/MacbookProjects.tsx`, replace the rAF `useEffect` (lines 56–80) with two behaviors:
   - **Reduced motion**: `scrollYProgress.set((MACBOOK_PHASE.settleEnd + MACBOOK_PHASE.exitStart) / 2)` once inside the effect; return a no-op cleanup (or empty). Do not call `requestAnimationFrame`.
   - **Normal**: create `let raf = 0` and `let running = false`. Define `sample()` that reads `pinRef.current` and sets progress with the existing formula. Define `loop()` that calls `sample()` then `raf = requestAnimationFrame(loop)`. Start/stop via `IntersectionObserver` on `pinRef.current` with `{ root: null, threshold: 0 }` (or a small rootMargin if needed). On `isIntersecting === true`, if `!running`, set `running = true`, call `sample()` once, then `raf = requestAnimationFrame(loop)`. On `false`, set `running = false`, `cancelAnimationFrame(raf)`.
2. Cleanup must: disconnect the observer, cancel any pending rAF, and set `running = false`.
3. Keep the dependency array as `[scrollYProgress, reducedMotion]` (or add nothing else). Do not change `MACBOOK_PHASE`, `inInteractWindow`, or the `inert` gate.

## Boundaries

- Do NOT modify `components/ui/macbook-scroll.tsx` or `MacbookProjects.module.css`.
- Do NOT change phase constants, interactive window, or footer markup.
- Do NOT add libraries (no Lenis, no GSAP ScrollTrigger).
- If `pinRef.current` is null when the effect runs, observe after mount as today does with rAF — still attach the observer when the ref is available (same effect is fine if the section always mounts with the ref node).
- If the code has drifted from commit `e9fc440`, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` (or the repo's usual typecheck) passes.
- **Feel check**:
  - Scroll the projects MacBook open/close — choreography feels identical to before.
  - In DevTools Performance: start recording, scroll past the section so it is fully off-screen; confirm rAF callbacks from this effect stop (no continuous `getBoundingClientRect` on the pin).
  - Toggle `prefers-reduced-motion: reduce` — MacBook jumps to open/interactive hold, no continuous rAF; section height still uses `.scrollZoneReduced`.
  - Scroll away and back — lid progress resumes without a one-frame flash at progress 0.
- **Done when**: off-screen (and reduced-motion) visits do not keep a permanent rAF alive; on-screen scrub matches prior feel.
