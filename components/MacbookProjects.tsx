"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import {
  MACBOOK_PHASE,
  MacbookScroll,
} from "@/components/ui/macbook-scroll";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
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
        <h3 className={styles.screenTitle}>things i&apos;ve built</h3>
      </div>

      <div className={styles.screenCarousel}>
        <ProjectsCarousel list={SITE.projects} compact />
      </div>
    </div>
  );
}

function inHoldWindow(v: number) {
  return (
    v >= MACBOOK_PHASE.settleEnd - 0.005 &&
    v < MACBOOK_PHASE.exitStart - 0.005
  );
}

export function MacbookProjects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // rAF sampling — window "scroll" events are unreliable with sticky pinning.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = pinRef.current;
      if (el) {
        if (reducedMotion) {
          // Jump to open + interactive hold; skip the long pin choreography.
          scrollYProgress.set(
            (MACBOOK_PHASE.settleEnd + MACBOOK_PHASE.exitStart) / 2,
          );
        } else {
          const total = el.offsetHeight || 1;
          const p = Math.min(
            1,
            Math.max(0, -el.getBoundingClientRect().top / total),
          );
          scrollYProgress.set(p);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress, reducedMotion]);

  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    setInteractive(inHoldWindow(scrollYProgress.get()));
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setInteractive(inHoldWindow(v));
    if (pinRef.current) pinRef.current.dataset.progress = v.toFixed(3);
  });

  const external = SITE.nav.filter((n) => n.href.startsWith("http"));
  const email = SITE.nav.find((n) => n.href.startsWith("mailto:"));

  return (
    <section className={styles.section} aria-label="projects">
      <div
        ref={pinRef}
        className={`${styles.scrollZone}${reducedMotion ? ` ${styles.scrollZoneReduced}` : ""}`}
      >
        <div className={styles.stage}>
          <div
            className={styles.macLayer}
            inert={!interactive ? true : undefined}
          >
            <MacbookScroll scrollYProgress={scrollYProgress}>
              <ProjectsScreen />
            </MacbookScroll>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerTitle}>my contacts</h2>

          <div className={styles.footerActions}>
            {email && (
              <WithLiquidMetal as="a" className="eng-btn lg" href={email.href}>
                {email.label}
                <span className="eng-arrow" aria-hidden="true">
                  →
                </span>
              </WithLiquidMetal>
            )}
            <nav className={styles.footerLinks} aria-label="social links">
              {external.map((n) => (
                <a key={n.label} href={n.href} target="_blank" rel="noreferrer">
                  {n.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </section>
  );
}
