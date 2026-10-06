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
};

export type SkillGroup = {
  group: string;
  items: string[];
};

const EXP_DETAIL: Record<string, ExperienceDetail> = {
  clutchvr: {
    slug: "clutchvr",
    role: "ml & software engineer",
    org: "clutchvr",
    orgHref: "https://clutch-vr.com",
    range: "may 2026 - aug 2026",
    status: "summer 2026",
    location: "remote",
    team: "small startup - product & engineering",
    now: false,
    summary:
      "ml & software engineer at clutchvr, a small startup building a vr sports film-study app - real game footage becomes a 3d play you can walk around inside a meta quest. my work leaned mostly on the unity side, alongside the computer-vision models that turn broadcast video into players on a field.",
    responsibilities: [
      "built the unity front end for the headset app - a new login page with 'stay logged in', a from-scratch rebuild of the in-headset keyboard, the menu layout, and labels on every controller button so you always know what a button does.",
      "wrote the route-recognition logic: it reads the json play data coming from the react client, predicts which route each receiver is running, and floats the route name above them in pov mode.",
      "fixed world-space ui problems that only exist in a headset - a login page that wasn't centred, a keyboard sitting too close to your face, menus spawning too high.",
      "built player-detection and team-differentiation models for basketball and american football, from dataset to training to inference.",
      "learned blender from zero on the job and shipped backpedal, strafe and block animations, remodelled the goal posts and other static objects, and built a new set of line-of-scrimmage down scenarios.",
    ],
    accomplishments: [
      "built a basketball pipeline on yolov11 detection + bytetrack tracking with an unsupervised, colour-based team classifier - no per-game jersey labels. it warms up on on-court players, clusters their colours, filters referees out by their grey-shirt / dark-pants signature, and uses voting with hysteresis and soft locks so a player's team doesn't flicker frame to frame.",
      "iterated team differentiation through three approaches: my own band algorithm (split each box into horizontal bands and keep only the jersey - dropping the head and crowd at the top and the legs and floor at the bottom), then whole-clip colour clustering (watch the whole clip first, find the two dominant team colours, then assign), then a shift from frame-by-frame to offline whole-play analysis so the model has the full play as context. the first two each moved the needle a little; the architecture change is where the real headroom was.",
      "removed bounding-box jitter by adding temporal memory to the predict step. the boxes drive the footage-to-3d conversion, so a shaking box meant a shaking player in vr.",
      "took the same problem to american football with a yolov11s-seg segmentation model - mask the player, subtract the turf, sample the torso, then cluster team colours.",
      "built my own football dataset instead of hand-labelling every frame: merged several box-labelled sources, auto-generated segmentation labels with sam, and mined hard negatives (crowd, bench and sideline false positives) back into training.",
      "learned to train models thoroughly: froze the first 10 backbone layers so a small dataset fine-tunes the pretrained features instead of overwriting them, trained the football model at a 1280 px image size so small, distant players stay visible, and added broadcast-style augmentation (small rotations, random erasing, copy-paste) to look like real tv footage.",
    ],
    growth:
      "clutchvr was a small startup, so i reported directly to the ceo and was expected to bring ideas, not just close tickets - i pitched features i wanted to work on and then built them. i also looked at market fit and researched competitors and their products to understand where our app stood. technically, i learned blender from nothing and learned what it actually takes to train a model well rather than just running a training script.",
    teamwork:
      "most days were a build-then-debug loop with the ceo: hop on a call, walk through what he was finding, fix it, repeat. i helped coworkers on both the unity front end and the machine-learning side, and before deadlines we ran team sprints - with overtime - to clear cybersecurity bugs and other issues before a build went out.",
    stack: ["unity", "c#", "python", "yolov11", "ultralytics / pytorch", "bytetrack", "sam", "opencv", "blender", "meta quest", "jupyter"],
    projects: [],
  },
  "robotic-navigation": {
    slug: "robotic-navigation",
    role: "mechatronics intern",
    org: "glenrose rehabilitation hospital",
    orgHref: "https://www.imagination-centre.ca/research",
    range: "jan 2026 - present",
    status: "now",
    location: "edmonton, ab",
    team: "neuromuscular control and biomechanics laboratory (ncbl)",
    now: true,
    summary:
      "mechatronics intern in the neuromuscular control and biomechanics laboratory (ncbl) at the glenrose rehabilitation hospital - building a gamified unity front end for a ros 2 autonomous pediatric power wheelchair, designed so every child-facing function works with two switches, one switch, or discrete commands from a brain-computer interface.",
    responsibilities: [
      "design and build the unity client: three navigation modes, switch access, caregiver tools and gamification.",
      "keep ros 2 authoritative - every motion request and pose update crosses the unity / ros boundary through one bridge component.",
      "bring up and maintain the ros 2 simulation backend the client is developed against.",
      "link brain-computer interface commands into the same input path the keyboard and switches use.",
    ],
    accomplishments: [
      "built three navigation modes: explorer (step-wise forward / turn / stop commands), magic travel (pick a room and the chair drives there), and smart guide (pick a caregiver, wall or doorway to follow).",
      "made the scanning loop the primary code path - two-switch scanning, one-switch timed scanning, direct keys and bci markers all call the same trigger, so there's one behaviour to validate instead of three.",
      "rebuilt the clinic floor at runtime from the slam occupancy grid - threshold, or-reduce, de-speckle, thicken walls, check every room is still connected - then bake a navmesh, so a new map installs without rebuilding the app.",
      "drove every reward from the chair's measured pose, never from commanded motion, so a child is never rewarded for a trip the chair didn't make.",
      "ported the lab's gazebo classic simulation to gazebo fortress with a full map_server / amcl / nav2 bring-up; in simulation the chair planned and drove to a commanded goal, finishing 0.24 m from it.",
      "tracked down a 'blind' lidar: under the vm's hardware-accelerated opengl, gazebo's gpu lidar returned its minimum range on every beam while still publishing at a normal 30 hz. forcing software rendering fixed it.",
      "piped bci commands in over lsl (FORWARD / TURN_LEFT / TURN_RIGHT / STOP) through the same trigger as the keyboard and switches. when lsl's pull_sample never returned inside unity's mono runtime, a packet capture proved the samples were arriving - so i moved lsl receiving into a small python lsl → tcp bridge. so far it has been tested end to end with a stub classifier, not real eeg.",
    ],
    growth:
      "research taught me to work without a spec - to take an open-ended question, scope it into something buildable, and defend my technical choices to people who know far more than i do. it also taught me to be honest about what's done: the unity client works end to end in simulation, but sending goals from unity to ros 2 is still stubbed and nothing has been tested with children yet. the bci path works over lsl with a stub classifier; connecting a real eeg classifier comes next.",
    teamwork:
      "i work under a graduate-student researcher who scopes the project, alongside a lab colleague handling pcb and electronics work on the chair, so i had to learn to translate between robotics, software, and the real needs of pediatric patients. building something a child will actually use raises the bar on communication and care.",
    stack: ["unity 2022.3", "c#", "ros 2 humble", "nav2", "gazebo fortress", "slam", "lab streaming layer", "python"],
    projects: ["pediatric-wheelchair"],
  },
  "formula-sae": {
    slug: "formula-sae",
    role: "mechanical & electrical team member",
    org: "university of alberta formula racing",
    orgHref: "https://www.ualbertafsae.com",
    range: "nov 2025 - present",
    status: "now",
    location: "edmonton, ab",
    team: "drivetrain subsystem",
    now: true,
    summary:
      "mechanical & electrical team member on the university of alberta's formula sae team. i worked on the drivetrain subsystem - redesigning the jacking bar so it could actually be built.",
    responsibilities: [
      "design and revise mechanical parts in solidworks to meet competition rules and inspection.",
      "validate designs with fea before anything gets cut or welded.",
    ],
    accomplishments: [
      "redesigned the jacking bar after last year's was too heavy and poorly made - a steel tube with scooped cutouts to shed weight, validated in solidworks simulation at a minimum factor of safety of about 2.0.",
      "caught a clearance problem: the differential hangers were hitting the jacking bar because the mounting tabs didn't give enough clearance, so i redesigned the tabs to be a bit longer and differently shaped.",
      "found the minimum-safety-factor hotspot at a sharp cutout edge and some edges that were too thin and would break, and filleted those edges to spread the stress.",
      "built it by hand when machining wasn't an option: drawing → printed stencil wrapped on the tube → angle grinder → welded-on tabs.",
    ],
    growth:
      "formula sae is where i learned that a design isn't done when it looks right - it's done when it can be built with the tools you actually have and survive the car. the jacking bar taught me design for manufacturing, stress concentration, and how to read an fea factor-of-safety plot critically instead of just checking the peak number.",
    teamwork:
      "a whole team building one car means your part has to interface with everyone else's. i learned to document decisions, hand off cleanly, and work to a shared deadline where one late part blocks everyone.",
    stack: ["solidworks", "solidworks simulation (fea)", "welding / fabrication"],
    projects: ["jacking-bar"],
  },
};

export const SITE = {
  name: "dhir patel",
  first: "dhir",
  location: "edmonton, ab",
  meta: ["mechatronics and robotics", "university of alberta"],
  currently: [
    "wiring a bci into a pediatric wheelchair",
    "an fsae mechanical & electrical team member",
    "working on a drone @ uarad",
  ],

  experience: [
    { slug: "clutchvr", title: "ml & software engineer", org: "clutchvr", range: "may 2026 - aug 2026" },
    { slug: "robotic-navigation", title: "mechatronics intern", org: "glenrose rehabilitation hospital · ncbl", range: "jan 2026 - present", now: true },
    { slug: "formula-sae", title: "mechanical & electrical team member", org: "formula sae", range: "nov 2025 - present", now: true },
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
    { id: "lily", label: "lily", src: "/images/gallery-lily.jpeg" },
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
    { id: "carti", title: "playboi carti", artist: "playboi carti", cover: "/images/album-carti-self-titled.jpeg" },
  ] satisfies Album[],

  education: {
    school: "university of alberta",
    degree: "bsc engineering",
    range: "sep 2025 - present",
    location: "edmonton, ab",
  },

  expDetail: EXP_DETAIL,

  projectCategories: ["hardware", "full stack", "ml / ai", "robotics", "mechanical"],

  projects: [
    {
      slug: "pediatric-wheelchair",
      name: "bci wheelchair gui",
      categories: ["robotics"],
      date: "jan 2026 - present",
      tech: ["unity 2022.3", "c#", "ros 2 humble", "nav2", "gazebo fortress", "lab streaming layer", "python", "urp"],
      xp: { label: "research @ glenrose", route: "/experience/robotic-navigation" },
      overview:
        "a gamified unity front end for a ros 2 autonomous pediatric power wheelchair - every child-facing function is reachable with two switches, one switch, or discrete commands from a brain-computer interface, and rewards only ever come from trips the chair actually made.",
      sections: [
        {
          title: "the problem",
          body: "children with severe motor impairments are often shut out of independent powered mobility, and the barrier is usually the interface rather than the chair: a proportional joystick assumes fine motor control, sustained grip and stable posture. ros 2's nav2 stack already handles localization, planning and obstacle avoidance, so a child could choose a destination instead of steering continuously - but nav2 has no front end a young child can use. the goal was one build that serves a child on a keyboard, a switch user, and a bci user sending discrete commands.",
        },
        {
          title: "how it works",
          items: [
            "explorer - step-wise control through one central 'active command' panel instead of a cluster of buttons, so the child's attention has one place to be. forward sends a goal 3 m ahead; turns are 45° and interruptible, so a new turn cancels and replaces the one in progress.",
            "magic travel - pick a room card and the chair drives there. an adult calibrates each room once by tapping the mini-map, and the route shows as a glowing line plus chevrons on the floor, which are easier for young children to follow.",
            "smart guide - a follow-assist mode: pick what to follow (a caregiver, a corridor wall, a doorway) and the chair is guided toward it. detection sits behind an interface that is currently filled by a simulation stand-in, not real lidar.",
            "bci input - commands arrive as discrete markers (FORWARD, TURN_LEFT, TURN_RIGHT, STOP) over lab streaming layer, through a small python bridge, into the same entry point as a key press.",
            "the map - the clinic floor is rebuilt at runtime from the slam occupancy grid (crop, threshold, de-speckle, thicken walls, connectivity check) and baked into a navmesh, so a new map installs without rebuilding the project.",
            "a caregiver panel behind a gear you have to hold for 3 s - awkward for a child to trigger, with no pin for staff to forget. it controls switch access, map replacement and trimming, wall thickness, route arrows, collectibles and progress reset.",
          ],
        },
        {
          title: "design choices",
          items: [
            "accessibility is the primary code path, not an add-on. bolting a switch mode onto a conventional interface gives you two code paths and two sets of bugs, so the scanning loop came first: two-switch scanning, one-switch timed scanning, direct keys and bci markers all call the same trigger. there's one behaviour to validate instead of three, and a clinician sees the same feedback whatever the input method.",
            "one bridge for all motion and pose. ros 2 owns localization, planning, motion and safety; unity owns visualization, interaction, accessibility and gamification. everything crossing that line goes through a single component, so moving from local simulation to the live robot is a configuration change, not a rewrite. this was the most consequential decision - the interface, accessibility and reward systems don't depend on which side is driving.",
            "rewards come from measured pose, not commanded motion. rewarding the command would have been much simpler, but it would congratulate a child for a trip the chair never completed - misleading for a kid learning cause and effect. pickups use a distance check against the bridge's pose event rather than a physics trigger, so they work unchanged when the ros pose drives the avatar.",
            "walls are or-reduced rather than averaged when the occupancy grid is downsampled, because averaging thins walls and can open gaps a planner will drive through - or-reduction can only thicken them.",
            "the access method belongs to the user, not the screen. dwell time (default 5 s), input source, bci latency compensation and auto-pause live in one persisted settings object shared by every scan context, and inputs are debounced to reject the involuntary repeat presses common with spastic or ataxic movement.",
            "redundant feedback. a highlighted control scales up and its outline pulses as well as changing colour, so a child who can't perceive the colour change still sees the size change. the palette is yellow on black for maximum contrast.",
            "eeg classification stays outside unity. unity only consumes short command strings - the same information as a key press - so the driving code didn't change when bci input was added.",
            "built for a mini-pc, not a workstation. the runtime target is a beelink ser5 driving the chair's screen, where a stutter mid-trip is a safety concern rather than a cosmetic one - so collectibles are pooled, theme changes swap a shared material, and the route line pre-allocates its buffers so nothing allocates in steady state.",
          ],
        },
        {
          title: "what went wrong",
          items: [
            "double-firing: with only two keys serving every screen, an overlay and the driving controller both consumed enter in the same frame, so opening settings instantly selected its first item. fixed with a single global focus stack where only the top-most context reads input - and it prunes destroyed entries, otherwise a panel destroyed during a scene reload could silently block driving.",
            "wall clipping: moving the chair with transform.translate bypassed the navmesh agent and let it pass through walls - unacceptable in a system whose premise is safe navigation. i rerouted motion through the agent, so the boundary is enforced by construction instead of by a collision check that could be missed at speed.",
            "turns that snapped or dropped inputs: instant rotation looked wrong and taught nothing about how the chair really turns, and a non-cancellable turn ignored a quick left after a right. the turn is now cancellable and computed from the remaining angle, so it ends at exactly 45° regardless of frame rate.",
            "stuck state: switching modes mid-turn halted a routine before it cleared its 'busy' flag, leaving the controller unresponsive. those flags now also reset when the component is disabled.",
            "disconnected rooms: thickening walls into a readable floor plan could wall over the junction where a narrow corridor meets a room - at a thickness of 2, two of four rooms became unreachable. checking every pair of cells stayed connected was too strict (it tripped on harmless sealed nooks), so the fix counts room-sized connected regions before and after thickening and backs the thickness off until that number is unchanged.",
            "lsl samples lost inside unity: the direct lsl inlet connected but pull_sample never returned data. a packet capture showed valid samples arriving and being acknowledged at the tcp level, so the fault was in the native library under unity's mono runtime, not in project code. the working setup is a small python process that receives the lsl stream and forwards each marker to unity as a text line over a local tcp socket; the unity-side handling is identical, so the bridge can go if the underlying issue is fixed.",
            "a blind lidar that passed every health check: after porting the sim to gazebo fortress, nav2 accepted goals and planned fine but the chair only crept forward. under the vm's hardware-accelerated opengl, gazebo's gpu lidar was returning its 0.3 m minimum range on every beam while still publishing at a normal 30 hz, so the local costmap saw a solid ring of obstacles. no error was logged. forcing software rendering restored correct ranges.",
          ],
        },
        {
          title: "what i learned",
          items: [
            "validate a sensor by the values it reports, not the rate it reports them.",
            "fix interfaces early. the bridge was locked in before any controller was written, which is why none of them contain navigation logic.",
            "build the environment pipeline before the ui, so everything after it gets exercised against a realistic floor plan and a genuinely baked navmesh.",
            "test every screen each way a user could reach it - keyboard, the two scanning keys alone, and one-input timed scanning - so nothing is reachable by one path but not the others.",
          ],
        },
        {
          title: "status",
          body: "the unity client is functionally complete as a self-contained simulation - one scene, 47 runtime scripts, roughly 7,900 lines of runtime c# - and every working child-facing feature was exercised end to end in the editor with the two-key loop alone. it already subscribes to the robot's map-frame pose from ros 2. on the ros side, the gazebo fortress backend is verified: nav2 produced a 128-pose plan to a commanded goal and the simulated chair finished 0.24 m from it. what's not done: sending goals and velocity from unity to ros 2 is still stubbed, so motion in this build runs on unity's navmesh; the unity map and the fortress map are different maps and still need to agree; smart guide detection is simulated; and the bci path has only been tested with a stub classifier broadcasting markers over lsl - no eeg has been recorded or classified yet. nothing has been evaluated with children, so the accessibility claims are architectural, not empirical.",
        },
        {
          title: "context",
          body: "built as part of my work in the neuromuscular control and biomechanics laboratory (ncbl) at the glenrose rehabilitation hospital, under the guidance of a graduate-student researcher, to support ongoing academic work in assistive pediatric robotics.",
        },
      ],
    },
    {
      slug: "jacking-bar",
      name: "jacking bar",
      categories: ["mechanical", "hardware"],
      date: "nov 2025 - 2026",
      tech: ["solidworks", "solidworks simulation (fea)", "engineering drawings", "angle grinder", "welding"],
      xp: { label: "formula sae", route: "/experience/formula-sae" },
      overview:
        "a lighter, manufacturable jacking bar for the university of alberta formula sae car - a steel tube with scooped cutouts, validated with fea and built by hand.",
      sections: [
        {
          title: "the problem",
          body: "last year's jacking bar was too heavy, wasn't manufactured properly, failed inspection, and ran into a lot of issues. this year the goal was a new bar designed from the start to be made.",
        },
        {
          title: "design choices",
          items: [
            "a steel tube with large scooped, saddle-shaped cutouts - material comes out where the load path doesn't need it and stays where it does.",
            "two tabs welded onto the tube that pin to the differential hangers.",
            "clearance to the differential hangers: the part connecting to the hangers didn't give enough clearance, so the differential hangers were actually hitting the jacking bar. we redesigned the mounting tabs to be a bit longer and differently shaped so everything clears.",
          ],
        },
        {
          title: "fea",
          items: [
            "static study in solidworks simulation: peak von mises stress around 186 mpa against a 460 mpa yield strength.",
            "factor of safety study: a minimum factor of safety of about 2.0.",
            "the minimum-safety-factor hotspot sat at a sharp cutout edge. stress concentrates at sharp, pointy corners, so that transition got a fillet to spread the load over more material.",
            "the stress study also showed some edges were too thin and would break, so those got fillets too.",
          ],
        },
        {
          title: "manufacturing",
          body: "my cnc lathe training wasn't finished, so machining it wasn't an option. instead we made a drawing, printed a stencil from it, wrapped the stencil around the tube, cut the profile with an angle grinder, spray-painted it, and welded on the tabs that pin to the differential hangers.",
        },
        {
          title: "what went wrong",
          body: "cutting by hand is never as accurate as the model. following a stencil with a grinder makes clean, consistent curves hard, and small deviations add up along a long profile - the stencil at least meant the shape came from the drawing rather than from freehand marking.",
        },
        {
          title: "what i learned",
          items: [
            "design for manufacturing with the tools you actually have access to, not the ones you wish you had.",
            "stress concentrates at sharp corners - a fillet is a cheap fix.",
            "read an fea factor-of-safety plot for where the minimum is, not just what the peak stress is.",
            "how to make a drawing that someone can actually build from.",
          ],
        },
      ],
    },
    {
      slug: "motor-mounts",
      name: "hexacopter motor mounts",
      categories: ["mechanical", "hardware"],
      date: "2026",
      tech: ["solidworks", "3d printing (pla)", "gyroid infill"],
      overview:
        "3d-printed motor mounts for the uarad university drone team's hexacopter - a twist-lock top plate, a print orientation chosen around the loads, and a lot of lessons about clearances and tolerances.",
      sections: [
        {
          title: "the problem",
          body: "each mount holds a motor on the end of a carbon-fibre arm. in the first design, the top plate was held on by three m3 screws threading into the mount casing. a printed prototype showed it couldn't work: the casing left no access to seat a captive nut behind the screw holes, and the fit between printed parts was off enough to cause binding and play.",
        },
        {
          title: "design choices",
          items: [
            "cheap test prints first: before committing to full-strength prints, we ran a quick test print at 5% infill just to check clearances and gaps. it's fast and uses little material, so fit problems show up early instead of on a final part.",
            "twist-lock top plate: i redesigned the top plate as a bayonet-style twist-lock with the bottom mount. the top plate uses m4 screws, and the geometry is set so that when the plate twists and locks in, its screw holes line up - the lock does the locating, so the screws aren't fighting for alignment.",
            "print orientation: fdm parts are weakest between layers, so orientation is a structural decision, not a slicer default. i printed the mount top-down so the layers run horizontally, choosing the layer direction relative to the principal stresses from hand calcs.",
            "a fillet at the base: i was worried about layers peeling apart where the base plate meets the walls. thinking of stress as lines flowing through the part, i added a solid fillet there so the load has a path across the layer lines instead of a sharp corner to concentrate at.",
            "infill: pla at about 45% gyroid. strength gains are minimal as you go higher, and gyroid is close to equally strong in every direction, which suits a part loaded from several directions.",
            "arm socket: i thickened the section where the carbon-fibre arm tubes go in. the tubes are friction-fit and don't budge.",
          ],
        },
        {
          title: "the cutouts",
          body: "on the mount face there's a central circular recess for the motor's bottom boss and shaft, with four small holes for the motor's mounting screws. around it are four rounded-rectangle cutouts and four narrow diagonal slots, which leave solid cross-shaped spokes running from the motor seat out to the rim. the top plate has a matching pattern. the reasoning: material comes out where it isn't in the load path, which saves weight, while the spokes carry thrust and torque from the motor out to the rim and the arm. the corners are rounded because sharp corners concentrate stress, and pla doesn't tolerate that well. the openings also let air move under the motor and give the motor leads a way through.",
        },
        {
          title: "what went wrong",
          items: [
            "the three-screw top plate (above) - caught by a printed prototype before it went any further.",
            "the tip at the bottom of the mount was modelled a bit too shallow, so it wasn't going through properly. i made it bigger.",
            "printed holes came out slightly smaller than modelled - the infill and print shrink pull a hole in. i started measuring real printed parts and feeding the clearances back into cad before committing to final prints.",
            "the 5% infill test print showed the plate height was a bit too tall, which caused interference with the bottom of the plate. i redesigned the height to fix it, along with the clearances, before the final print.",
          ],
        },
        {
          title: "what i learned",
          body: "clearances were the big one. almost every problem on this part was a clearance or tolerance problem: the bottom tip too shallow, printed holes coming out undersized, the plate height interfering, and getting the bayonet to twist and lock without binding or play. a part that fits perfectly in cad doesn't fit off the printer - you measure the real part, find the offset, and design it in, and a quick low-infill test print is the cheapest way to find those offsets. i also learned to treat print orientation and infill as structural decisions.",
        },
        {
          title: "status",
          body: "after the 5% infill test print, i fixed the clearances and the plate-height interference, then made the final full-strength print (45% gyroid pla). the final mounts went on the hexacopter and we did a test flight.",
        },
      ],
    },
    {
      slug: "flightreacts",
      name: "flightreacts",
      categories: ["robotics", "full stack", "ml / ai"],
      date: "2026",
      tech: ["python", "fastapi", "groq", "react", "vite", "whisper", "mavsdk", "ardupilot"],
      links: [{ label: "github", href: "https://github.com/harsituni/FlightReacts" }],
      overview:
        "a safety-first drone mission-control platform built at red team hacks in calgary - a very selective hackathon with under 10% acceptance. an operator speaks plain english, an llm parses the intent, and deterministic safety checks decide what the drone is actually allowed to do.",
      sections: [
        {
          title: "the problem",
          body: "operators under pressure want to command a drone quickly in plain language - but a language model can misread a command, invent a location, or produce something unsafe. the challenge was getting natural-language speed without ever letting the model bypass mission rules.",
        },
        {
          title: "how it works",
          body: 'an operator says "alpha take off to 10 meters" or "fly to the northwest watch tower." whisper transcribes it, an llm command brain parses the intent into a structured action, natural-language locations resolve to canonical waypoints, hard safety checks run, and the result comes back with confidence and risk context in a live mission view.',
        },
        {
          title: "design choices",
          items: [
            "the llm parses, it doesn't decide. every parsed command goes through deterministic checks before execution - unknown waypoints, no-go-zone incursions, altitude violations at constrained waypoints and unsafe targeting are blocked, and invalid weaponized intent is hard-rejected. no phrasing can talk its way past them.",
            "confirm / cancel for risky commands. ambiguous or high-risk commands wait for explicit operator confirmation instead of guessing.",
            'waypoint aliasing. phrases like "northwest watch tower" resolve to canonical ids like TOWER_NW, so the system works from known mission waypoints instead of free-form coordinates.',
            'session memory for follow-ups ("do that again", "same target") and multi-waypoint routes in a single command.',
          ],
        },
        {
          title: "architecture",
          items: [
            "frontend/ - operator ui: command log, mission status, interaction panels.",
            "whisper-backend/ - fastapi stt + command-execution bridge.",
            "groq-integration/ - llm parser, validator, and mission command brain.",
            "challenge/ + mavsdk sim stack - waypoints, no-go zones, sitl/gazebo context.",
          ],
        },
        {
          title: "challenges",
          items: [
            "keeping the parser flexible while the safety layer stayed deterministic.",
            "integrating branches as the ui and command-brain variants evolved in parallel.",
            "path and runtime mismatches between backend launch contexts.",
            "handling verification both with and without live telemetry.",
            "keeping confirm / cancel robust to all the ways people actually say yes and no.",
          ],
        },
        {
          title: "what i learned",
          body: "if a model's output ends up moving something physical, the model shouldn't be the last line of defence. putting a validation layer between the llm and the actuator is the interesting engineering - it's what makes natural language usable around a drone.",
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
        {
          title: "team",
          body: "built with harsit baral, dip khadka, om upadhyay and shreay patel.",
        },
      ],
    },
    {
      slug: "fade-ninja",
      name: "fade ninja",
      categories: ["robotics", "hardware", "full stack"],
      date: "2026",
      tech: ["python", "swift", "swiftui", "arkit", "arduino", "c++", "sqlite"],
      links: [{ label: "github", href: "https://github.com/saswath-06/fade_ninja" }],
      overview:
        "a robot barber you teach once and replay forever - a barber holds an iphone like a clipper, the arm mirrors their hand, and the cut is saved as a file the arm can re-run on its own. built at hack the north 2026.",
      sections: [
        {
          title: "the problem",
          body: "the back of a fade is the one part of a haircut you physically can't do yourself, and 'same as last time' at a barber is a guess from memory. we wanted a haircut to be something you can save and replay.",
        },
        {
          title: "how it works",
          body: "you hold an iphone like a clipper - it's the teach pendant. arkit tracks it in 3d and streams the pose over udp at 50 hz to a python server that does inverse kinematics, joint-limit enforcement, recording and replay, and an arduino drives four servos on a 3d-printed arm. a hold-to-lock clutch parks the arm so you can reposition your hand, like lifting a mouse off the pad. later you pick the cut from your library, press replay, and the arm runs it again with nobody holding the phone.",
        },
        {
          title: "design choices",
          items: [
            "heel on the scalp instead of hovering. the clipper's heel stays pressed on the scalp and the blade tilts away from it, so hair length is h = L·sin(θ) - about 0.43 mm of error per degree. holding the clipper at a set distance instead turns every millimetre of positioning error into a millimetre of length error, against a fade whose whole range is 0.5 to 8 mm. it's also what barbers do by hand: they rock the clipper out.",
            "record the actuator, not the controller. what gets saved is where the arm actually went, never where the phone thought it was - so a cheap, drifting sensor can't corrupt the recording.",
            "simulate first. we built a physics-lite simulator of the arm with forward and inverse kinematics, real joint limits and reachability, and put the control stack behind 235 automated tests before any hardware existed.",
            "refuse, don't repair. a recording that asks for an impossible pose is corrupt data - smoothing it back into range would quietly run it near someone's head, so replay refuses it instead.",
          ],
        },
        {
          title: "what went wrong",
          items: [
            "coordinate frames: the app sent position in the camera's axes instead of gravity-aligned world axes. held upright it looked fine; held like a clipper, up became forward. the same class of bug came back in orientation, where turning the phone sideways tilted the blade.",
            "a test that agreed with the bug: a sign error in the quaternion maths passed its unit test because the test helper used the same wrong convention. it only surfaced when we ran against a teammate's independently written simulator and the numbers disagreed.",
            "clipping joints instead of clamping targets: reaching past the arm's envelope froze it with the elbow folded and pushed the tip ~15 mm off the commanded line. clamping the target to the workspace before solving ik fixed both.",
            "the network: campus wifi's client isolation meant the phone and laptop couldn't see each other. after hours on it, we ran everything off a phone hotspot.",
          ],
        },
        {
          title: "what i learned",
          body: "your own tests can encode your own wrong assumption - integration against something someone else wrote catches what unit tests structurally can't. and every bug you find in simulation is one you don't find with a motor spinning next to a head.",
        },
        {
          title: "team",
          body: "built with tejas gautam, om upadhyay and saswath yeshwanth.",
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
            "2-layer pcb in kicad around a seeed xiao rp2040 - i2c oled and daisy-chained addressable rgb.",
            "custom snap-fit enclosure in fusion 360, toleranced for fdm printing around switches and encoders.",
            "kmk firmware handling matrix scanning, encoder interrupts, and live oled layer visualization.",
          ],
        },
      ],
    },
    {
      slug: "signbridge",
      name: "signbridge",
      categories: ["hardware", "ml / ai"],
      date: "feb 2026",
      tech: ["python", "tensorflow", "mediapipe", "opencv", "raspberry pi", "fusion 360"],
      links: [{ label: "github", href: "https://github.com/harsituni/yeti-hacked" }],
      overview: "a wearable that translates sign language in real time - built at hacked 2026 at the university of alberta.",
      sections: [
        {
          title: "the problem",
          body: "for many deaf and hard-of-hearing people, a doctor's visit can be a source of real anxiety. we were moved by the story of an asl instructor who was refused treatment because no interpreter was available. bringing a third-party interpreter can compromise medical privacy - we wanted something that lets people communicate on their own, privately.",
        },
        {
          title: "design choices",
          items: [
            "a wearable: 3d-printed glasses with a camera on the left arm, so the signer's hands stay free and the camera sees what they see.",
            "a raspberry pi as the processor - compact enough to wear, and our team was already strong in python.",
            "mediapipe hands for real-time 3d hand landmarks, feeding a tensorflow model that maps them to asl signs.",
            "our own dataset. public asl datasets didn't match a wearable camera's angle or the lighting of a clinic, so we recorded data from the device itself.",
            "a fingerspelling / word toggle. the model struggled to tell letter-by-letter spelling from single-gesture words, and forcing a word onto a letter produced gibberish - so we built logic to switch between the two modes.",
          ],
        },
        {
          title: "challenges",
          items: [
            "weight balance - fitting a camera and a raspberry pi onto someone's head took several redesigns of the glasses.",
            "soldering in tight spaces led to loose connections, and keeping the camera's power supply stable took real time.",
          ],
        },
        {
          title: "what i learned",
          body: "how to fit a machine-learning pipeline into constrained hardware - and that engineering matters most when it serves someone's independence and dignity.",
        },
        {
          title: "team",
          body: "built with harsit baral, akileash saravanan and dip khadka.",
        },
      ],
    },
    {
      slug: "optibox",
      name: "optibox",
      categories: ["full stack"],
      date: "2026",
      tech: ["python", "flask", "react", "typescript", "vite", "tailwind"],
      links: [{ label: "github", href: "https://github.com/dhirptl/optibox" }],
      overview:
        "a greedy routing and dispatch system for a multi-shuttle warehouse, built at hackupc 2026 in barcelona (europe's biggest student hackathon) for the inditex challenge - it receives boxes, stores them, ships them to active pallets, and replays the whole run visually.",
      sections: [
        {
          title: "the problem",
          body: "inditex's challenge was a warehouse where shuttles move boxes between inbound, storage silos and outbound pallets. the goal was to receive, store and deliver boxes as fast as possible while balancing route efficiency, storage placement, and which pallets are active - all at once.",
        },
        {
          title: "design choices",
          items: [
            "a greedy rule set built around one principle: deliver and store on the same route, so shuttle trips do double duty.",
            "inbound boxes go either straight to cross-dock delivery or into storage with pickup on the same route.",
            "a deterministic simulation of 32 shuttles across a silo layout, so any run can be replayed and debugged exactly.",
            "python + flask backend for the simulation state machine, shuttle task logic, dispatch and pallet lifecycle rules, csv state generation and timeline export; react + typescript + vite + tailwind frontend for playback controls, the silo grid, an event log and a pallet panel.",
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
          title: "what i learned",
          body: "how to manage complex warehouse constraints with clear state transitions, how much data contracts matter when playback depends on backend tick data, and how to collaborate quickly under hackathon time pressure.",
        },
        {
          title: "team",
          body: "built with olivia wong, ioannis pialopoulos and angelos skliros.",
        },
      ],
    },
    {
      slug: "cocare",
      name: "cocare ai",
      categories: ["full stack", "ml / ai"],
      date: "jul 2025",
      tech: ["react", "typescript", "tailwind", "python", "opencv", "mediapipe", "gemini api", "streamlit"],
      links: [{ label: "github", href: "https://github.com/JaiPannu/CoCare" }],
      overview:
        "a respectful ai copilot for inclusive care - privacy-safe sensing that turns a child's activity into short, editable summaries for caregivers. built at nextstep hacks 2025, despite joining the team three days late.",
      sections: [
        {
          title: "the problem",
          body: "we were inspired by organizations like mariam's footsteps, which work with children with disabilities who often struggle to express their needs and feelings. caregivers carry a lot of emotional labour observing, logging and personalizing care, often without knowing how a child truly feels. we wanted something that respects every child's dignity while easing that load.",
        },
        {
          title: "what it does",
          items: [
            "privacy-safe edge sensing detects play, rest and agitation without storing raw video or audio.",
            "smart summaries every 30-60 minutes that caregivers can quickly edit or approve.",
            "nonverbal children can express themselves through tablet buttons or eye-tracking, folded straight into the care log.",
            "calming sensory games that help the child relax and engage.",
          ],
        },
        {
          title: "how we built it",
          items: [
            "mediapipe tracks 33 body landmarks for real-time posture and motion.",
            'the gemini api translates movement patterns into plain summaries - "sitting calmly", "jumping", signs of overstimulation - and the caregiver side suggests responsive activities.',
            "python + opencv for frame processing, with threading so the backend stays smooth while gemini is queried asynchronously.",
            "a react + tailwind + typescript front end, json logs, and a streamlit prototype.",
          ],
        },
        {
          title: "challenges",
          items: [
            "balancing real-time accuracy with usability.",
            "earning privacy and trust when working with vulnerable children.",
          ],
        },
        {
          title: "what i learned",
          items: [
            "privacy is non-negotiable with vulnerable populations.",
            "small design details empower - even a simple 'i liked this' button can make a child feel heard.",
            "trust comes from transparency and control, which is why caregivers edit the summaries instead of just receiving them.",
          ],
        },
        {
          title: "team",
          body: "built with jai pannu, hari mallampalli and shreay patel.",
        },
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
