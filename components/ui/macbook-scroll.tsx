"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MotionValue, motion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { IconWorld } from "@tabler/icons-react";
import { IconCommand } from "@tabler/icons-react";
import { IconCaretLeftFilled } from "@tabler/icons-react";
import { IconCaretDownFilled } from "@tabler/icons-react";
import styles from "./macbook-scroll.module.css";

const OPEN_END = 0.35;

/**
 * Children-mode scroll phases (option B):
 * pop → rotate → settle/interact hold → exit (sticky releases, MacBook scrolls away).
 * With scrollZone ≈ 200vh and stage 100vh, sticky holds until progress ≈ 0.5.
 */
export const MACBOOK_PHASE = {
  popEnd: 0.12,
  rotateEnd: 0.28,
  settleEnd: 0.36,
  exitStart: 0.5,
} as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Piecewise map — kept in JS so Chrome doesn't promote to a broken ViewTimeline.
 * Each segment is smoothstep-eased so joins have zero velocity (no hard corners). */
function phaseValue(v: number, stops: number[], values: number[]) {
  if (v <= stops[0]) return values[0];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v <= stops[i + 1]) {
      const span = stops[i + 1] - stops[i];
      const t = span === 0 ? 1 : (v - stops[i]) / span;
      const c = Math.min(1, Math.max(0, t));
      return lerp(values[i], values[i + 1], c * c * (3 - 2 * c));
    }
  }
  return values[values.length - 1];
}

export const MacbookScroll = ({
  scrollYProgress,
  src,
  showGradient,
  title,
  badge,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportW, setViewportW] = useState(1280);

  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      setIsMobile(w < 760);
      setViewportW(w);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const endScale = isMobile ? 1 : 1.5;
  const { popEnd, rotateEnd, settleEnd, exitStart } = MACBOOK_PHASE;
  const hasChildren = Boolean(children);

  // Match CSS root scale breakpoints in MacbookProjects.module.css
  const rootScale =
    viewportW < 640 ? 0.58 : viewportW < 761 ? 0.72 : 1.22;
  const chassisPx = 512 * rootScale;
  // Cap lid so popped screen stays ~92% of viewport width (still > keyboard).
  // Mobile allows a higher cap so phones can actually reach ~90vw.
  const popCap = isMobile ? 2.2 : 1.4;
  const popEndScale = Math.min(
    popCap,
    Math.max(1.12, (viewportW * 0.92) / chassisPx),
  );
  const popMidScale = Math.min(1.1, 0.85 + popEndScale * 0.15);
  // Refs so scroll-linked transforms always read the latest viewport cap.
  const popEndScaleRef = React.useRef(popEndScale);
  const popMidScaleRef = React.useRef(popMidScale);
  const isMobileRef = React.useRef(isMobile);
  popEndScaleRef.current = popEndScale;
  popMidScaleRef.current = popMidScale;
  isMobileRef.current = isMobile;

  // Children: Aceternity-like pop, viewport-capped end scale. Function-form
  // avoids Chrome ViewTimeline bugs.
  //
  // One transform string so the op order is scale → rotate → translate about a
  // bottom origin — the same pipeline as the static back plate. At rest
  // (scaleX 1, scaleY 0.5, rotateX -25) the screen then projects exactly onto
  // the plate instead of rendering narrower under a mismatched perspective.
  const lidTransform = useTransform(scrollYProgress, (v) => {
    const stops = [0, popEnd, rotateEnd, settleEnd, exitStart, 1];
    const mid = popMidScaleRef.current;
    const end = popEndScaleRef.current;
    const mobile = isMobileRef.current;
    const sx = hasChildren
      ? phaseValue(v, stops, [1, mid, end, end, end, end])
      : phaseValue(v, [0, OPEN_END], [1.2, endScale]);
    const sy = hasChildren
      ? phaseValue(v, stops, [0.5, mid, end, end, end, end])
      : phaseValue(v, [0, OPEN_END], [0.6, endScale]);
    // Soften settle translate on narrow viewports so the open screen stays
    // under the sticky header instead of drifting down off-stage.
    const settleY = mobile ? 8 : 32;
    const midY = mobile ? 4 : 16;
    const t = hasChildren
      ? phaseValue(v, stops, [0, -28, midY, settleY, settleY, settleY])
      : phaseValue(v, [0, OPEN_END], [0, 1500]);
    const r = hasChildren
      ? phaseValue(v, stops, [-25, -25, 0, 0, 0, 0])
      : phaseValue(v, [0.1, 0.12, OPEN_END], [-28, -28, 0]);
    // Origin is the lid's bottom (384px = h-96); shift so the top edge lands
    // where the old top-origin layout put it: ty = t + 384·(sy − 1).
    const ty = t + 384 * (sy - 1);
    return `translateY(${ty}px) rotateX(${r}deg) scaleX(${sx}) scaleY(${sy})`;
  });
  // Interactive from settle onward — the open screen stays visible (and
  // clickable) even after the sticky releases.
  const screenPointerEvents = useTransform(scrollYProgress, (v): string => {
    if (!hasChildren) return "auto";
    return v >= settleEnd - 0.005 ? "auto" : "none";
  });
  const textTransform = useTransform(scrollYProgress, (v) =>
    phaseValue(v, [0, OPEN_END], [0, 100]),
  );
  const textOpacity = useTransform(scrollYProgress, (v) =>
    phaseValue(v, [0, 0.2], [1, 0]),
  );

  return (
    <div className="macbook-scroll-root flex shrink-0 flex-col items-center justify-start py-0 [perspective:800px]">
      {title ? (
        <motion.h2
          style={{
            translateY: textTransform,
            opacity: textOpacity,
          }}
          className="mb-20 text-center text-3xl font-bold text-neutral-800 dark:text-white"
        >
          {title}
        </motion.h2>
      ) : null}
      <div className="relative z-0 flex flex-col items-center">
        <div className="relative z-20">
          <Lid
            src={src}
            transform={lidTransform}
            pointerEvents={screenPointerEvents}
          >
            {children}
          </Lid>
        </div>
        <div className={styles.shell}>
          <div className={styles.shellNoise} aria-hidden="true" />
          <div className="relative z-[2] h-10 w-full">
            <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
          </div>
          <div className="relative z-[2] flex">
            <div className="mx-auto h-full w-[10%] overflow-hidden">
              <SpeakerGrid />
            </div>
            <div className="mx-auto h-full w-[80%]">
              <Keypad />
            </div>
            <div className="mx-auto h-full w-[10%] overflow-hidden">
              <SpeakerGrid />
            </div>
          </div>
          <Trackpad />
          <div className={styles.chin} aria-hidden="true" />
          {showGradient && <div className={styles.fadeGradient} />}
          {badge && <div className="absolute bottom-4 left-4 z-[4]">{badge}</div>}
        </div>
      </div>
    </div>
  );
};

export const Lid = ({
  transform,
  pointerEvents,
  src,
  children,
}: {
  transform: MotionValue<string>;
  pointerEvents?: MotionValue<string>;
  src?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          // Shared wrapper perspective only — a self perspective() here would
          // project the plate differently from the screen and break flushness.
          transform: "rotateX(-25deg)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className={styles.backPlate}
      >
        <div className={styles.backPlateInner}>
          <span className={styles.camera} aria-hidden="true" />
        </div>
      </div>
      <motion.div
        style={{
          transform,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
        }}
        className={styles.activeLid}
      >
        <div className={styles.screenGlass} />
        {children ? (
          <motion.div
            className={styles.screenContent}
            style={{ pointerEvents: pointerEvents ?? "auto" }}
          >
            {children}
          </motion.div>
        ) : src ? (
          <div className={styles.screenContent}>
            <Image
              src={src}
              alt=""
              fill
              className="object-cover object-left-top"
              sizes="(max-width: 760px) 90vw, 512px"
            />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return <div className={styles.trackpad} aria-hidden="true" />;
};

export const Keypad = () => {
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F9</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </div>

      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </KBtn>
        <KBtn>
          <span className="block">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn>
          <span className="block">&mdash;</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn
          className="w-10 items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          delete
        </KBtn>
      </div>

      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          tab
        </KBtn>
        <KBtn>
          <span className="block">Q</span>
        </KBtn>
        <KBtn>
          <span className="block">W</span>
        </KBtn>
        <KBtn>
          <span className="block">E</span>
        </KBtn>
        <KBtn>
          <span className="block">R</span>
        </KBtn>
        <KBtn>
          <span className="block">T</span>
        </KBtn>
        <KBtn>
          <span className="block">Y</span>
        </KBtn>
        <KBtn>
          <span className="block">U</span>
        </KBtn>
        <KBtn>
          <span className="block">I</span>
        </KBtn>
        <KBtn>
          <span className="block">O</span>
        </KBtn>
        <KBtn>
          <span className="block">P</span>
        </KBtn>
        <KBtn>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </KBtn>
      </div>

      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          caps lock
        </KBtn>
        <KBtn>
          <span className="block">A</span>
        </KBtn>
        <KBtn>
          <span className="block">S</span>
        </KBtn>
        <KBtn>
          <span className="block">D</span>
        </KBtn>
        <KBtn>
          <span className="block">F</span>
        </KBtn>
        <KBtn>
          <span className="block">G</span>
        </KBtn>
        <KBtn>
          <span className="block">H</span>
        </KBtn>
        <KBtn>
          <span className="block">J</span>
        </KBtn>
        <KBtn>
          <span className="block">K</span>
        </KBtn>
        <KBtn>
          <span className="block">L</span>
        </KBtn>
        <KBtn>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          return
        </KBtn>
      </div>

      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          shift
        </KBtn>
        <KBtn>
          <span className="block">Z</span>
        </KBtn>
        <KBtn>
          <span className="block">X</span>
        </KBtn>
        <KBtn>
          <span className="block">C</span>
        </KBtn>
        <KBtn>
          <span className="block">V</span>
        </KBtn>
        <KBtn>
          <span className="block">B</span>
        </KBtn>
        <KBtn>
          <span className="block">N</span>
        </KBtn>
        <KBtn>
          <span className="block">M</span>
        </KBtn>
        <KBtn>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          shift
        </KBtn>
      </div>

      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-[6px] w-[6px]" />
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
        >
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="w-[8.2rem]"></KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
        >
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBtn className="h-3 w-6">
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="h-3 w-6">
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretRightFilled className="h-[6px] w-[6px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  return (
    <div
      className={cn(
        "[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform]",
        /* Soft key edge only — shadow-xl bloom reads as a white fog on mobile */
        backlit && "bg-white/[0.14] shadow-[0_0_0_0.5px_rgba(255,255,255,0.28)]",
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]",
          className,
        )}
        style={{
          boxShadow:
            "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center text-[5px] text-neutral-200",
            childrenClassName,
            backlit && "text-white",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    ></div>
  );
};

export const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
};
