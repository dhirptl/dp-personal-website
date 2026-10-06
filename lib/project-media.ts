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
  cocare: {
    externalVideo: { href: "https://www.youtube.com/watch?v=8Bfpsvvbp7Y", label: "watch the demo" },
  },
};

export function getProjectMedia(slug: string): ProjectMedia {
  return PROJECT_MEDIA[slug] ?? {};
}
