# 002 — Drive MacBook lid with a single compositor `transform`

- **Status**: DONE
- **Commit**: e9fc440
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`components/ui/macbook-scroll.tsx`), ~30 lines

## Problem

The animated lid uses Motion shorthand style props (`scaleX`, `scaleY`, `rotateX`, `translateY`). Per the animation audit bar, those shorthands are not the reliable GPU path under load — they tend to stay on the main thread and hitch during scroll-linked updates.

```tsx
// components/ui/macbook-scroll.tsx:245-254 — current
<motion.div
  style={{
    scaleX: scaleX,
    scaleY: scaleY,
    rotateX: rotate,
    translateY: translate,
    transformStyle: "preserve-3d",
    transformOrigin: "top center",
  }}
  className="absolute inset-0 h-[30rem] w-[40rem] rounded-2xl bg-[#010101] p-2"
>
```

The underlying values already come from `useTransform(scrollYProgress, …)` — only the **application** to the DOM is wrong for a busy scroll path.

## Target

Keep the four `useTransform` MotionValues (`scaleX`, `scaleY`, `rotate`, `translate`) as they are. Add one combined MotionValue that builds a full transform string, and bind **only** that (plus non-animated 3D hints) on the lid:

```tsx
// target — lid motion.div style
style={{
  transform: lidTransform, // MotionValue<string>
  transformStyle: "preserve-3d",
  transformOrigin: "top center",
}}
```

Where `lidTransform` is derived with `useTransform` from the four values, emitting exactly:

```ts
`translateY(${y}px) rotateX(${r}deg) scaleX(${sx}) scaleY(${sy})`
```

Order matters for the existing 3D lid feel: **translateY → rotateX → scaleX/scaleY**, matching how Motion composed the shorthands relative to `transformOrigin: "top center"`. Do not introduce `perspective()` on this string — perspective stays on the parent wrappers (`.macbook-scroll-root` / Lid outer `perspective:800px`).

Optional title block (`motion.h2` with `translateY` / `opacity`) is out of scope for this plan unless it is trivial to leave untouched (preferred: leave it).

## Repo conventions to follow

- Stack is `motion/react` (`MotionValue`, `motion`, `useTransform`) — keep that; do not switch to GSAP or CSS scroll-driven animations (comments in this file warn Chrome ViewTimeline bugs).
- Function-form `useTransform(scrollYProgress, (v) => …)` / multi-input `useTransform` is already the local pattern — extend it.
- Exemplar of scroll-linked transforms in the same file: `components/ui/macbook-scroll.tsx:112-148`.

## Steps

1. In `Lid` (or in `MacbookScroll` just above the `Lid` call), create:

```tsx
const lidTransform = useTransform(
  [scaleX, scaleY, rotate, translate],
  ([sx, sy, r, y]) =>
    `translateY(${y}px) rotateX(${r}deg) scaleX(${sx}) scaleY(${sy})`,
);
```

   Use the Motion API already in the project (`useTransform` from `motion/react`). If the installed Motion version types multi-input differently, use the equivalent documented overload — do not change Motion major version.

2. On the lid `motion.div`, remove `scaleX`, `scaleY`, `rotateX`, and `translateY` from `style`. Set `transform: lidTransform`. Keep `transformStyle: "preserve-3d"` and `transformOrigin: "top center"`.

3. Do not change `phaseValue`, `MACBOOK_PHASE`, pop scale caps, or keypad markup.

## Boundaries

- Do NOT edit `MacbookProjects.tsx` / CSS (plan 001 owns the rAF).
- Do NOT replace scroll-linked motion with CSS `@scroll-timeline` / View Timeline.
- Do NOT add `will-change: transform` on the lid unless feel-checking shows a clear composite win (keys already abuse `will-change` — see plan 003).
- Do NOT change visual phase keyframes (scale/rotate/translate stop values).
- If shorthand removal visibly breaks lid hinge origin vs commit `e9fc440`, STOP and report the before/after rather than inventing a new matrix.

## Verification

- **Mechanical**: Typecheck passes; lid still opens on scroll with children mode.
- **Feel check**:
  - Scrub through pop → rotate → settle → exit; hinge must still feel attached at the top edge (`transform-origin: top center`).
  - Compare at 10% animation playback / slow scroll: no new shearing or independent X/Y scale glitches vs pre-change.
  - Chrome Performance: while scrubbing, lid updates should not show long main-thread style recalcs dominated by Motion shorthand projection (composite-friendly `transform` string updates).
- **Done when**: lid uses a single `transform` MotionValue string; choreography matches prior stop values.
