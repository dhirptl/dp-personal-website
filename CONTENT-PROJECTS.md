# Projects content — edit me, then hand back

This is the **master edit sheet** for everything project-related on your site.

**How to use**
1. Edit any wording below (keep the field labels).
2. Fill in image paths / drop files into `public/images/projects/` (create folders as needed).
3. Add or fix links.
4. Delete a whole project section if you want it removed; add a new `## Project N` block if you want a new one.
5. When you're done, send this file back (or say “implement CONTENT-PROJECTS.md”) and I’ll wire it into `lib/site-data.ts` + the pages.

**Site style note:** copy is currently **all lowercase**. Match that unless you want to change the voice site-wide.

**Image naming suggestion** (put files under `public/images/projects/{slug}/`):

| Slot | Suggested filename | Where it shows |
|------|--------------------|----------------|
| Card / thumbnail | `thumb.jpg` | Portfolio carousel + home MacBook cards |
| Hero | `hero.jpg` | Top of project detail page |
| Gallery 1…n | `gallery-01.jpg`, `gallery-02.jpg`, … | Extra images on detail page (not wired yet — I’ll add support when you fill these) |
| Optional video | `demo.mp4` or a YouTube/Vimeo URL | Detail page media |

Leave a field blank or write `TODO` if you don’t have it yet.

**Categories available:** `hardware` · `full stack` · `ml / ai` · `robotics` · `mechanical`

**Experience slugs you can link to:** `clutchvr` · `robotic-navigation` · `formula-sae`

---

# Global project settings

## Display order
Projects appear in this order on the site today. Reorder the list if you want a different sequence:

1. integratedflight
2. optibox
3. pediatric-wheelchair
4. signbridge
5. cocare
6. macropad
7. jacking-bar
8. model-rocket

## Categories (filter chips)
- hardware
- full stack
- ml / ai
- robotics
- mechanical

*(Add/remove categories here if you want the filter list changed.)*

---

# Project 1 — integratedflight

## Meta
- **slug:** `integratedflight` *(URL: /portfolio/integratedflight — don’t change unless you want a new URL)*
- **name:** integratedflight
- **categories:** robotics, full stack, ml / ai
- **date:** 2026
- **tech:** python, fastapi, groq, react, vite, whisper, mavsdk, ardupilot
- **experience link label:** *(none)*
- **experience link route:** *(none)*

## Overview (card modal + detail page intro)
a safety-first drone command and mission-control platform that turns plain-english commands into structured flight actions, validates them against mission constraints, and feeds operators back through a live ui and a voice workflow.

## Links
| Label | URL |
|-------|-----|
| github ↗ | https://github.com/harsituni/IntegratedFlight |

*(Add more rows: demo, demo video, docs, etc.)*

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/integratedflight/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/integratedflight/hero.jpg` | | MISSING |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### what it does
**Body:**
an operator says "alpha take off to 10 meters", "fly to the northwest watch tower", or "return to the landing pad and land." the system parses intent with an llm command brain, resolves natural-language locations to canonical waypoints, runs hard safety checks, and returns a validated execution result with confidence and risk context — all reflected in a real-time mission view.

### core features
**Bullets:**
- natural-language command parsing into structured drone actions.
- challenge-aware waypoint mapping — "northwest watch tower" resolves to TOWER_NW.
- hard-block safety enforcement for no-go zones, bad waypoints, and unsafe targets.
- operator confirm/cancel flow for ambiguous or high-risk commands.
- session memory + follow-ups ("do that again", "same target").
- multi-waypoint tasking and telemetry-ready coordinate verification.

### safety model
**Body:**
safety is enforced before execution: unknown or invalid waypoints are blocked, no-go-zone incursions are blocked, altitude violations at constrained waypoints are blocked, unsafe targeting is blocked or confirmation-gated, and invalid weaponized intent is hard-rejected.

### architecture
**Bullets:**
- frontend/ — operator ui: command log, mission status, interaction panels.
- whisper-backend/ — fastapi stt + command-execution bridge.
- groq-integration/ — llm parser, validator, and mission command brain.
- challenge/ + mavsdk sim stack — waypoints, no-go zones, sitl/gazebo context.

### what's next
**Bullets:**
- full live mission execution against sitl controls, not just validation.
- a richer planner for multi-drone concurrent tasking.
- automatic recovery and replanning on verification failure.
- timeline replay, mission audit reports, and role-based command permissions.

---

# Project 2 — optibox

## Meta
- **slug:** `optibox`
- **name:** optibox
- **categories:** full stack
- **date:** 2026
- **tech:** python, flask, react, typescript, vite, tailwind
- **experience link label:** *(none)*
- **experience link route:** *(none)*

## Overview
a greedy routing and dispatch system for a multi-shuttle warehouse — it receives boxes, stores them intelligently, ships them through active pallet destinations, and plays the whole run back visually.

## Links
| Label | URL |
|-------|-----|
| *(add github / demo / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/optibox/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/optibox/hero.jpg` | | MISSING |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### what it does
**Bullets:**
- simulates 32 shuttles operating across a silo layout.
- routes inbound boxes to either immediate cross-dock delivery or storage + pickup on the same route.
- tracks pallet progression and completion over time.
- produces a timeline you can scrub, with randomized load, run, and event/metric inspection.

### how we built it
**Bullets:**
- python + flask backend: the core simulation state machine, shuttle task logic, dispatch + pallet lifecycle rules, csv state generation, and timeline export.
- react + typescript + vite + tailwind frontend: playback controls, silo-grid visualization, an event log + pallet panel, and deterministic replay ux.

### challenges
**Bullets:**
- balancing route efficiency, storage placement, and pallet activation/completion at once.
- keeping the simulation deterministic while still being interactive.
- translating backend state transitions into smooth visual playback.
- keeping frontend and backend payload contracts aligned as features evolved.

### what we learned
**Body:**
how to manage complex warehouse constraints with clear state transitions, how much data contracts matter when playback depends on backend tick data, and how to collaborate quickly under hackathon time pressure.

---

# Project 3 — pediatric wheelchair gui

## Meta
- **slug:** `pediatric-wheelchair`
- **name:** pediatric wheelchair gui
- **categories:** robotics
- **date:** jan 2026 — apr 2026
- **tech:** unity 2022.3, ros 2 humble, c#, nav2, urp
- **experience link label:** research @ glenrose
- **experience link route:** `/experience/robotic-navigation`

## Overview
a unity-based, gamified control interface wired directly into a ros 2 autonomous wheelchair — built to make navigation engaging and safe for pediatric users with visual challenges.

## Links
| Label | URL |
|-------|-----|
| *(add github / demo / paper / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/pediatric-wheelchair/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/pediatric-wheelchair/hero.jpg` | | MISSING |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### key features
**Bullets:**
- dual control modes: a virtual joystick for low-level motion, and destination-based autonomous navigation.
- a pediatric-friendly, high-contrast palette (yellow on black) to assist children with visual challenges.
- gamification — collectibles, progress indicators, and feedback triggered by the wheelchair's actual pose, not commanded motion.
- ros 2 integration with the nav2 stack over standard topics and action interfaces.

### context
**Body:**
built as part of my research at the glenrose rehabilitation hospital, under the guidance of a graduate-student researcher, to directly support ongoing academic work in assistive pediatric robotics.

---

# Project 4 — signbridge

## Meta
- **slug:** `signbridge`
- **name:** signbridge
- **categories:** hardware, ml / ai
- **date:** feb 2026
- **tech:** python, tensorflow, mediapipe, opencv, fusion 360
- **experience link label:** *(none)*
- **experience link route:** *(none)*

## Overview
a wearable that translates sign language in real time.

## Links
| Label | URL |
|-------|-----|
| *(add github / demo / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/signbridge/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/signbridge/hero.jpg` | | MISSING |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### highlights
**Bullets:**
- mediapipe extracts egocentric 3d hand landmarks for real-time translation — aimed at the 70% communication gap for the deaf community.
- temporal gesture pipeline in tensorflow, moving from static letters to dynamic word-level gestures.
- a proprietary egocentric dataset plus a 'logic toggle' engine that separates fingerspelling from full words.

*(Want longer write-ups like integratedflight? Add new section headings below — e.g. “how it works”, “hardware”, “what’s next”.)*

---

# Project 5 — cocare ai

## Meta
- **slug:** `cocare`
- **name:** cocare ai
- **categories:** full stack, ml / ai
- **date:** jul 2025
- **tech:** react, node.js, python, mongodb, tensorflow
- **experience link label:** *(none)*
- **experience link route:** *(none)*

## Overview
an ai companion that helps caregivers track behavior.

## Links
| Label | URL |
|-------|-----|
| *(add github / demo / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/cocare/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/cocare/hero.jpg` | | MISSING |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### highlights
**Bullets:**
- react app that auto-generates child behavior logs from facial recognition, voice cues, and the gpt api.
- separate dashboards — caregivers get log reviews and behavior graphs; kids get mood tracking, calming games, avatar rewards.
- mediapipe and voice input for passive symptom tracking, built around accessibility and inclusive design.

---

# Project 6 — macropad

## Meta
- **slug:** `macropad`
- **name:** macropad
- **categories:** hardware
- **date:** jan 2026
- **tech:** kicad, fusion 360, python (kmk), rp2040
- **experience link label:** *(none)*
- **experience link route:** *(none)*

## Overview
a mechanical keypad designed from the copper up.

## Links
| Label | URL |
|-------|-----|
| *(add github / demo / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/macropad/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/macropad/hero.jpg` | | MISSING |
| Gallery 1 | | PCB render / photo | |
| Gallery 2 | | Enclosure / assembled pad | |
| Gallery 3 | | OLED / RGB lit | |
| Video | | | |

## Sections

### highlights
**Bullets:**
- 2-layer pcb in kicad around a seeed xiao rp2040 — i2c oled and daisy-chained addressable rgb.
- custom snap-fit enclosure in fusion 360, toleranced for fdm printing around switches and encoders.
- kmk firmware handling matrix scanning, encoder interrupts, and live oled layer visualization.

---

# Project 7 — jacking bar

## Meta
- **slug:** `jacking-bar`
- **name:** jacking bar
- **categories:** mechanical, hardware
- **date:** nov 2025 — present
- **tech:** solidworks, fea
- **experience link label:** formula sae
- **experience link route:** `/experience/formula-sae`

## Overview
a redesigned jacking bar for the formula sae car's drivetrain subsystem.

## Links
| Label | URL |
|-------|-----|
| *(add solidworks renders / team page / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/jacking-bar/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/jacking-bar/hero.jpg` | | MISSING |
| Gallery 1 | | CAD / FEA screenshot | |
| Gallery 2 | | Physical part | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### the work
**Bullets:**
- redesigned in solidworks after the original failed inspection — lighter, with targeted reinforcements.
- ran fea to find high-stress regions, then iterated the design to mitigate failure points.
- built within a 30-person drivetrain subsystem working toward technical inspection and race readiness.

### note
**Body:**
more on this one coming soon.

*(Replace the “note” section when you have a fuller write-up.)*

---

# Project 8 — model rocket

## Meta
- **slug:** `model-rocket`
- **name:** model rocket
- **categories:** mechanical
- **date:** 2025
- **tech:** openrocket, composites
- **experience link label:** *(none)*
- **experience link route:** *(none)*

## Overview
a model rocket build.

## Links
| Label | URL |
|-------|-----|
| *(add github / flight video / etc.)* | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/model-rocket/thumb.jpg` | | MISSING |
| Hero | `public/images/projects/model-rocket/hero.jpg` | | MISSING |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### note
**Body:**
write-up coming soon.

*(This one is a stub — fill overview + real sections when ready, or delete the whole project.)*

---

# New project template (copy/paste)

```
# Project N — YOUR NAME

## Meta
- **slug:** `your-slug`
- **name:** your display name
- **categories:** (pick from: hardware, full stack, ml / ai, robotics, mechanical)
- **date:** 
- **tech:** 
- **experience link label:** *(none or e.g. research @ glenrose)*
- **experience link route:** *(none or /experience/robotic-navigation)*

## Overview
one short paragraph for the card + detail intro.

## Links
| Label | URL |
|-------|-----|
| github ↗ | |
| live demo | |

## Images
| Slot | Path or URL | Caption / notes | Status |
|------|-------------|-----------------|--------|
| Thumbnail (card) | `public/images/projects/your-slug/thumb.jpg` | | |
| Hero | `public/images/projects/your-slug/hero.jpg` | | |
| Gallery 1 | | | |
| Gallery 2 | | | |
| Gallery 3 | | | |
| Video | | | |

## Sections

### section title
**Body:**
or

**Bullets:**
- 
- 
```

---

# Related experience (linked from projects)

These aren’t project pages, but projects link into them. Edit if you want the cross-links / labels updated.

| Experience | Org | Linked project(s) | Project “xp” badge label |
|------------|-----|-------------------|--------------------------|
| clutchvr | clutchvr | *(none yet)* | — |
| robotic-navigation | glenrose rehabilitation hospital | pediatric-wheelchair | research @ glenrose |
| formula-sae | university of alberta formula racing | jacking-bar | formula sae |

---

# Image drop checklist (quick scan)

Right now **every project has zero real images** — cards use gradient placeholders and detail heroes say “drop a … shot”.

| Project | Thumb | Hero | Gallery | Links besides GitHub |
|---------|-------|------|---------|----------------------|
| integratedflight | ❌ | ❌ | ❌ | ✅ GitHub only |
| optibox | ❌ | ❌ | ❌ | ❌ |
| pediatric-wheelchair | ❌ | ❌ | ❌ | ❌ |
| signbridge | ❌ | ❌ | ❌ | ❌ |
| cocare | ❌ | ❌ | ❌ | ❌ |
| macropad | ❌ | ❌ | ❌ | ❌ |
| jacking-bar | ❌ | ❌ | ❌ | ❌ |
| model-rocket | ❌ | ❌ | ❌ | ❌ |

**Easiest workflow for images**
1. Create folders: `public/images/projects/{slug}/`
2. Drop `thumb.jpg` + `hero.jpg` (+ optional gallery files)
3. Update the tables above so paths match what you dropped
4. Hand this file back

---

# Your change log (optional)

Use this while editing so I know what to prioritize:

- [ ] Rewrote copy for: 
- [ ] Added images for: 
- [ ] Added links for: 
- [ ] New projects: 
- [ ] Remove projects: 
- [ ] Other notes: 

---

*Generated from current site data in `lib/site-data.ts`. After you edit this file, tell me to implement it.*
