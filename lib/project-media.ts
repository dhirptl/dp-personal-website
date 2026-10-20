/**
 * Project imagery / video, keyed by project slug (see SITE.projects in site-data.ts).
 * Files live under public/images/projects/{slug}/ (long edge <= 2000px, jpg q~82).
 * Slugs without an entry fall back to the generated gradient card + placeholder hero.
 */

export type ProjectGalleryImage = {
  src: string;
  caption: string;
  /** defaults to the caption */
  alt?: string;
};

export type ProjectMedia = {
  /** card image in the carousels; falls back to hero, then the gradient */
  thumb?: string;
  /** big image at the top of the case study */
  hero?: string;
  heroAlt?: string;
  heroCaption?: string;
  gallery?: ProjectGalleryImage[];
  /** self-hosted video (put the .mp4 in public/, CSP only allows same-origin media) */
  video?: { src: string; poster?: string; caption?: string };
  /** off-site video (youtube etc.) rendered as a link button - iframes are blocked by CSP */
  externalVideo?: { href: string; label: string };
};

const JB = "/images/projects/jacking-bar";
const SB = "/images/projects/signbridge";
const MM = "/images/projects/motor-mounts";
const FN = "/images/projects/fade-ninja";
const PW = "/images/projects/pediatric-wheelchair";
const FR = "/images/projects/flightreacts";
const MP = "/images/projects/macropad";

export const PROJECT_MEDIA: Record<string, ProjectMedia> = {
  "jacking-bar": {
    thumb: `${JB}/cad-assembly.jpg`,
    hero: `${JB}/cad-assembly.jpg`,
    heroAlt:
      "solidworks render of the orange jacking bar mounted under the grey differential hangers",
    heroCaption:
      "the new jacking bar in the drivetrain assembly - the two welded tabs pin to the differential hangers.",
    gallery: [
      {
        src: `${JB}/installed.jpg`,
        caption:
          "the finished bar on the car - painted, with the welded tabs bolted to the differential hangers.",
        alt: "orange jacking bar bolted to the bottom of the black differential hangers at the rear of the maroon formula sae car",
      },
      {
        src: `${JB}/cad-closeup.jpg`,
        caption:
          "close-up of the cutouts - material removed where the load path doesn't need it, with filleted transitions.",
        alt: "close-up render of the jacking bar's scooped cutouts and welded tabs",
      },
      {
        src: `${JB}/fea-von-mises.jpg`,
        caption: "static fea (von mises) - peak ≈186 mpa against a 460 mpa yield strength.",
        alt: "solidworks static study showing von mises stress on the jacking bar",
      },
      {
        src: `${JB}/fea-fos.jpg`,
        caption: "factor of safety study - minimum fos ≈2.0 across the whole bar.",
        alt: "solidworks factor of safety plot of the jacking bar",
      },
      {
        src: `${JB}/fea-fos-hotspot.jpg`,
        caption:
          "the hotspot - stress concentrated at a sharp cutout edge, which is why that transition got a fillet.",
        alt: "zoomed factor of safety plot at the sharp edge of a cutout",
      },
      {
        src: `${JB}/manufactured.jpg`,
        caption:
          "manufactured by hand - a printed stencil wrapped on the tube, then the cutouts ground out with an angle grinder.",
        alt: "steel tube on a workbench with a paper stencil wrapped on it and three cutouts ground out",
      },
    ],
  },
  signbridge: {
    thumb: `${SB}/glasses.jpg`,
    hero: `${SB}/glasses.jpg`,
    heroAlt: "3d-printed asl translation glasses with a camera mounted on the left arm",
    heroCaption: "the 3d-printed asl glasses, with the camera on the left arm.",
    gallery: [
      {
        src: `${SB}/live-demo.jpg`,
        caption: "live demo of the glasses translating signs.",
        alt: "wearing the yellow 3d-printed signbridge glasses with the camera on the frame",
      },
      {
        src: `${SB}/hand-tracking.jpg`,
        caption: "mediapipe hand landmarks with the model's confidence score.",
        alt: "webcam view of a raised hand with mediapipe landmarks drawn over it and the predicted sign and confidence in the corner",
      },
    ],
  },
  "motor-mounts": {
    thumb: `${MM}/bayonet-side.jpg`,
    hero: `${MM}/bayonet-side.jpg`,
    heroAlt:
      "yellow 3d-printed motor mount with the top plate seated and the bayonet pin sitting in its l-shaped slot",
    heroCaption:
      "5% infill test print used to check clearances - the top plate's bayonet pin drops into the l-shaped slot before twisting to lock.",
    gallery: [
      {
        src: `${MM}/bayonet-locked.jpg`,
        caption: "5% infill test print - top plate seated and twisted into the bayonet slot, with the arm-tube socket in front.",
        alt: "angled view of the yellow motor mount with the top plate twisted into the bayonet slot",
      },
      {
        src: `${MM}/mount-face.jpg`,
        caption:
          "5% infill test print, looking down the mount face - central motor boss recess with four motor screw holes, four rounded cutouts and four diagonal slots, arm-tube socket below.",
        alt: "top-down view of the yellow motor mount face showing the motor boss recess, screw holes and cutouts",
      },
    ],
    video: {
      src: `${MM}/first-flight.mp4`,
      poster: `${MM}/first-flight-poster.jpg`,
      caption: "test flight with the final printed motor mounts on the hexacopter.",
    },
  },
  "fade-ninja": {
    thumb: `${FN}/hack-the-north.jpg`,
    hero: `${FN}/hack-the-north.jpg`,
    heroAlt:
      "purple and white 3d-printed robot arm on a wooden base, wired to an arduino, with a teammate holding the iphone control app",
    heroCaption:
      "the fade ninja arm at hack the north - the iphone app (left) drives the servos through an arduino.",
    video: {
      src: `${FN}/arm-demo.mp4`,
      poster: `${FN}/arm-demo-poster.jpg`,
      caption: "the arm sweeping through a sequence of poses on the demo table, with the clipper stand-in taped to the end.",
    },
  },
  "pediatric-wheelchair": {
    /* cropped below the tab bar so the ui text doesn't sit under the card's category label */
    thumb: `${PW}/magic-travel-thumb.png`,
    hero: `${PW}/magic-travel.png`,
    heroAlt:
      "yellow-on-black unity interface with a mode tab bar, a magic travel room list, a blue wheelchair model on the generated map and a mini-map in the corner",
    heroCaption:
      "the unity client in magic travel mode - the central active command panel, generated map, wheelchair model and mini-map.",
    gallery: [
      {
        /* inverted copy of system-architecture.png (light lines on dark) so it doesn't glare on the dark page */
        src: `${PW}/system-architecture-dark.png`,
        caption:
          "system architecture - solid arrows are implemented; the dashed arrow (goal and velocity publishing from unity to nav2) is stubbed in the current build. all motion and pose traffic crosses the unity-ros boundary through one bridge.",
        alt: "block diagram of the unity client and the ros 2 humble stack, joined by the wheelchair state bridge, with an eeg classifier feeding switch input over tcp",
      },
    ],
  },
  flightreacts: {
    thumb: `${FR}/mission-control.png`,
    hero: `${FR}/mission-control.png`,
    heroAlt:
      "dark tactical radar interface with two drones, alpha and bravo, plotted on the radar, a suggested tasks list, hold-to-speak voice input, voice interpreter, command log, confidence meter and a drone status panel",
    heroCaption:
      "the front end - compound tactical radar with both drones, hold-to-speak voice input, the voice interpreter and command log, a confidence meter, and live telemetry for alpha and bravo (flight mode, arming state, position, altitude, battery, gps lock).",
    gallery: [
      {
        src: `${FR}/gazebo-sim.png`,
        caption:
          "the backend simulation - gazebo sim running the compound_ops world, with walls, gate posts, a command building and the iris drone in the entity tree.",
        alt: "gazebo sim window showing a 3d walled compound with buildings, and an entity tree listing iris, ground_plane, walls, gate posts and the command building",
      },
    ],
  },
  macropad: {
    thumb: `${MP}/render-assembled.png`,
    hero: `${MP}/render-assembled.png`,
    heroAlt:
      "3d render of the grey macropad case with the top plate on - two rotary encoders in the top corners, the xiao rp2040 in a notch between them, the oled in a window in the middle and four mx-style switches along the bottom",
    heroCaption:
      "fusion 360 render of the full assembly - encoders up top, the xiao in the notch, the oled window, and the four keys.",
    gallery: [
      {
        src: `${MP}/schematic.png`,
        caption:
          "the schematic - keys sw1-sw4 on gpio0, 1, 2 and 4 straight to ground, encoder a/b channels on gpio26-29, the oled header on gpio6/7 (sda/scl), and the two sk6812 leds chained from gpio3.",
        alt: "kicad schematic of the xiao rp2040 wired to two rotary encoders, a 4-pin oled header, two chained sk6812mini leds and four push switches",
      },
      {
        src: `${MP}/pcb-layout.png`,
        caption:
          "the 2-layer layout in kicad - encoders in the top corners, the xiao and both leds between them, the oled header in the middle, and the four switches along the bottom. red traces are front copper, blue are back.",
        alt: "kicad pcb layout with rotary encoders sw5 and sw6 in the top corners, the xiao rp2040 footprint and two sk6812mini leds between them, the oled panel header j1 in the middle and four switch footprints sw1-sw4 along the bottom",
      },
      {
        src: `${MP}/case-cad.png`,
        caption:
          "the two case parts in fusion 360 - the bottom shell with a cutout in the top wall for the xiao, and the top plate with holes for the encoder shafts, the oled window and four key cutouts.",
        alt: "top-down cad view of a rectangular bottom shell and a flat top plate with two round holes, a rectangular window, four square cutouts and a notch at the top edge",
      },
      {
        src: `${MP}/render-pcb-in-case.png`,
        caption: "the assembled pcb sitting in the bottom shell, with the top plate beside it.",
        alt: "3d render of the green macropad pcb with encoders, xiao rp2040, oled and four switches inside the grey bottom shell, next to the separate top plate",
      },
      {
        src: `${MP}/assembled-pcb-photo.png`,
        caption: "the real board, assembled - xiao, oled, both encoders and all four switches.",
        alt: "photo of the green macropad pcb with the xiao rp2040, oled, two rotary encoders and four switches mounted",
      },
    ],
  },
  cocare: {
    externalVideo: { href: "https://www.youtube.com/watch?v=8Bfpsvvbp7Y", label: "watch the demo" },
  },
};

export function getProjectMedia(slug: string): ProjectMedia {
  return PROJECT_MEDIA[slug] ?? {};
}
