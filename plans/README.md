# Animation plans — MacBook scroll

Commit stamped: `e9fc440`  
Scope: MacBook projects scroll (`macbook-scroll.tsx`, `MacbookProjects.tsx`, `apple-cards-carousel.tsx`)

## Plans

| # | Title | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 001 | Pause MacBook scroll rAF when off-screen | HIGH | DONE | — |
| 002 | Drive MacBook lid with a single compositor `transform` | HIGH | DONE | — |
| 003 | Remove permanent `will-change` from static keypad | HIGH | DONE | — |
| 004 | Fix body overflow so MacBook sticky pins | HIGH | DONE | — |

## Recommended execution order

1. **004** — unblocks the whole choreography (sticky must work before feel-checking lid motion).
2. **003** → **001** → **002** — performance path (already applied).

## Root cause note (004)

Card modal scroll lock left `document.body.style.overflow` as `"hidden"` / `"auto"`, which breaks `position: sticky` on the MacBook stage. Lock is now ref-counted and restores the prior inline value.
