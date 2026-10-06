"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import {
  MACBOOK_PHASE,
  MacbookScroll,
} from "@/components/ui/macbook-scroll";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { SocialChromeLink } from "@/components/SocialIcons";
import { SITE } from "@/lib/site-data";
import styles from "./MacbookProjects.module.css";

function ProjectsScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.chrome} aria-hidden="true">
        <div className={styles.dots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.url}>dhir · projects</div>
      </div>

      <div className={styles.screenHead}>
        <h2 className={styles.screenTitle}>things i&apos;ve built</h2>
      </div>

      <div className={styles.screenCarousel}>
        <ProjectsCarousel list={SITE.projects} compact />
      </div>
    </div>
  );
}

function isSettled(v: number) {
  return v >= MACBOOK_PHASE.settleEnd - 0.005;
}

/* Progress for the open + interactive hold (between settle and exit). */
const HOLD_PROGRESS = (MACBOOK_PHASE.settleEnd + MACBOOK_PHASE.exitStart) / 2;

/* Phones (must match the max-width: 760px block in MacbookProjects.module.css):
   the stage is pinned low in the viewport rather than under the header, so
   progress is driven by how far the stage has travelled through its pin zone
   instead of by the zone's distance above the viewport top. The lid is fully
   open after PHONE_PIN_END's share of settleEnd (75% of the travel); the rest
   is the interactive hold. */
const PHONE_QUERY = "(max-width: 760px)";
const PHONE_PIN_END = 0.48;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServer = () => false;

function ContactsFooter() {
  const external = SITE.nav.filter((n) => n.href.startsWith("http"));
  const email = SITE.nav.find((n) => n.href.startsWith("mailto:"));

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <h2 className={styles.footerTitle}>my contacts</h2>

        <nav className={styles.footerLinks} aria-label="social links">
          {external.map((n) => (
            <SocialChromeLink key={n.label} href={n.href} label={n.label} size="lg" />
          ))}
          {email && (
            <SocialChromeLink href={email.href} label={email.label} size="lg" />
          )}
        </nav>
      </div>
    </footer>
  );
}

export function MacbookProjects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );

  // rAF sampling — window "scroll" events are unreliable with sticky pinning.
  // Pause when the pin zone is off-screen to avoid burning mobile battery.
  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    if (reducedMotion) {
      // Jump straight to the open + interactive hold once; no pin choreography,
      // so there is nothing to sample per frame.
      scrollYProgress.set(HOLD_PROGRESS);
      return;
    }

    let raf = 0;
    let visible = true;
    const phone = window.matchMedia(PHONE_QUERY);

    const tick = () => {
      raf = 0;
      if (!visible) return;
      const zoneTop = el.getBoundingClientRect().top;
      const stage = stageRef.current;
      let p: number;
      if (phone.matches && stage) {
        const travel = el.offsetHeight - stage.offsetHeight;
        const moved = stage.getBoundingClientRect().top - zoneTop;
        p =
          travel > 1
            ? Math.min(1, Math.max(0, moved / travel)) * PHONE_PIN_END
            : HOLD_PROGRESS;
      } else {
        const total = el.offsetHeight || 1;
        p = Math.min(1, Math.max(0, -zoneTop / total));
      }
      scrollYProgress.set(p);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);

    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollYProgress, reducedMotion]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinRef.current) pinRef.current.dataset.progress = v.toFixed(3);
  });

  // Keyboard users: the screen stays focusable throughout (pointer input is
  // gated by the lid's pointer-events until it settles). If focus lands on a
  // card/button before the lid has opened, jump the page to the settled hold
  // so the focused control is actually visible and usable.
  const handleFocus = useCallback(() => {
    const el = pinRef.current;
    if (!el || isSettled(scrollYProgress.get())) return;
    const zoneTop = el.getBoundingClientRect().top + window.scrollY;
    const stage = stageRef.current;
    let top = zoneTop + HOLD_PROGRESS * el.offsetHeight;
    if (stage && window.matchMedia(PHONE_QUERY).matches) {
      // Pin starts once the zone top reaches the stage's sticky offset.
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const travel = el.offsetHeight - stage.offsetHeight;
      top = zoneTop - stickyTop + (HOLD_PROGRESS / PHONE_PIN_END) * travel;
    }
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  }, [scrollYProgress, reducedMotion]);

  return (
    <section className={styles.section} aria-label="projects">
      <div
        ref={pinRef}
        className={`${styles.scrollZone}${reducedMotion ? ` ${styles.scrollZoneReduced}` : ""}`}
      >
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.macLayer} onFocus={handleFocus}>
            <MacbookScroll scrollYProgress={scrollYProgress}>
              <ProjectsScreen />
            </MacbookScroll>
          </div>
        </div>
      </div>

      <ContactsFooter />
    </section>
  );
}
