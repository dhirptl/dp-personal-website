// Typed content model for the site. Ported from design_handoff_portfolio_site/site-data.jsx.
// This is the single source of truth for copy across home/about/portfolio/experience pages.

export type NavItem = {
  label: string;
  href: string;
  route?: string;
};

export type ExperienceIndexEntry = {
  slug: string;
  title: string;
  org: string;
  range: string;
  now?: boolean;
};

export type GalleryPhoto = {
  id: string;
  location?: string;
  src?: string;
};

export type GalleryItem = {
  id: string;
  label: string;
  photos?: GalleryPhoto[];
  noImage?: boolean;
  src?: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  cover?: string;
};

export type ExperienceDetail = {
  slug: string;
  role: string;
  org: string;
  orgHref: string;
  range: string;
  status: string;
  location: string;
  team: string;
  now: boolean;
  summary: string;
  responsibilities?: string[];
  accomplishments?: string[];
  focus?: string[];
  growth?: string;
  teamwork?: string;
  stack: string[];
  projects: string[];
};

export type ProjectSection = {
  title: string;
  body?: string;
  items?: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  categories: string[];
  date: string;
  tech: string[];
  overview: string;
  sections: ProjectSection[];
  links?: ProjectLink[];
  xp?: { label: string; route: string };
  thumbnail?: string;
};

export type SkillGroup = {
  group: string;
  items: string[];
};

const EXP_DETAIL: Record<string, ExperienceDetail> = {
  clutchvr: {
    slug: "clutchvr",
    role: "unity & ml intern",
    org: "clutchvr",
    orgHref: "https://clutch-vr.com",
    range: "may 2026 — present",
    status: "incoming · summer 2026",
    location: "remote",
    team: "product & engineering",
    now: true,
    summary:
      "incoming unity & ml intern at clutchvr — joining for summer 2026 to build immersive vr in unity and ship machine-learning–driven features inside a real product.",
    responsibilities: [
      "build and iterate on interactive vr experiences in unity, from prototype to production.",
      "integrate machine-learning models into real-time, in-headset workflows.",
      "work across a small product team to take features from idea to shipped.",
    ],
    focus: [
      "getting fluent in clutchvr's unity codebase and vr interaction patterns.",
      "owning a feature end-to-end and getting it in front of real users.",
      "learning how ml actually gets productionized inside an immersive product.",
    ],
    growth:
      "this is my first industry role bridging the two things i care about most — real-time 3d and machine learning. i'm treating it as a chance to learn how production software is built, reviewed, and maintained at a company, not just shipped at a hackathon.",
    teamwork:
      "joining a lean product team means writing code other people depend on, reviewing and being reviewed, and communicating tradeoffs clearly. i'm coming in ready to ask sharp questions and pull my weight from week one.",
    stack: ["unity", "c#", "machine learning", "vr"],
    projects: [],
  },
  "robotic-navigation": {
    slug: "robotic-navigation",
    role: "undergraduate research assistant",
    org: "glenrose rehabilitation hospital",
    orgHref: "https://www.imagination-centre.ca/research",
    range: "jan 2026 — present",
    status: "now",
    location: "edmonton, ab",
    team: "assistive robotics research",
    now: true,
    summary:
      "undergraduate research assistant building assistive robotics for kids — bridging unity and ros 2 to make an autonomous wheelchair navigable, safe, and genuinely fun for pediatric users with visual impairments.",
    responsibilities: [
      "own the unity ↔ ros 2 integration layer for an autonomous pediatric wheelchair.",
      "design and build the human-robot interface used by pediatric participants.",
      "turn open-ended research goals from graduate supervisors into working, testable software.",
    ],
    accomplishments: [
      "built a real-time bridge between unity and ros 2 humble — bidirectional pub/sub syncing urdf wheelchair models with slam occupancy grids.",
      "wrote dual-mode control: a virtual joystick for cmd_vel teleop, and a gui for publishing autonomous nav2 goals.",
      "designed a high-contrast, gamified human-robot interface for pediatric users with visual impairments, driven by the robot's real-time pose.",
    ],
    growth:
      "research taught me to work without a spec — to take an open-ended question, scope it into something buildable, and defend my technical choices to people who know far more than i do. i got much more comfortable reading robotics papers and ros docs and turning them into code.",
    teamwork:
      "i work under graduate-student researchers and alongside clinicians, so i had to learn to translate between robotics, software, and the real needs of pediatric patients. building something a child will actually use raises the bar on communication and care.",
    stack: ["unity 2022.3", "ros 2 humble", "c#", "nav2", "slam"],
    projects: ["pediatric-wheelchair"],
  },
  "formula-sae": {
    slug: "formula-sae",
    role: "drivetrain subsystem",
    org: "university of alberta formula racing",
    orgHref: "https://www.ualbertafsae.com",
    range: "nov 2025 — present",
    status: "now",
    location: "edmonton, ab",
    team: "30-person drivetrain subsystem",
    now: true,
    summary:
      "drivetrain member on the university of alberta's formula sae team — designing, simulating, and validating mechanical parts that have to survive technical inspection and a race weekend.",
    responsibilities: [
      "design and revise drivetrain components in solidworks to meet competition rules and inspection.",
      "validate every design with fea before anything is manufactured.",
      "coordinate with a large subsystem to hit build and inspection deadlines.",
    ],
    accomplishments: [
      "redesigned the jacking bar in solidworks after the original failed inspection — lighter, with targeted reinforcements.",
      "ran fea to find high-stress regions, then iterated the design to mitigate failure points.",
      "helped a 30-person drivetrain subsystem pass technical inspection and reach race readiness.",
    ],
    growth:
      "formula sae is where i learned that a design isn't done when it looks right — it's done when it survives inspection and the track. failing an inspection early forced me to take simulation, tolerances, and safety factors seriously.",
    teamwork:
      "thirty people building one car means your part has to interface with everyone else's. i learned to document decisions, hand off cleanly, and work to a shared deadline where one late part blocks the whole team.",
    stack: ["solidworks", "fea", "gd&t"],
    projects: ["jacking-bar"],
  },
};

export const SITE = {
  name: "dhir patel",
  first: "dhir",
  location: "edmonton, ab",
  meta: ["mechatronics and robotics", "university of alberta"],
  currently: [
    "training computer vision models",
    "shipping vr in unity",
    "working on a bci wheelchair",
    "building cool projects",
    "enjoying life",
  ],

  experience: [
    { slug: "clutchvr", title: "unity & ml intern", org: "clutchvr", range: "may 2026 — present", now: true },
    { slug: "robotic-navigation", title: "research assistant", org: "glenrose rehabilitation hospital", range: "jan 2026 — present", now: true },
    { slug: "formula-sae", title: "drivetrain subsystem", org: "formula sae", range: "nov 2025 — present", now: true },
  ] satisfies ExperienceIndexEntry[],

  nav: [
    { label: "about me", href: "/about" },
    { label: "projects", href: "/portfolio" },
    { label: "linkedin", href: "https://www.linkedin.com/in/dhirptl" },
    { label: "github", href: "https://github.com/dhirptl" },
    { label: "x", href: "https://x.com/dhirpatell" },
    { label: "email", href: "mailto:dhirpatel768@gmail.com" },
  ] satisfies NavItem[],

  bio: [
    "i'm an engineering student interested in robotic systems, consumer electronics, product design, and machine learning. here's some stuff that i like ⬇️",
  ],

  gallery: [
    { id: "lily", label: "lily 🐶", src: "/images/gallery-lily.jpeg" },
    {
      id: "travelling",
      label: "travelling",
      photos: [
        { id: "1", location: "barcelona, spain", src: "/images/gallery-travelling-barcelona.jpeg" },
        { id: "2", location: "japan", src: "/images/gallery-travelling-japan.jpeg" },
        { id: "3", location: "yellowstone national park", src: "/images/gallery-travelling-yellowstone.jpeg" },
      ],
    },
    {
      id: "hiking",
      label: "hiking",
      photos: [
        { id: "1", src: "/images/gallery-hiking-1.jpeg" },
        { id: "2", src: "/images/gallery-hiking-2.jpeg" },
      ],
    },
    { id: "keyboards", label: "keyboards", src: "/images/gallery-keyboards.jpeg" },
    { id: "slopitch", label: "slo-pitch", src: "/images/gallery-slopitch.jpeg" },
    {
      id: "running",
      label: "running",
      photos: [
        { id: "1", src: "/images/gallery-running-1.jpeg" },
        { id: "2", src: "/images/gallery-running-2.jpeg" },
      ],
    },
  ] satisfies GalleryItem[],

  albums: [
    { id: "astroworld", title: "astroworld", artist: "travis scott", cover: "/images/album-astroworld.jpeg" },
    { id: "take-care", title: "take care", artist: "drake", cover: "/images/album-takecare.jpeg" },
    { id: "second-new", title: "alone at prom", artist: "tory lanez", cover: "/images/album-second.jpeg" },
    { id: "channel-orange", title: "channel orange", artist: "frank ocean", cover: "/images/album-channel-orange.jpeg" },
    { id: "carti", title: "playboi carti", artist: "self-titled", cover: "/images/album-carti-self-titled.jpeg" },
  ] satisfies Album[],

  education: {
    school: "university of alberta",
    degree: "bsc engineering",
    range: "sep 2025 — present",
    location: "edmonton, ab",
  },

  expDetail: EXP_DETAIL,

  projectCategories: ["hardware", "full stack", "ml / ai", "robotics", "mechanical"],

  projects: [
    {
      slug: "integratedflight",
      name: "integratedflight",
      categories: ["robotics", "full stack", "ml / ai"],
      date: "2026",
      tech: ["python", "fastapi", "groq", "react", "vite", "whisper", "mavsdk", "ardupilot"],
      links: [{ label: "github ↗", href: "https://github.com/harsituni/IntegratedFlight" }],
      overview:
        "a safety-first drone command and mission-control platform that turns plain-english commands into structured flight actions, validates them against mission constraints, and feeds operators back through a live ui and a voice workflow.",
      sections: [
        {
          title: "what it does",
          body: 'an operator says "alpha take off to 10 meters", "fly to the northwest watch tower", or "return to the landing pad and land." the system parses intent with an llm command brain, resolves natural-language locations to canonical waypoints, runs hard safety checks, and returns a validated execution result with confidence and risk context — all reflected in a real-time mission view.',
        },
        {
          title: "core features",
          items: [
            "natural-language command parsing into structured drone actions.",
            'challenge-aware waypoint mapping — "northwest watch tower" resolves to TOWER_NW.',
            "hard-block safety enforcement for no-go zones, bad waypoints, and unsafe targets.",
            "operator confirm/cancel flow for ambiguous or high-risk commands.",
            'session memory + follow-ups ("do that again", "same target").',
            "multi-waypoint tasking and telemetry-ready coordinate verification.",
          ],
        },
        {
          title: "safety model",
          body: "safety is enforced before execution: unknown or invalid waypoints are blocked, no-go-zone incursions are blocked, altitude violations at constrained waypoints are blocked, unsafe targeting is blocked or confirmation-gated, and invalid weaponized intent is hard-rejected.",
        },
        {
          title: "architecture",
          items: [
            "frontend/ — operator ui: command log, mission status, interaction panels.",
            "whisper-backend/ — fastapi stt + command-execution bridge.",
            "groq-integration/ — llm parser, validator, and mission command brain.",
            "challenge/ + mavsdk sim stack — waypoints, no-go zones, sitl/gazebo context.",
          ],
        },
        {
          title: "what's next",
          items: [
            "full live mission execution against sitl controls, not just validation.",
            "a richer planner for multi-drone concurrent tasking.",
            "automatic recovery and replanning on verification failure.",
            "timeline replay, mission audit reports, and role-based command permissions.",
          ],
        },
      ],
    },
    {
      slug: "optibox",
      name: "optibox",
      categories: ["full stack"],
      date: "2026",
      tech: ["python", "flask", "react", "typescript", "vite", "tailwind"],
      overview:
        "a greedy routing and dispatch system for a multi-shuttle warehouse — it receives boxes, stores them intelligently, ships them through active pallet destinations, and plays the whole run back visually.",
      sections: [
        {
          title: "what it does",
          items: [
            "simulates 32 shuttles operating across a silo layout.",
            "routes inbound boxes to either immediate cross-dock delivery or storage + pickup on the same route.",
            "tracks pallet progression and completion over time.",
            "produces a timeline you can scrub, with randomized load, run, and event/metric inspection.",
          ],
        },
        {
          title: "how we built it",
          items: [
            "python + flask backend: the core simulation state machine, shuttle task logic, dispatch + pallet lifecycle rules, csv state generation, and timeline export.",
            "react + typescript + vite + tailwind frontend: playback controls, silo-grid visualization, an event log + pallet panel, and deterministic replay ux.",
          ],
        },
        {
          title: "challenges",
          items: [
            "balancing route efficiency, storage placement, and pallet activation/completion at once.",
            "keeping the simulation deterministic while still being interactive.",
            "translating backend state transitions into smooth visual playback.",
            "keeping frontend and backend payload contracts aligned as features evolved.",
          ],
        },
        {
          title: "what we learned",
          body: "how to manage complex warehouse constraints with clear state transitions, how much data contracts matter when playback depends on backend tick data, and how to collaborate quickly under hackathon time pressure.",
        },
      ],
    },
    {
      slug: "pediatric-wheelchair",
      name: "pediatric wheelchair gui",
      categories: ["robotics"],
      date: "jan 2026 — apr 2026",
      tech: ["unity 2022.3", "ros 2 humble", "c#", "nav2", "urp"],
      xp: { label: "research @ glenrose", route: "/experience/robotic-navigation" },
      overview:
        "a unity-based, gamified control interface wired directly into a ros 2 autonomous wheelchair — built to make navigation engaging and safe for pediatric users with visual challenges.",
      sections: [
        {
          title: "key features",
          items: [
            "dual control modes: a virtual joystick for low-level motion, and destination-based autonomous navigation.",
            "a pediatric-friendly, high-contrast palette (yellow on black) to assist children with visual challenges.",
            "gamification — collectibles, progress indicators, and feedback triggered by the wheelchair's actual pose, not commanded motion.",
            "ros 2 integration with the nav2 stack over standard topics and action interfaces.",
          ],
        },
        {
          title: "context",
          body: "built as part of my research at the glenrose rehabilitation hospital, under the guidance of a graduate-student researcher, to directly support ongoing academic work in assistive pediatric robotics.",
        },
      ],
    },
    {
      slug: "signbridge",
      name: "signbridge",
      categories: ["hardware", "ml / ai"],
      date: "feb 2026",
      tech: ["python", "tensorflow", "mediapipe", "opencv", "fusion 360"],
      overview: "a wearable that translates sign language in real time.",
      sections: [
        {
          title: "highlights",
          items: [
            "mediapipe extracts egocentric 3d hand landmarks for real-time translation — aimed at the 70% communication gap for the deaf community.",
            "temporal gesture pipeline in tensorflow, moving from static letters to dynamic word-level gestures.",
            "a proprietary egocentric dataset plus a 'logic toggle' engine that separates fingerspelling from full words.",
          ],
        },
      ],
    },
    {
      slug: "cocare",
      name: "cocare ai",
      categories: ["full stack", "ml / ai"],
      date: "jul 2025",
      tech: ["react", "node.js", "python", "mongodb", "tensorflow"],
      overview: "an ai companion that helps caregivers track behavior.",
      sections: [
        {
          title: "highlights",
          items: [
            "react app that auto-generates child behavior logs from facial recognition, voice cues, and the gpt api.",
            "separate dashboards — caregivers get log reviews and behavior graphs; kids get mood tracking, calming games, avatar rewards.",
            "mediapipe and voice input for passive symptom tracking, built around accessibility and inclusive design.",
          ],
        },
      ],
    },
    {
      slug: "macropad",
      name: "macropad",
      categories: ["hardware"],
      date: "jan 2026",
      tech: ["kicad", "fusion 360", "python (kmk)", "rp2040"],
      overview: "a mechanical keypad designed from the copper up.",
      sections: [
        {
          title: "highlights",
          items: [
            "2-layer pcb in kicad around a seeed xiao rp2040 — i2c oled and daisy-chained addressable rgb.",
            "custom snap-fit enclosure in fusion 360, toleranced for fdm printing around switches and encoders.",
            "kmk firmware handling matrix scanning, encoder interrupts, and live oled layer visualization.",
          ],
        },
      ],
    },
    {
      slug: "jacking-bar",
      name: "jacking bar",
      categories: ["mechanical", "hardware"],
      date: "nov 2025 — present",
      tech: ["solidworks", "fea"],
      xp: { label: "formula sae", route: "/experience/formula-sae" },
      overview: "a redesigned jacking bar for the formula sae car's drivetrain subsystem.",
      sections: [
        {
          title: "the work",
          items: [
            "redesigned in solidworks after the original failed inspection — lighter, with targeted reinforcements.",
            "ran fea to find high-stress regions, then iterated the design to mitigate failure points.",
            "built within a 30-person drivetrain subsystem working toward technical inspection and race readiness.",
          ],
        },
        { title: "note", body: "more on this one coming soon." },
      ],
    },
    {
      slug: "model-rocket",
      name: "model rocket",
      categories: ["mechanical"],
      date: "2025",
      tech: ["openrocket", "composites"],
      overview: "a model rocket build.",
      sections: [{ title: "note", body: "write-up coming soon." }],
    },
  ] satisfies Project[],

  skills: [
    { group: "software & cad", items: ["solidworks", "fusion 360", "kicad", "fea simulation", "unity 2022.3", "ros 2 humble", "mediapipe"] },
    { group: "programming", items: ["python", "c", "javascript", "react", "node.js", "arduino", "raspberry pi"] },
    { group: "tools & fabrication", items: ["git / github", "vs code", "fdm 3d printing", "pcb soldering", "circuit assembly"] },
  ] satisfies SkillGroup[],
};

export type Site = typeof SITE;
