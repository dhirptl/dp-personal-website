# 004 — Fix body overflow so MacBook sticky pins

- **Status**: DONE
- **Commit**: e9fc440
- **Severity**: HIGH
- **Category**: Performance / Physicality (scroll choreography)
- **Estimated scope**: 2 files (`apple-cards-carousel.tsx`, `macbook-scroll.tsx`)

## Problem

The MacBook stage uses `position: sticky`, but sticky fails whenever `document.body` has inline `overflow: hidden`. The project-card modal scroll lock set `overflow = "hidden"` and restored `"auto"`, leaving a sticky-killing inline style after close (and during open).

Confirmed in browser: with body overflow cleared, at progress `~0.4` `stage.top ≈ 60` (header) while `pin.top` is largely negative. With overflow hidden, stage scrolled away with the pin — lid opened off-screen.

## Target (implemented)

1. Ref-counted body scroll lock in `apple-cards-carousel.tsx` that saves and restores the previous inline `overflow` (usually `""`), not `"auto"`.
2. Screen content opacity fades `0 → 1` across `popEnd → settleEnd`.
3. `phaseValue` uses smoothstep between stops for softer scrub-linked easing.

## Verification (passed)

- Progress `0.4` / `0.45`: `stageTop === 60`, `lidInView === true`, lid `rotateX(0)`.
- Closed: `screenOpacity === "0"`; open: `"1"`.
- Modal open: `bodyOverflow === "hidden"`; after close: `""`; sticky still holds.
