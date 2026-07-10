# Dhir Patel — Personal Portfolio

**Mechatronics & robotics engineering student** building at the intersection of hardware, software, and machine learning.

| | |
|---|---|
| **Location** | Edmonton, AB |
| **Education** | BSc Engineering, University of Alberta |
| **LinkedIn** | [linkedin.com/in/dhirptl](https://www.linkedin.com/in/dhirptl) |
| **GitHub** | [github.com/dhirptl](https://github.com/dhirptl) |
| **Email** | [dhirpatel768@gmail.com](mailto:dhirpatel768@gmail.com) |

This repository is the source for my personal portfolio site — a production-style Next.js application that showcases projects, experience, and technical work across robotics, full-stack development, and embedded systems.

---

## At a glance

| Area | Highlights |
|------|------------|
| **Robotics & autonomy** | ROS 2 navigation, MAVSDK drone control, Unity + Nav2 wheelchair GUI, computer vision pipelines |
| **Full-stack & APIs** | FastAPI, Flask, React, Node.js, MongoDB — end-to-end systems from backend to UI |
| **ML / AI** | TensorFlow, MediaPipe, OpenCV, Whisper speech-to-text, Groq LLM integration |
| **Hardware & CAD** | SolidWorks, Fusion 360, KiCad PCB design, FEA, composites, custom macropad (RP2040) |
| **Frontend engineering** | Next.js App Router, TypeScript, scroll-driven motion, accessible component systems |

---

## What this project demonstrates

Beyond being a portfolio, this codebase is a deliberate exercise in **modern frontend engineering** — the kind of work recruiters and hiring managers evaluate when assessing full-stack or product-engineering candidates.

### Architecture & data

- **Next.js App Router** with static generation for portfolio and experience detail routes (`/portfolio/[slug]`, `/experience/[slug]`)
- **Typed content model** — all copy, projects, and experience live in a single source of truth ([`lib/site-data.ts`](lib/site-data.ts)) with full TypeScript types
- **Hybrid styling** — CSS Modules for layout and component scoping, Tailwind v4 + design tokens in `globals.css` for theming and utilities
- **Component-driven UI** — reusable primitives (carousel, image slots, experience rows, site header) composed into page-level layouts

### Interaction & motion

- **Spline 3D hero** with a typing animation and responsive layout
- **Scroll-driven MacBook reveal** — pinned scroll zone, lid animation, and crossfade into an expanded project carousel ([`components/MacbookProjects.tsx`](components/MacbookProjects.tsx))
- **Apple Cards–style carousel** with modal detail views, keyboard navigation, and focus management
- **Motion (`motion/react`)** for scroll-linked transforms, opacity, and pointer-event handoff between layers

### Quality & accessibility

- Skip-to-content link, semantic landmarks, and ARIA labels on interactive carousel/modal UI
- Custom **focus-trap hook** for modal dialogs ([`hooks/use-focus-trap.ts`](hooks/use-focus-trap.ts))
- `prefers-reduced-motion` respected across animations
- Hydration-safe image loading for inline SVG thumbnails (client/server consistency)

### Skills learned building this site

| Skill | How it's applied here |
|-------|----------------------|
| **React 19 + Next.js** | Server and client components, dynamic routes, font optimization, metadata |
| **TypeScript** | Strict content types, props interfaces, compile-time safety across pages |
| **Scroll-driven UI** | `useScroll` / `useTransform` pin zones, opacity crossfades, layered pointer events |
| **CSS architecture** | Design tokens, CSS Modules, responsive breakpoints, transparent layering for atmospheric backgrounds |
| **Accessibility** | Focus traps, keyboard carousel control, skip links, reduced-motion fallbacks |
| **Performance awareness** | Static page generation, optimized fonts, lazy-friendly component boundaries |
| **Design systems thinking** | Shared detail layouts, consistent typography scale, reusable card/carousel patterns |

---

## Tech stack

### This repository

| Layer | Technologies |
|-------|--------------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | CSS Modules, [Tailwind CSS v4](https://tailwindcss.com/), custom design tokens |
| **Animation** | [Motion](https://motion.dev/) (`motion/react`), scroll-linked transforms |
| **3D** | [Spline](https://spline.design/) viewer (`@splinetool/viewer`) |
| **UI utilities** | `clsx`, `tailwind-merge`, `class-variance-authority`, `@tabler/icons-react`, `@base-ui/react` |
| **Tooling** | ESLint (`eslint-config-next`), PostCSS, Autoprefixer |

### Broader stack (from projects & experience)

**Languages:** Python · C · C# · JavaScript · TypeScript  

**Frameworks & runtimes:** React · Vite · FastAPI · Flask · Node.js · Unity 2022.3 · ROS 2 Humble  

**ML / CV:** TensorFlow · MediaPipe · OpenCV · Whisper  

**Robotics & embedded:** MAVSDK · ArduPilot · Nav2 · Arduino · Raspberry Pi · RP2040 (KMK firmware)  

**CAD & fabrication:** SolidWorks · Fusion 360 · KiCad · FEA simulation · FDM 3D printing · PCB soldering  

**Dev tools:** Git / GitHub · VS Code  

---

## Featured projects

| Project | Domain | Stack |
|---------|--------|-------|
| **integratedflight** | Drone control via natural language | Python, FastAPI, Groq, React, Vite, Whisper, MAVSDK, ArduPilot |
| **optibox** | Full-stack application | Python, Flask, React, TypeScript, Vite, Tailwind |
| **pediatric wheelchair GUI** | Robotic navigation & teleop | Unity 2022.3, ROS 2, C#, Nav2, URP |
| **signbridge** | Sign-language / CV system | Python, TensorFlow, MediaPipe, OpenCV, Fusion 360 |
| **cocare ai** | Healthcare / ML platform | React, Node.js, Python, MongoDB, TensorFlow |
| **custom macropad** | Hardware + firmware | KiCad, Fusion 360, Python (KMK), RP2040 |
| **jacking bar** | Mechanical design | SolidWorks, FEA |
| **model rocket** | Aerospace build | OpenRocket, composites |

Full write-ups with overview, sections, and links live on the site under `/portfolio` and in [`lib/site-data.ts`](lib/site-data.ts).

---

## Experience

| Role | Organization | Period |
|------|--------------|--------|
| Unity & ML Intern *(incoming)* | [ClutchVR](https://clutch-vr.com) | May 2026 — Present |
| Research Assistant | Glenrose Rehabilitation Hospital | Jan 2026 — Present |
| Drivetrain Subsystem | Formula SAE | Nov 2025 — Present |

Detail pages at `/experience/[slug]` cover responsibilities, stack, and project connections.

---

## Skills summary

**Software & CAD** — SolidWorks, Fusion 360, KiCad, FEA simulation, Unity 2022.3, ROS 2 Humble, MediaPipe  

**Programming** — Python, C, JavaScript, React, Node.js, Arduino, Raspberry Pi  

**Tools & fabrication** — Git / GitHub, VS Code, FDM 3D printing, PCB soldering, circuit assembly  

---

## Project structure

```
app/
  page.tsx              # Home — hero, experience, MacBook projects scroll, contact
  about/                # About page with gallery and albums
  portfolio/            # Project index + [slug] detail pages
  experience/           # [slug] experience detail pages
  globals.css           # Design tokens, typography, atmospheric background
components/
  MacbookProjects.tsx   # Scroll-pinned MacBook → carousel reveal
  ProjectsCarousel.tsx  # Horizontal project cards
  SiteHeader.tsx        # Global navigation
  ExperienceRow.tsx     # Experience list item
  ui/                   # macbook-scroll, apple-cards-carousel, etc.
lib/
  site-data.ts          # Typed content — projects, experience, skills, nav
hooks/
  use-focus-trap.ts     # Modal focus management
```

---

## Getting started

### Prerequisites

- Node.js 18+  
- npm (or pnpm / yarn)

### Install & run

```bash
git clone https://github.com/dhirptl/dp-personal-website.git
cd dp-personal-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Deployment

The app is a standard Next.js project and deploys cleanly to [Vercel](https://vercel.com/) or any Node-compatible host. Set the root to this repository and use the default build command (`npm run build`).

---

## Contact

Interested in robotics, full-stack, or hardware-software roles? Reach out:

- **Email:** dhirpatel768@gmail.com  
- **LinkedIn:** [linkedin.com/in/dhirptl](https://www.linkedin.com/in/dhirptl)  
- **GitHub:** [github.com/dhirptl](https://github.com/dhirptl)

---

*Built by Dhir Patel · University of Alberta · Mechatronics & Robotics*
