# 003 — Remove permanent `will-change` from static MacBook keypad

- **Status**: DONE
- **Commit**: e9fc440
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`components/ui/macbook-scroll.tsx`), 2 call sites

## Problem

The decorative keypad promotes layers aggressively even though keys never animate:

```tsx
// components/ui/macbook-scroll.tsx:286 — current
<div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
```

```tsx
// components/ui/macbook-scroll.tsx:648-652 — current (KBtn)
<div
  className={cn(
    "[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform]",
    backlit && "bg-white/[0.2] shadow-xl shadow-white",
  )}
>
```

`will-change: transform` on every key (dozens of nodes) plus the keypad shell forces the browser to reserve compositor layers for static chrome sitting under a scroll-linked 3D lid. That competes with the one element that actually moves (the lid) and inflates memory on mobile.

`translateZ(0)` alone is enough if a paint boundary is needed for the inset shadows; permanent `will-change` is not.

## Target

Remove `[will-change:transform]` from both class strings. Leave `[transform:translateZ(0)]` as-is unless visual regression appears (then keep translateZ, still no will-change).

```tsx
// target — Keypad root
className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1"

// target — KBtn outer
className={cn(
  "[transform:translateZ(0)] rounded-[4px] p-[0.5px]",
  backlit && "bg-white/[0.2] shadow-xl shadow-white",
)}
```

## Repo conventions to follow

- Tailwind utility classes on this Aceternity-derived component — edit utilities in place; do not invent a CSS module just for this.
- Motion performance work on the lid is plan 002; this plan only strips unused layer hints from static markup.

## Steps

1. In `components/ui/macbook-scroll.tsx` Keypad root `div`, delete `[will-change:transform]` from the `className`.
2. In `KBtn` outer `div`, delete `[will-change:transform]` from the `cn(...)` base string.
3. No other edits.

## Boundaries

- Do NOT restyle keys, backlighting, or shadows.
- Do NOT add `will-change` to the lid in this plan.
- Do NOT touch `MacbookProjects.tsx`.
- If commit drift removed these utilities already, mark this plan DONE in `plans/README.md` and stop.

## Verification

- **Mechanical**: page still renders the MacBook keypad; no TypeScript changes expected.
- **Feel check**:
  - Visual: keys/backlight look identical (no missing shadows).
  - Safari/Chrome Layers (or Performance memory): fewer promoted layers under the chassis while idle and while scrubbing the lid.
  - Scroll the lid animation — no new flicker on the keyboard.
- **Done when**: zero `will-change` utilities remain in `macbook-scroll.tsx` keypad/KBtn; lid motion unchanged.
